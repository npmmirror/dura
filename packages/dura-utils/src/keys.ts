import type { JsonObject } from "@dura/types";

export function keys(target: JsonObject) {
  return Object.keys(target);
}
