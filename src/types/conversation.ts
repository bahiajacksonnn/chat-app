/**
 * Tipos centrais do motor de conversa (Conversation Engine).
 * Qualquer alteração aqui deve permanecer compatível com o arquivo de dados em `src/data/conversation.ts`.
 */

/** Tipos de mensagem suportados. Apenas 'text', 'image' e 'system' estão implementados nesta versão. */
export type MessageType =
  | "text"
  | "image"
  | "audio"
  | "video"
  | "system"
  | "link"
  | "button"
  | "cta";

/** Quem "enviou" a mensagem dentro da experiência. */
export type MessageSender = "character" | "user" | "system";

/** Estado de presença exibido no cabeçalho do chat. */
export type CharacterStatus = "online" | "typing" | "recording" | "offline";

export interface ChatMessage {
  /** Identificador único dentro do fluxo (não precisa ser globalmente único). */
  id: string;
  type: MessageType;
  sender: MessageSender;
  /** Texto da mensagem, ou caminho/URL quando type = 'image' | 'audio' | 'video' | 'link'. */
  content: string;
  /** Tempo (ms) de espera antes de iniciar o indicador "digitando..." para esta mensagem. */
  delay?: number;
  /** Duração (ms) do indicador "digitando..." antes da mensagem aparecer. */
  typingDuration?: number;
  /** Metadados extras específicos do tipo de mensagem (alt de imagem, url de link, etc). */
  meta?: {
    imageAlt?: string;
    linkUrl?: string;
    linkLabel?: string;
    width?: number;
    height?: number;
  };
}

export interface ResponseOption {
  id: string;
  label: string;
  /** Id do próximo ConversationStep no conversationFlow. */
  nextStepId: string;
}

export interface ConversationStep {
  id: string;
  messages: ChatMessage[];
  /** Opções de resposta exibidas após todas as mensagens do passo serem exibidas. */
  options?: ResponseOption[];
  /** Quando não há opções, permite avançar automaticamente para o próximo passo. */
  autoAdvance?: {
    nextStepId: string;
    delay?: number;
  };
}

export type ConversationFlow = Record<string, ConversationStep>;

/** Mensagem já exibida no chat, com metadados de quando/onde ela apareceu. */
export interface DisplayedMessage extends ChatMessage {
  stepId: string;
  timestamp: number;
}

export interface ConversationPersistedState {
  currentStepId: string;
  displayedMessages: DisplayedMessage[];
  version: number;
}

export interface CharacterProfile {
  name: string;
  initials: string;
  avatarUrl?: string;
  accentFrom: string;
  accentTo: string;
}

/** Forma completa dos dados editáveis pelo painel de admin e servidos ao chat. */
export interface ConversationData {
  character: CharacterProfile;
  startStepId: string;
  flow: ConversationFlow;
}

/**
 * Metadados de um chat individual (um por operador/link). Cada chat tem seu próprio
 * `slug`, que é a parte final do link público (`/c/<slug>`), e seus próprios dados de conversa.
 */
export interface ChatSummary {
  slug: string;
  label: string;
  createdAt: number;
  updatedAt: number;
}

/** Um chat completo: metadados + dados da conversa, como persistido em disco. */
export type StoredChat = ChatSummary & ConversationData;
