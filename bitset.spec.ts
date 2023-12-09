import { describe, expect, test } from "vitest";
import { BitSet } from "./src/bitset";
import { WORD_LEN } from "./src/constants";

function expectBits(bitset: BitSet, bits: string) {
  expect(String(bitset)).toEqual(bits);
}

function expectBitIndices(bitset: BitSet, expectedIndices: number[]) {
  const actualIndices = [];
  for (const [wi, word] of bitset.iterWords()) {
    for (let bi = 0; bi < WORD_LEN; bi += 1) {
      if ((word & (1 << bi)) !== 0) {
        actualIndices.push(wi + bi);
      }
    }
  }
  expect(actualIndices).toEqual(expectedIndices);
}

describe("BitSet", () => {
  test("creating a new bitset", () => {
    expectBits(new BitSet(), "0");
    expectBits(new BitSet(0b0110110), "110110");
    expectBits(new BitSet(new BitSet(0b0110110)), "110110");
  });

  test("BitSet.set", () => {
    const bitset = new BitSet();
    expectBitIndices(bitset, []);

    bitset.set(3);
    expectBitIndices(bitset, [3]);

    bitset.set(38);
    expectBitIndices(bitset, [3, 38]);

    bitset.set(34);
    expectBitIndices(bitset, [3, 34, 38]);

    bitset.set(17);
    expectBitIndices(bitset, [3, 17, 34, 38]);

    bitset.set(125);
    expectBitIndices(bitset, [3, 17, 34, 38, 125]);

    bitset.set(30584);
    expectBitIndices(bitset, [3, 17, 34, 38, 125, 30584]);

    bitset.set(3674859);
    expectBitIndices(bitset, [3, 17, 34, 38, 125, 30584, 3674859]);
  });

  test("BitSet.has", () => {
    const bitset = new BitSet();

    bitset.setMultiple([3, 17, 34, 38, 125, 30584]);
    expectBitIndices(bitset, [3, 17, 34, 38, 125, 30584]); // Sanity check

    for (const index of [3, 17, 34, 38, 125, 30584]) {
      expect(bitset.has(index)).toEqual(true);
    }
    for (const index of [0, 1, 2, 4, 14, 33, 40, 126, 123, 30585, 10000000]) {
      expect(bitset.has(index)).toEqual(false);
    }
  });
});
