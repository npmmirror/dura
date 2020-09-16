import type { JsonObject } from "@dura/types";
export function merge(prev: JsonObject = {}, next: JsonObject = {}) {
  return { ...prev, ...next };
}
