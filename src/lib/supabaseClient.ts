import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY não configurados — veja SUPABASE_SETUP.md."
  );
}

/**
 * Cliente Supabase usado pelo chat público, com a chave anônima (somente leitura,
 * restringida por RLS na tabela `chats` — ver SUPABASE_SETUP.md).
 *
 * Usa uma URL placeholder quando as variáveis de ambiente não estão definidas, só para
 * não quebrar o build antes da configuração — nesse caso as leituras falham em runtime
 * (tratadas como "chat não encontrado"), não no build.
 */
export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder");
