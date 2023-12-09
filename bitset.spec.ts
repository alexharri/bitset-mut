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

  test("BitSet.flip", () => {
    const bitset = new BitSet();

    bitset.setMultiple([0, 3, 17, 34, 38, 125]);
    expectBitIndices(bitset, [0, 3, 17, 34, 38, 125]); // Sanity check

    bitset.flip(17);
    expectBitIndices(bitset, [0, 3, 34, 38, 125]);

    bitset.flip(17);
    expectBitIndices(bitset, [0, 3, 17, 34, 38, 125]);

    bitset.flip(34);
    expectBitIndices(bitset, [0, 3, 17, 38, 125]);

    bitset.flip(125);
    expectBitIndices(bitset, [0, 3, 17, 38]);

    bitset.flip(19);
    expectBitIndices(bitset, [0, 3, 17, 19, 38]);

    bitset.flip(0);
    expectBitIndices(bitset, [3, 17, 19, 38]);

    bitset.flip(534);
    expectBitIndices(bitset, [3, 17, 19, 38, 534]);
  });

  test("BitSet.and", () => {
    const bitset = BitSet.fromIndices([1, 2, 3, 4, 5]);

    bitset.and(BitSet.fromIndices([0, 2, 3, 5, 6, 7]));
    expectBitIndices(bitset, [2, 3, 5]);

    bitset.and(BitSet.fromIndices([1, 3, 4, 5, 10000]));
    expectBitIndices(bitset, [3, 5]);

    bitset.add(750);
    expectBitIndices(bitset, [3, 5, 750]);

    bitset.and(BitSet.fromIndices([1, 3, 750]));
    expectBitIndices(bitset, [3, 750]);

    bitset.and(BitSet.fromIndices([]));
    expectBitIndices(bitset, []);
  });

  test("BitSet.or", () => {
    const bitset = BitSet.fromIndices([1, 3, 6, 12]);

    bitset.or(BitSet.fromIndices([3, 5, 6]));
    expectBitIndices(bitset, [1, 3, 5, 6, 12]);

    bitset.or(BitSet.fromIndices([500]));
    expectBitIndices(bitset, [1, 3, 5, 6, 12, 500]);

    bitset.or(BitSet.fromIndices([0, 1, 100, 738]));
    expectBitIndices(bitset, [0, 1, 3, 5, 6, 12, 100, 500, 738]);

    bitset.or(BitSet.fromIndices([]));
    expectBitIndices(bitset, [0, 1, 3, 5, 6, 12, 100, 500, 738]);
  });

  test("BitSet.xor", () => {
    const bitset = BitSet.fromIndices([1, 3, 6, 12]);

    bitset.xor(BitSet.fromIndices([3, 5, 6]));
    expectBitIndices(bitset, [1, 5, 12]);

    bitset.xor(BitSet.fromIndices([0, 12, 100, 123]));
    expectBitIndices(bitset, [0, 1, 5, 100, 123]);

    bitset.xor(BitSet.fromIndices([]));
    expectBitIndices(bitset, [0, 1, 5, 100, 123]);
  });

  test("BitSet.invert", () => {
    const bitset = new BitSet();

    expectBits(bitset, "0");
    bitset.invert();
    expectBits(bitset, "0");

    bitset.set(0);

    expectBits(bitset, "1");
    bitset.invert();
    expectBits(bitset, "11111111111111111111111111111110");

    bitset.flip(13);
    bitset.flip(7);

    expectBits(bitset, "11111111111111111101111101111110");
    bitset.invert();
    expectBits(bitset, "10000010000001");

    bitset.flip(50);

    expectBits(bitset, "100000000000000000000000000000000000010000010000001");
    bitset.invert();
    expectBits(
      bitset,
      "1111111111111011111111111111111111111111111111111101111101111110"
    );
  });

  test("BitSet.clear", () => {
    const bitset = BitSet.fromIndices([1, 35, 125]);

    expectBitIndices(bitset, [1, 35, 125]);
    expect(bitset.size).toEqual(128);
    expect(bitset.length).toEqual(4);

    bitset.clear();

    expectBitIndices(bitset, []);
    expect(bitset.size).toEqual(0);
    expect(bitset.length).toEqual(0);
  });
});
