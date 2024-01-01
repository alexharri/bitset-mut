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

type IBits = BitSet | string | number[];

export class BitSet {
  public words: number[];

  constructor(bits?: IBits) {
    if (bits == null) {
      this.words = [];
      return;
    }
    this.words = toWords(bits, true);
  }

  public static fromBitMask(bitmask: number): BitSet {
    const bitset = new BitSet();
    bitset.words = [bitmask | 0];
    return bitset;
  }

  public static fromIndices(indices: number[]): BitSet {
    const bitset = new BitSet();
    bitset.words = indicesToWords(indices);
    return bitset;
  }

  public static random(size: number) {
    const bitset = new BitSet();
    bitset.size = size;
    for (let i = 0; i < bitset.size; i++) {
      if (Math.random() > 0.5) {
        bitset.flip(i);
      }
    }
    return bitset;
  }

  /**
   * Sets the bit at `index` to 1 if `value` is truthy, and 0 otherwise. If
   * `value` is not provided, it defaults to 1.
   */
  public set(index: number, value: number | boolean = 1): BitSet {
    const w = index >> WORD_LOG;
    const bit = 1 << index;
    resize(this.words, w);
    if (value) {
      this.words[w] |= bit;
    } else {
      this.words[w] &= ~bit;
    }
    return this;
  }

