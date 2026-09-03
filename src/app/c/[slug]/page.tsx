import { ChatPage } from "@/components/chat/ChatPage";

export default async function Page(props: PageProps<"/c/[slug]">) {
  const { slug } = await props.params;
  return <ChatPage slug={slug} />;
}
