import { WORD_LEN } from "./constants";

const ALL_ZEROES_STR = Array(32).fill("0").join("");
const ALL_ONES_STR = Array(32).fill("1").join("");
const ALL_ONES_NUM = 2 ** 32 - 1;

export function bitstr(word: number, trim: boolean = false): string {
  if (!trim) {
    if (word === 0) {
      return ALL_ZEROES_STR;
    } else if (word === ALL_ONES_NUM) {
      return ALL_ONES_STR;
    }
  }

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
