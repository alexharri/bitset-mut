import { bitstr } from "./bitstr";
import { WORD_LEN, WORD_LOG } from "./constants";

type IBits = BitSet | number;

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
  public set(index: number, value: number = 1): BitSet {
    const [w, bit] = parseIndex(index);
    this.resize(w + 1);
    if (value) {
      this.words[w] |= bit;
    } else {
      this.words[w] &= ~bit;
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
  public flip(index: number): BitSet {
    this.set(index, this.has(index) ? 0 : 1);
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
    this.resize(w.length);

    for (let i = 0; i < w.length; i++) {
      this.words[i] |= w[i];
    }
    return this;
  }

  public xor(bits: IBits): BitSet {
    const w = toWords(bits);

    // Make this bitset _at least_ as long as the BitSet being passed
    this.resize(w.length);

    for (let i = 0; i < w.length; i++) {
      this.words[i] ^= w[i];
    }
    return this;
  }

  /**
   * Sets all bits to zero, and sets the size and length of this BitSet to zero
   */
  public clear(): BitSet {
    this.words.length = 0;
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

  public resize(length: number): BitSet {
    while (this.words.length < length) {
      this.words.push(0);
    }
    return this;
  }

  *iterWords(): IterableIterator<[index: number, word: number]> {
    for (let i = 0; i < this.words.length; i++) {
      yield [i * WORD_LEN, this.words[i]];
    }
  }

  public clone() {
    return new BitSet(this);
  }

  public toString() {
    return toString(this.words);
  }
}

function toWords(bits: IBits, clone = false) {
  if (typeof bits === "number") {
    return [bits | 0];
  }
  return clone ? bits.words.concat() : bits.words;
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
