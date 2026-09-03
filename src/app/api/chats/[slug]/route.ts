import { NextResponse } from "next/server";
import { readChat } from "@/lib/chatStore";

type RouteContext = { params: Promise<{ slug: string }> };

/** Único endpoint deste app: leitura pública de um chat, servida ao `/c/<slug>`. */
export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const chat = await readChat(slug);
  if (!chat) {
    return NextResponse.json({ error: "Chat não encontrado." }, { status: 404 });
  }
  return NextResponse.json(chat);
}
