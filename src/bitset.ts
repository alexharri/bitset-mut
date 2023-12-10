import { bitstr } from "./bitstr";
import {
  ALL_ONES_NUM,
  BIT_INDEX_MASK,
  WORD_FIRST_HALF_MASK,
  WORD_LATTER_HALF_MASK,
  WORD_LEN,
  WORD_LEN_HALF,
  WORD_LOG,
} from "./constants";

type IBits = BitSet | string | number;

export class BitSet {
  public words: number[];

  constructor(bits?: IBits) {
    if (bits == null) {
      this.words = [];
      return;
    }
    this.words = toWords(bits, true);
  }

  public static fromIndices(indices: number[]) {
    const bitset = new BitSet();
    bitset.setMultiple(indices);
    return bitset;
  }

  /**
   * Set bit at index to 0 or 1 (default 1)
   *
   * @param index index of bit to set
   * @param value 0 or 1
   */
  public set(index: number, value: number | boolean = 1): BitSet {
    set(this.words, index, value);
    return this;
  }

  public setRange(
    from: number,
    to: number,
    value: number | boolean = 1
  ): BitSet {
    if (from > to) [from, to] = [to, from];

    const w0 = from >> WORD_LOG;
    const w1 = to >> WORD_LOG;
    resize(this.words, w1 + 1);

    for (let w = w0; w <= w1; w++) {
      if (w > w0 && w < w1) {
        this.words[w] = value ? ALL_ONES_NUM : 0;
        continue;
      }

      let word = this.words[w];
      const start = w === w0 ? from & BIT_INDEX_MASK : 0;
      const end = w === w1 ? to & BIT_INDEX_MASK : WORD_LEN - 1;

      for (let b = start; b <= end; b++) {
        if (value) {
          word |= 1 << b;
        } else {
          word &= ~(1 << b);
        }
      }
      this.words[w] = word;
    }

    return this;
  }

  /**
   * Set bit at index to 1 (i.e. add it to the set)
   */
  public add(index: number): BitSet {
    return this.set(index);
  }

  /**
   * Set bit at index to 0 (i.e. remove it from the set)
   */
  public remove(index: number): BitSet {
    return this.set(index, 0);
  }

  public setMultiple(indices: number[], value: number = 1): BitSet {
    indices.forEach((i) => this.set(i, value));
    return this;
  }

  /**
   * Flip the bit at the provided index
   */
  public flip(index: number): BitSet;
  public flip(from: number, to: number): BitSet;
  public flip(indexOrFrom: number, to?: number): BitSet {
    if (typeof to === "number") return this.flipRange(indexOrFrom, to);
    this.set(indexOrFrom, this.has(indexOrFrom) ? 0 : 1);
    return this;
  }

  public flipRange(from: number, to: number): BitSet {
    if (from > to) [from, to] = [to, from];

    const w0 = from >> WORD_LOG;
    const w1 = to >> WORD_LOG;
    resize(this.words, w1 + 1);

    for (let w = w0; w <= w1; w++) {
      let word = this.words[w];

      if (w > w0 && w < w1 && (word === 0 || word === ALL_ONES_NUM)) {
        this.words[w] = word === 0 ? ALL_ONES_NUM : 0;
        continue;
      }

      const start = w === w0 ? from & BIT_INDEX_MASK : 0;
      const end = w === w1 ? to & BIT_INDEX_MASK : WORD_LEN - 1;

      for (let b = start; b <= end; b++) {
        if ((word & (1 << b)) === 0) {
          word |= 1 << b;
        } else {
          word &= ~(1 << b);
        }
      }
      this.words[w] = word;
    }

    return this;
  }

  public invert(): BitSet {
    const w = this.words;
    for (let i = 0; i < w.length; i++) {
      w[i] = ~w[i];
    }
    return this;
  }

  public has(index: number): boolean {
    const [w, bit] = parseIndex(index);
    if (w >= this.words.length) return false;
    return (this.words[w] & bit) !== 0;
  }

  public and(bits: IBits): BitSet {
    const w0 = this.words;
    const w1 = toWords(bits);
    const len = Math.min(w0.length, w1.length);

    for (let i = 0; i < len; i++) {
      w0[i] &= w1[i];
    }
    for (let i = w1.length; i < w0.length; i++) {
      w0[i] = 0;
    }
    return this;
  }

  public andNot(bits: IBits): BitSet {
    const w0 = this.words;
    const w1 = toWords(bits);
    const len = Math.min(w0.length, w1.length);

    for (let i = 0; i < len; i++) {
      w0[i] &= ~w1[i];
    }
    return this;
  }

  public or(bits: IBits): BitSet {
    const w = toWords(bits);

    // Make this bitset _at least_ as long as the BitSet being passed
    resize(this.words, w.length);

    for (let i = 0; i < w.length; i++) {
      this.words[i] |= w[i];
    }
    return this;
  }

