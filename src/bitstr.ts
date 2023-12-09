import { WORD_LEN } from "./constants";

export function bitstr(word: number, trim: boolean = false): string {
  let i = WORD_LEN - 1;
  if (trim) {
    while ((word & (1 << i)) === 0) {
      i--;
    }
  }
  let out = "";
  while (i >= 0) {
    out += (word & (1 << i--)) === 0 ? "0" : "1";
  }
  return out;
}
