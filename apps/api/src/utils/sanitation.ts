import * as z from "zod";
import { QueryError } from "../errors/common.error.ts";
import type { Nullish } from "./types.ts";

export function safeRegexEscape(userInput: Nullish<string>) {
    const result = z.string().max(50).safeParse(userInput)
    if (result.error) {
      console.error(result.error);
      return new QueryError({message: 'Invalid or excessively long search term.'});
  }
  return result.data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