  public xor(bits: IBits): BitSet {
    const w = toWords(bits);

    // Make this bitset _at least_ as long as the BitSet being passed
    resize(this.words, w.length);

    for (let i = 0; i < w.length; i++) {
      this.words[i] ^= w[i];
    }
    return this;
  }

  /**
   * Sets all bits to zero, and sets the size and length of this BitSet to zero
   */
  public clear(): BitSet;
  public clear(index: number): BitSet;
  public clear(from: number, to: number): BitSet;
  public clear(from?: number, to?: number): BitSet {
    if (typeof to === "number") {
      this.setRange(from!, to, 0);
    } else if (typeof from === "number") {
      this.set(from, 0);
    } else {
      this.words.length = 0;
    }
    return this;
  }

  /**
   * @returns the number of bits set to 1 in this BitSet
   */
  public get cardinality(): number {
    let cardinality = 0;
    for (const w of this.words) {
      cardinality += numberOfBitsSetToOne(w);
    }
    return cardinality;
  }

  public equals(bits: IBits): boolean {
    let w0 = this.words;
    let w1 = toWords(bits);
    if (w0.length < w1.length) [w0, w1] = [w1, w0];
    for (let i = 0; i < w1.length; i++) {
      if (w0[i] !== w1[i]) return false;
    }
    for (let i = w1.length; i < w0.length; i++) {
      if (w0[i] !== 0) return false;
    }
    return true;
  }

  public intersects(bits: IBits): boolean {
    let w0 = this.words;
    let w1 = toWords(bits);
    const len = Math.min(w0.length, w0.length);
    for (let i = 0; i < len; i++) {
      if ((w0[i] & w1[i]) !== 0) return true;
    }
    return false;
  }

  public isEmpty(): boolean {
    return this.words.every((w) => w === 0);
  }

  /**
   * Returns the number of bits that are in use by this BitSet
   */
  public get size(): number {
    return this.words.length * WORD_LEN;
  }

  /**
   * Returns the number of integers (32 bit) that are in use by this BitSet
   */
  public get length(): number {
    return this.words.length;
  }

  public clone(): BitSet {
    return new BitSet(this);
  }

  public toString() {
    return toString(this.words);
  }

  *iterWords(): IterableIterator<[index: number, word: number]> {
    for (let i = 0; i < this.words.length; i++) {
      yield [i * WORD_LEN, this.words[i]];
    }
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.words.length; i++) {
      const w = this.words[i];
      if (w === 0) continue;
      const wordBase = i << WORD_LOG;
      if ((w & WORD_FIRST_HALF_MASK) !== 0) {
        for (let b = 0; b < WORD_LEN_HALF; b++) {
          if ((w & (1 << b)) != 0) yield wordBase + b;
        }
      }
      if ((w & WORD_LATTER_HALF_MASK) !== 0) {
        for (let b = WORD_LEN_HALF; b < WORD_LEN; b++) {
          if ((w & (1 << b)) != 0) yield wordBase + b;
        }
      }
    }
  }
}

function set(words: number[], index: number, value: number | boolean): void {
  const [w, bit] = parseIndex(index);
  resize(words, w + 1);
  if (value) {
    words[w] |= bit;
  } else {
    words[w] &= ~bit;
  }
}

function resize(words: number[], length: number) {
  while (words.length < length) {
    words.push(0);
  }
}

function toWords(bits: IBits, clone = false): number[] {
  if (typeof bits === "number") {
    return [bits | 0];
  }
  if (typeof bits === "string") {
    return bitStringToWords(bits);
  }
  return clone ? bits.words.concat() : bits.words;
}

function bitStringToWords(s: string): number[] {
  // Check for invalid input
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "0" && s[i] !== "1") {
      throw new Error(`Unexpected character '${s[i]}'. Expected '0' or '1'`);
    }
  }

  // Trim leading zeroes
  const firstOne = s.indexOf("1");
  if (firstOne === -1) return [];
  if (firstOne > 0) s = s.slice(firstOne);

  const out: number[] = [];
  for (let i = 0; i * WORD_LEN < s.length; i++) {
    const end = s.length - i * WORD_LEN;
    const start = end - WORD_LEN;
    const si = s.slice(Math.max(0, start), end);
    out.push(parseInt(si, 2));
  }
  return out;
}

function parseIndex(index: number): [wordIndex: number, bit: number] {
  return [index >> WORD_LOG, 1 << index];
}

function toString(words: number[]) {
  const firstNonZeroWord = words.findIndex((word) => word !== 0);
  if (firstNonZeroWord === -1) return "0";

  let out = "";
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i];
    const first = i === words.length - 1;
    out += bitstr(word, first);
  }
  return out;
}

/**
 * @returns the number of bits set to one in the provided number
 */
function numberOfBitsSetToOne(n: number): number {
  n -= (n >> 1) & 0x55555555;
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
  return (((n + (n >>> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}
