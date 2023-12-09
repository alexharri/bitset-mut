import { bitstr } from "./bitstr";
import { WORD_LEN, WORD_LOG } from "./constants";

type IBits = BitSet | number;

const ALL_ZEROES_STR = Array(32).fill("0").join("");
const ALL_ONES_STR = Array(32).fill("1").join("");

const ALL_ONES_NUM = 2 ** 32 - 1;

export class BitSet {
  private w: number[];

  constructor(bits?: IBits) {
    if (typeof bits === "number") {
      this.w = [bits & ALL_ONES_NUM];
      return;
    }
    if (!bits) {
      this.w = [];
      return;
    }
    this.w = bits.w.concat();
  }

  /**
   * Set bit at index to 0 or 1 (default 1).
   *
   * @param index index of bit to set
   * @param value 0 or 1
   */
  public set(index: number, value: number = 1) {
    const [w, bit] = parseIndex(index);
    this.resize(w + 1);
    if (value) {
      this.w[w] |= bit;
    } else {
      this.w[w] &= ~bit;
    }
  }

  public setMultiple(indices: number[], value: number = 1) {
    indices.forEach((i) => this.set(i));
  }

  public has(index: number) {
    const [w, bit] = parseIndex(index);
    if (w >= this.w.length) return false;
    return (this.w[w] & bit) !== 0;
  }

  /**
   * Number of 32 bit
   *
   * @param length
   */
  public resize(length: number) {
    while (this.w.length < length) {
      this.w.push(0);
    }
  }

  *iterWords(): IterableIterator<[index: number, word: number]> {
    for (let i = 0; i < this.w.length; i++) {
      yield [i * WORD_LEN, this.w[i]];
    }
  }

  public toString() {
    return toString(this.w);
  }
}

function parseIndex(index: number): [wordIndex: number, bit: number] {
  return [index >> WORD_LOG, 1 << index];
}

function toString(words: number[]) {
  const firstNonZeroWord = words.findIndex((word) => word !== 0);
  if (firstNonZeroWord === -1) return "0";
  return words
    .slice(firstNonZeroWord)
    .map((word, i) => {
      const first = i === 0;

      if (!first) {
        if (word === 0) {
          return ALL_ZEROES_STR;
        } else if (word === ALL_ONES_NUM) {
          return ALL_ONES_STR;
        }
      }

      return bitstr(word, first);
    })
    .join("");
}
