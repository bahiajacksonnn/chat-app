import { supabase } from "./supabaseClient";
import type { ConversationFlow, CharacterProfile, StoredChat } from "@/types/conversation";

/**
 * Leitura de chats a partir do Supabase (tabela `chats`, ver SUPABASE_SETUP.md).
 * Este app é somente leitura: criar/editar/remover chats é feito pelo `admin-app`,
 * que roda separadamente (normalmente só no computador de quem administra os chats).
 */
interface ChatRow {
  slug: string;
  label: string;
  character: CharacterProfile;
  start_step_id: string;
  flow: ConversationFlow;
  created_at: string;
  updated_at: string;
}

function rowToChat(row: ChatRow): StoredChat {
  return {
    slug: row.slug,
    label: row.label,
    character: row.character,
    startStepId: row.start_step_id,
    flow: row.flow,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

export async function readChat(slug: string): Promise<StoredChat | null> {
  const { data, error } = await supabase.from("chats").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return rowToChat(data as ChatRow);
}
