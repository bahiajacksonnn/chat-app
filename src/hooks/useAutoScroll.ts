"use client";

import { useEffect, useRef } from "react";

/**
 * Retorna um ref para colocar no final da lista de mensagens.
 * Sempre que `deps` mudar, rola suavemente até ele.
 */
export function useAutoScroll<T extends HTMLElement>(deps: unknown[]) {
  const endRef = useRef<T | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return endRef;
}
