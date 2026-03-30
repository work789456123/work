import type { LucideIcon } from "lucide-react";

export function lucideFromMap<M extends Record<string, LucideIcon>>(map: M, key: string): LucideIcon | undefined {
  if (key in map) {
    return map[key as keyof M];
  }
  return undefined;
}