  /**
   * Sets the bits between from and to (inclusive) to 1 if value is truthy, and
   * 0 otherwise. If value is not provided, it defaults to 1.
   */
  public setRange(
    from: number,
    to: number,
    value: number | boolean = 1
  ): BitSet {
    if (from > to) {
      const temp = from;
      from = to;
      to = temp;
    }

    const w0 = from >> WORD_LOG;
    const w1 = to >> WORD_LOG;
    resize(this.words, w1);

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
   * Sets the bit at `index` to 1, adding `index` to the set.
   */
  public add(index: number): BitSet {
    const w = index >> WORD_LOG;
    const bit = 1 << index;
    resize(this.words, w);
    this.words[w] |= bit;
    return this;
  }

  /**
   * Sets the bit at `index` to 0, removing `index` from the set.
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
    const w = indexOrFrom >> WORD_LOG;
    resize(this.words, w);
    this.words[w] ^= 1 << indexOrFrom;
    return this;
  }

  public flipRange(from: number, to: number): BitSet {
    if (from > to) {
      const temp = from;
      from = to;
      to = temp;
    }

    const w0 = from >> WORD_LOG;
    const w1 = to >> WORD_LOG;
    resize(this.words, w1);

    for (let w = w0; w <= w1; w++) {
      // This optimization seems to yield a ~5% speed increase on sparse
      // sets, but does not seem to affect performance in a measurable
      // manner for dense sets.
      if (w === 0) {
        if (w > w0 && w < w1) {
          this.words[w] = ALL_ONES_NUM;
          continue;
        }
      } else if (w === ALL_ONES_NUM) {
        if (w > w0 && w < w1) {
          this.words[w] = 0;
          continue;
        }
      }

      const start = w === w0 ? from & BIT_INDEX_MASK : 0;
      const end = w === w1 ? to & BIT_INDEX_MASK : WORD_LEN - 1;

      let word = this.words[w];
      for (let b = start; b <= end; b++) {
        word ^= 1 << b;
      }
      this.words[w] = word;
    }

    return this;
  }

  public slice(from?: number, to?: number): BitSet {
    if (typeof to === "number" && from == null) from = 0;
    if (from == null) return this.clone();
    if (to == null) to = this.size;
    if (from > to) {
      const temp = from;
      from = to;
      to = temp;
    }

    const bitset = new BitSet();
    bitset.size = to - from; // Pre-allocate

    this.forEachInRange(from, to, (bit) => bitset.set(bit - from!));

    return bitset;
  }

  public invert(): BitSet {
    const w = this.words;
    for (let i = 0; i < w.length; i++) {
      w[i] = ~w[i];
    }
    return this;
  }

  /**
   * Returns true if the bit at `index` is set to 0, and false otherwise.
   */
  public has(index: number): boolean {
    const w = index >> WORD_LOG;
    const bit = 1 << index;
    if (w >= this.words.length) return false;
    return (this.words[w] & bit) !== 0;
  }

  public get(index: number): number {
    return this.has(index) ? 1 : 0;
  }

  public and(other: BitSet): BitSet {
    const w0 = this.words;
    const w1 = other.words;
    const len = Math.min(w0.length, w1.length);

    let i = 0;
    // Increases performance by about ~8%
    for (; i + 7 < len; i += 8) {
      w0[i] &= w1[i];
      w0[i + 1] &= w1[i + 1];
      w0[i + 2] &= w1[i + 2];
      w0[i + 3] &= w1[i + 3];
      w0[i + 4] &= w1[i + 4];
      w0[i + 5] &= w1[i + 5];
      w0[i + 6] &= w1[i + 6];
      w0[i + 7] &= w1[i + 7];
    }
    for (; i < len; i++) {
      w0[i] &= w1[i];
    }
    for (; i < w0.length; i++) {
      w0[i] = 0;
    }
    return this;
  }

  public andNot(other: IBits): BitSet {
    const w0 = this.words;
    const w1 = toWords(other);
    const len = Math.min(w0.length, w1.length);

    for (let i = 0; i < len; i++) {
      w0[i] &= ~w1[i];
    }
    return this;
  }

  public or(other: IBits): BitSet {
    const w = toWords(other);

    // Make this bitset _at least_ as long as the BitSet being passed
    resize(this.words, w.length);

    for (let i = 0; i < w.length; i++) {
      this.words[i] |= w[i];
    }
    return this;
  }

  public xor(other: IBits): BitSet {
    const w = toWords(other);

    // Make this bitset _at least_ as long as the BitSet being passed
    resize(this.words, w.length);

    for (let i = 0; i < w.length; i++) {
      this.words[i] ^= w[i];
    }
    return this;
  }

  /**
   * Sets all bits to zero without changing the size of the BitSet
   */
  public clear(): BitSet;
  /**
   * Sets the bit at the specified index to zero
   */
  public clear(index: number): BitSet;
  /**
   * Sets the bits in the specified range to zero
   */
  public clear(from: number, to: number): BitSet;
  public clear(from?: number, to?: number): BitSet {
    if (typeof to === "number") {
      this.setRange(from!, to, 0);
    } else if (typeof from === "number") {
      this.set(from, 0);
    } else {
      for (let i = 0; i < this.words.length; i++) {
        this.words[i] = 0;
      }
    }
    return this;
  }

  /**
   * Removes all bits from the bitset, setting its size to 0
   */
  public empty() {
    this.words = [];
  }

  /**
   * @returns the number of bits set to 1 in this BitSet
   */
  public cardinality(): number {
    const words = this.words;
    const len = words.length;
    let cardinality = 0;
    for (let i = 0; i < len; i++) {
      const word = words[i];
      cardinality += hammingWeight(word);
    }
    return cardinality;
  }

  public equals(bits: IBits): boolean {
    let w0 = this.words;
    let w1 = toWords(bits);
    if (w0.length < w1.length) {
      const temp = w1;
      w1 = w0;
      w0 = temp;
    }
    // if (w0.length < w1.length) [w0, w1] = [w1, w0];
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
    const len = Math.min(w0.length, w1.length);
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

  public set size(value: number) {
    const length = Math.ceil(value / WORD_LEN);
    if (this.words.length > length) {
      this.words.length = length;
      return;
    }
    resize(this.words, length);
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

  public toArray() {
    const out: number[] = [];
    this.forEach((i) => out.push(i));
    return out;
  }

  forEachInRange(from: number, to: number, callback: (index: number) => void) {
    if (from > to) {
      const temp = from;
      from = to;
      to = temp;
    }
    const w0 = from >> WORD_LOG;
    const w1 = to >> WORD_LOG;
    for (let i = w0; i <= w1; i++) {
      const w = this.words[i];
      if (w === 0) continue;
      const wordBase = i << WORD_LOG;

      const start = i === w0 ? from & BIT_INDEX_MASK : 0;
      const end = i === w1 ? to & BIT_INDEX_MASK : WORD_LEN;

      if (start < WORD_LEN_HALF && (w & WORD_FIRST_HALF_MASK) !== 0) {
        const firstHalfEnd = Math.min(WORD_LEN_HALF, end);
        for (let b = start; b < firstHalfEnd; b++) {
          if ((w & (1 << b)) != 0) callback(wordBase + b);
        }
      }
      if (end > WORD_LEN_HALF && (w & WORD_LATTER_HALF_MASK) !== 0) {
        const latterHalfStart = Math.max(WORD_LEN_HALF, start);
        for (let b = latterHalfStart; b < end; b++) {
          if ((w & (1 << b)) != 0) callback(wordBase + b);
        }
      }
    }
  }

  forEach(callback: (index: number) => void) {
    const words = this.words;
    const len = words.length;
    for (let wordIndex = 0; wordIndex < len; wordIndex++) {
      let word = words[wordIndex];
      while (word !== 0) {
        const lsb = word & -word;
        const index = (wordIndex << WORD_LOG) + hammingWeight(lsb - 1);
        word ^= lsb;
        callback(index);
      }
    }
  }

  [Symbol.iterator](): Iterator<number> {
    const words = this.words;
    const len = words.length;

    let wordIndex = 0;
    let word = words[0];

    return {
      next: () => {
        while (wordIndex < len) {
          if (word !== 0) {
            const lsb = word & -word;
            const index = (wordIndex << WORD_LOG) + hammingWeight(lsb - 1);
            word ^= lsb;
            return { done: false, value: index };
          } else {
            wordIndex++;
            word = words[wordIndex];
          }
        }
        return { done: true, value: -1 };
      },
    };
  }
}

function resize(words: number[], length: number) {
  for (let i = words.length; i < length; i++) {
    words.push(0);
  }
}

function indicesToWords(indices: number[]) {
  const words: number[] = [];

  let maxWordIndex = -1;
  for (let i = 0; i < indices.length; i++) {
    const wordIndex = indices[i] >> WORD_LOG;
    if (wordIndex > maxWordIndex) maxWordIndex = wordIndex;
  }
  resize(words, maxWordIndex);

  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    words[index >> WORD_LOG] |= 1 << index;
  }

  return words;
}

function toWords(bits: IBits, clone = false): number[] {
  if (bits instanceof BitSet) {
    return clone ? bits.words.concat() : bits.words;
  }
  if (Array.isArray(bits)) {
    return indicesToWords(bits);
  }
  if (typeof bits === "string") {
    return bitStringToWords(bits);
  }
  throw new Error(`Failed to parse bits ${bits}`);
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
function hammingWeight(n: number): number {
  n -= (n >> 1) & 0x55555555;
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
  return (((n + (n >>> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}
