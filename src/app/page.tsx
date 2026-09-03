import { redirect } from "next/navigation";
import { DEFAULT_CHAT_SLUG } from "@/utils/config";

export default function Home() {
  redirect(`/c/${DEFAULT_CHAT_SLUG}`);
}
