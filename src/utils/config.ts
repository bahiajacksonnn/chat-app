/**
 * Configurações globais do Conversation Engine.
 * Ajuste estes valores para alterar o ritmo da conversa em toda a aplicação.
 */

/** Liga/desliga o salvamento do progresso da conversa no localStorage. */
export const PERSISTENCE_ENABLED = true;

/** Cada chat (um por operador/link) guarda seu progresso separadamente no localStorage. */
export function getStorageKey(slug: string): string {
  return `chat-experience:conversation-state:${slug}`;
}
/** Incremente ao mudar a forma do estado persistido para invalidar saves antigos. */
export const STORAGE_VERSION = 1;

/** Slug do chat padrão/demo, servido em `/` (via redirect) e `/c/default`. */
export const DEFAULT_CHAT_SLUG = "default";

/** Espera padrão (ms) antes do indicador "digitando..." aparecer para uma mensagem do personagem. */
export const DEFAULT_MESSAGE_DELAY = 900;

/** Duração padrão (ms) do indicador "digitando..." antes da mensagem ser revelada. */
export const DEFAULT_TYPING_DURATION = 1100;

/** Pequeno intervalo (ms) usado entre mensagens de sistema ou antes de um autoAdvance. */
export const INTER_MESSAGE_GAP = 500;
