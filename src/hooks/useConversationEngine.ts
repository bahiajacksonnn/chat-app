"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CharacterStatus,
  ConversationData,
  ConversationPersistedState,
  DisplayedMessage,
  ResponseOption,
} from "@/types/conversation";
import {
  DEFAULT_MESSAGE_DELAY,
  DEFAULT_TYPING_DURATION,
  INTER_MESSAGE_GAP,
  PERSISTENCE_ENABLED,
  STORAGE_VERSION,
  getStorageKey,
} from "@/utils/config";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadPersistedState(slug: string): ConversationPersistedState | null {
  if (!PERSISTENCE_ENABLED || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(getStorageKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConversationPersistedState;
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function savePersistedState(slug: string, state: ConversationPersistedState) {
  if (!PERSISTENCE_ENABLED || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getStorageKey(slug), JSON.stringify(state));
  } catch {
    // localStorage indisponível (modo privado, quota etc.) — falha silenciosa.
  }
}

export function clearPersistedState(slug: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getStorageKey(slug));
  } catch {
    // ignore
  }
}

type ActivityIndicator = "typing" | "recording" | null;

interface ConversationEngineState {
  displayedMessages: DisplayedMessage[];
  currentOptions: ResponseOption[];
  activeIndicator: ActivityIndicator;
  characterStatus: CharacterStatus;
  selectOption: (option: ResponseOption) => void;
  restart: () => void;
}

/**
 * Motor de conversa: consome os dados de um chat (carregados de `/api/chats/<slug>`,
 * editáveis pelo painel de admin) e controla o avanço passo a passo, o indicador de
 * "digitando.../gravando áudio...", as opções de resposta disponíveis e a persistência
 * do progresso em localStorage (isolada por `slug`, já que cada link é um chat diferente).
 *
 * `data` deve ser `null` até o fetch inicial terminar — o motor só começa quando recebe dados.
 */
export function useConversationEngine(slug: string, data: ConversationData | null): ConversationEngineState {
  const [displayedMessages, setDisplayedMessages] = useState<DisplayedMessage[]>([]);
  const [currentOptions, setCurrentOptions] = useState<ResponseOption[]>([]);
  const [activeIndicator, setActiveIndicator] = useState<ActivityIndicator>(null);
  const [characterStatus, setCharacterStatus] = useState<CharacterStatus>("online");

  const currentStepIdRef = useRef<string>("");
  // Incrementado a cada nova "corrida" (start/restart/troca de slug) para cancelar timeouts pendentes antigos.
  const runIdRef = useRef(0);
  // Guarda o slug já inicializado; permite reinicializar corretamente se o slug mudar sem remontar o componente.
  const initializedForSlugRef = useRef<string | null>(null);

  const flow = data?.flow;
  const startStepId = data?.startStepId;

  const persist = useCallback(
    (messages: DisplayedMessage[], stepId: string) => {
      savePersistedState(slug, { currentStepId: stepId, displayedMessages: messages, version: STORAGE_VERSION });
    },
    [slug]
  );

  const processStep = useCallback(
    async (stepId: string, runId: number) => {
      const step = flow?.[stepId];
      if (!step) return;

      currentStepIdRef.current = stepId;
      setCurrentOptions([]);

      for (const message of step.messages) {
        if (runIdRef.current !== runId) return;

        const delay = message.delay ?? DEFAULT_MESSAGE_DELAY;
        const typingDuration = message.typingDuration ?? DEFAULT_TYPING_DURATION;

        if (message.sender === "character") {
          const indicator: ActivityIndicator = message.type === "audio" ? "recording" : "typing";

          await wait(delay);
          if (runIdRef.current !== runId) return;

          setCharacterStatus(indicator === "recording" ? "recording" : "typing");
          setActiveIndicator(indicator);
          await wait(typingDuration);
          if (runIdRef.current !== runId) return;

          setActiveIndicator(null);
          setCharacterStatus("online");
        } else {
          await wait(Math.min(delay, INTER_MESSAGE_GAP));
          if (runIdRef.current !== runId) return;
        }

        setDisplayedMessages((prev) => {
          const next = [...prev, { ...message, stepId, timestamp: Date.now() }];
          persist(next, stepId);
          return next;
        });
      }

      if (runIdRef.current !== runId) return;

      if (step.options && step.options.length > 0) {
        setCurrentOptions(step.options);
        return;
      }

      if (step.autoAdvance) {
        await wait(step.autoAdvance.delay ?? INTER_MESSAGE_GAP);
        if (runIdRef.current !== runId) return;
        await processStep(step.autoAdvance.nextStepId, runId);
      }
    },
    [flow, persist]
  );

  const selectOption = useCallback(
    (option: ResponseOption) => {
      if (!flow) return;
      setCurrentOptions([]);

      const userMessage: DisplayedMessage = {
        id: `user-${option.id}-${Date.now()}`,
        type: "text",
        sender: "user",
        content: option.label,
        stepId: currentStepIdRef.current,
        timestamp: Date.now(),
      };

      setDisplayedMessages((prev) => {
        const next = [...prev, userMessage];
        persist(next, currentStepIdRef.current);
        return next;
      });

      const runId = ++runIdRef.current;
      void processStep(option.nextStepId, runId);
    },
    [flow, processStep, persist]
  );

  const restart = useCallback(() => {
    if (!startStepId) return;
    clearPersistedState(slug);
    runIdRef.current += 1;
    const runId = runIdRef.current;

    setDisplayedMessages([]);
    setCurrentOptions([]);
    setActiveIndicator(null);
    setCharacterStatus("online");
    currentStepIdRef.current = startStepId;

    void processStep(startStepId, runId);
  }, [processStep, startStepId, slug]);

  // Troca de chat (slug): invalida qualquer corrida em andamento e limpa a tela
  // antes que os dados do novo chat cheguem.
  useEffect(() => {
    runIdRef.current += 1;
    initializedForSlugRef.current = null;
    setDisplayedMessages([]);
    setCurrentOptions([]);
    setActiveIndicator(null);
    setCharacterStatus("online");
    currentStepIdRef.current = "";
  }, [slug]);

  useEffect(() => {
    if (!flow || !startStepId || initializedForSlugRef.current === slug) return;
    initializedForSlugRef.current = slug;

    const runId = runIdRef.current;
    const persisted = loadPersistedState(slug);
    const persistedStepExists = persisted ? Boolean(flow[persisted.currentStepId]) : false;

    if (persisted && persisted.displayedMessages.length > 0 && persistedStepExists) {
      setDisplayedMessages(persisted.displayedMessages);
      currentStepIdRef.current = persisted.currentStepId;

      const step = flow[persisted.currentStepId];
      if (step?.options && step.options.length > 0) {
        setCurrentOptions(step.options);
      } else if (step?.autoAdvance) {
        void processStep(step.autoAdvance.nextStepId, runId);
      }
    } else {
      currentStepIdRef.current = startStepId;
      void processStep(startStepId, runId);
    }
  }, [flow, startStepId, slug, processStep]);

  return { displayedMessages, currentOptions, activeIndicator, characterStatus, selectOption, restart };
}
