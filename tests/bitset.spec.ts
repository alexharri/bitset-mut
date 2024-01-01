import { describe, expect, test } from "vitest";
import { BitSet } from "../src/bitset";
import { WORD_LEN } from "../src/constants";

function expectBits(bitset: BitSet, bits: string) {
  expect(String(bitset)).toEqual(bits);
}

function expectBitIndices(bitset: BitSet, expectedIndices: number[]) {
  const actualIndices = [];
  for (let i = 0; i < bitset.words.length; i++) {
    const wi = i * WORD_LEN;
    const word = bitset.words[i];
    for (let bi = 0; bi < WORD_LEN; bi += 1) {
      if ((word & (1 << bi)) !== 0) {
        actualIndices.push(wi + bi);
      }
    }
  }
  expect(actualIndices).toEqual(expectedIndices);
}

function range(from: number, to: number) {
  const arr: number[] = [];
  for (let i = from; i <= to; i++) {
    arr.push(i);
  }
  return arr;
}

describe("BitSet", () => {
  test("creating a new bitset", () => {
    expectBits(new BitSet(), "0");
    expectBits(BitSet.fromBitMask(0b0110110), "110110");
    expectBits(new BitSet(BitSet.fromBitMask(0b0110110)), "110110");
    expectBits(new BitSet(""), "0");
    expectBits(
      new BitSet("0000000000000000000000000000000000000000000000000000000"),
      "0"
    );
    expectBits(new BitSet("00000001"), "1");
    expectBits(new BitSet("0110011"), "110011");
    expectBits(
      new BitSet(
        "0000000000000000000000000000100100000000000000000000000000001000"
      ),
      "100100000000000000000000000000001000"
    );
    expectBits(new BitSet([1, 4, 11]), "100000010010");
  });

  test("strings with characters other than '0' and '1' are rejected", () => {
    expect(() => new BitSet("0b01")).toThrow(
      "Unexpected character 'b'. Expected '0' or '1'"
    );
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

    bitset.set(125, 0);
    expectBitIndices(bitset, [3, 17, 34, 38, 30584, 3674859]);

    bitset.set(17, 0);
    expectBitIndices(bitset, [3, 34, 38, 30584, 3674859]);

    bitset.set(38, 1); // No-op
    expectBitIndices(bitset, [3, 34, 38, 30584, 3674859]);

    bitset.set(54, 0); // No-op
    expectBitIndices(bitset, [3, 34, 38, 30584, 3674859]);
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

  test("BitSet.andNot", () => {
    const bitset = BitSet.fromIndices([1, 2, 3, 4, 5]);

    bitset.andNot(BitSet.fromIndices([0, 6, 7, 128]));
    expectBitIndices(bitset, [1, 2, 3, 4, 5]);

    bitset.andNot(BitSet.fromIndices([2, 4]));
    expectBitIndices(bitset, [1, 3, 5]);

    bitset.set(50);
    expectBitIndices(bitset, [1, 3, 5, 50]);

    bitset.andNot(BitSet.fromBitMask(0b1000));
    expectBitIndices(bitset, [1, 5, 50]);

    bitset.andNot(BitSet.fromIndices([58]));
    expectBitIndices(bitset, [1, 5, 50]);

    bitset.andNot(BitSet.fromIndices([50]));
    expectBitIndices(bitset, [1, 5]);
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

    // Calling 'BitSet.clear' sets all bits to zero, but does not
    // reduce the size of the BitSets
    expect(bitset.size).toEqual(128);
    expect(bitset.length).toEqual(4);

    bitset.setRange(10, 20);

    expectBitIndices(bitset, range(10, 20));

    bitset.clear(14, 19);
    expectBitIndices(bitset, [...range(10, 13), 20]);

    bitset.clear(12);
    expectBitIndices(bitset, [10, 11, 13, 20]);

    bitset.clear();
    expectBitIndices(bitset, []);
  });

  test("BitSet.cardinality", () => {
    const bitset = BitSet.fromIndices([1, 35, 125]);
    expect(bitset.cardinality()).toEqual(3);

    // Add 5 bits to the bitset
    for (const n of [0, 2, 3, 4, 5]) {
      bitset.add(n);
    }
    expect(bitset.cardinality()).toEqual(8);

    // Add 4 more bits
    for (const n of [1005, 504, 128, 73]) {
      bitset.add(n);
    }
    expect(bitset.cardinality()).toEqual(12);

    // Remove 3 bits
    for (const n of [1, 1005, 128]) {
      bitset.remove(n);
    }
    expect(bitset.cardinality()).toEqual(9);
  });

  test("BitSet.clone", () => {
    const bitset = new BitSet();
    bitset.setMultiple([0, 5, 10]);

    const clone = bitset.clone();

    expectBitIndices(bitset, [0, 5, 10]);
    expectBitIndices(clone, [0, 5, 10]);

    clone.flip(5);

    expectBitIndices(bitset, [0, 5, 10]);
    expectBitIndices(clone, [0, 10]);
  });

  test("BitSet.equals", () => {
    expect(
      BitSet.fromIndices([1, 10, 50]).equals(
        BitSet.fromIndices([1, 10, 50, 100])
      )
    ).toEqual(false);
    expect(
      BitSet.fromIndices([1, 10, 50, 100]).equals(
        BitSet.fromIndices([1, 10, 50])
      )
    ).toEqual(false);

    const a = BitSet.fromBitMask(0b1001);
    const b = BitSet.fromBitMask(0b1001);
    expect(a.equals(b)).toEqual(true);
    a.flip(100);
    expect(a.equals(b)).toEqual(false);
    a.flip(100);

    // Even though the size/length of 'a' and 'b' is not the same, they're still equal
    // because they have the same bits set to one
    expect(a.size !== b.size).toEqual(true);
    expect(a.length !== b.length).toEqual(true);
    expect(a.equals(b)).toEqual(true);
  });

  test("BitSet.intersects", () => {
    expect(
      BitSet.fromIndices([1, 2, 3]).intersects(BitSet.fromIndices([3, 4, 5]))
    ).toEqual(true);
    expect(
      BitSet.fromIndices([1, 2]).intersects(BitSet.fromIndices([3, 4, 5]))
    ).toEqual(false);
    expect(
      BitSet.fromIndices([1, 2]).intersects(BitSet.fromIndices([32, 33]))
    ).toEqual(false);
    expect(
      BitSet.fromIndices([32]).intersects(BitSet.fromIndices([0, 100]))
    ).toEqual(false);
    expect(
      BitSet.fromIndices([1, 100, 200]).intersects(BitSet.fromIndices([100]))
    ).toEqual(true);
    expect(
      BitSet.fromIndices([100]).intersects(BitSet.fromIndices([1, 100, 200]))
    ).toEqual(true);
  });

  test("BitSet.isEmpty", () => {
    const bitset = new BitSet();
    expect(bitset.isEmpty()).toEqual(true);

    bitset.flip(100);
    expect(bitset.isEmpty()).toEqual(false);
    bitset.flip(200);
    expect(bitset.isEmpty()).toEqual(false);
    bitset.flip(100);
    expect(bitset.isEmpty()).toEqual(false);
    bitset.flip(200);
    expect(bitset.isEmpty()).toEqual(true);
  });

  test("BitSet.setRange", () => {
    const bitset = new BitSet();

    bitset.setRange(5, 16);
    expectBitIndices(bitset, range(5, 16));

    bitset.setRange(10, 14, 0);
    expectBitIndices(bitset, [...range(5, 9), ...range(15, 16)]);

    bitset.setRange(29, 40);
    expectBitIndices(bitset, [
      ...range(5, 9),
      ...range(15, 16),
      ...range(29, 40),
    ]);

    bitset.setRange(100, 200);
    expectBitIndices(bitset, [
      ...range(5, 9),
      ...range(15, 16),
      ...range(29, 40),
      ...range(100, 200),
    ]);

    bitset.setRange(38, 129, 0);
    expectBitIndices(bitset, [
      ...range(5, 9),
      ...range(15, 16),
      ...range(29, 37),
      ...range(130, 200),
    ]);

    bitset.setRange(60, 50, true);
    expectBitIndices(bitset, [
      ...range(5, 9),
      ...range(15, 16),
      ...range(29, 37),
      ...range(50, 60),
      ...range(130, 200),
    ]);

    bitset.setRange(55, 70, false);
    expectBitIndices(bitset, [
      ...range(5, 9),
      ...range(15, 16),
      ...range(29, 37),
      ...range(50, 54),
      ...range(130, 200),
    ]);

    bitset.setRange(1, 1);
    expectBitIndices(bitset, [
      1,
      ...range(5, 9),
      ...range(15, 16),
      ...range(29, 37),
      ...range(50, 54),
      ...range(130, 200),
    ]);
  });

  test("BitSet.flipRange", () => {
    const bitset = new BitSet();

    bitset.flipRange(50, 100);
    expectBitIndices(bitset, range(50, 100));

    bitset.flipRange(45, 72);
    expectBitIndices(bitset, [...range(45, 49), ...range(73, 100)]);

    bitset.flipRange(10, 7);
    expectBitIndices(bitset, [
      ...range(7, 10),
      ...range(45, 49),
      ...range(73, 100),
    ]);

    bitset.flipRange(10, 10);
    expectBitIndices(bitset, [
      ...range(7, 9),
      ...range(45, 49),
      ...range(73, 100),
    ]);

    // Alternative syntax for flipRange
    bitset.flip(90, 110);
    expectBitIndices(bitset, [
      ...range(7, 9),
      ...range(45, 49),
      ...range(73, 89),
      ...range(101, 110),
    ]);
  });

  test("BitSet[Symbol.iterator]", () => {
    const bitset = new BitSet();

    const bits = [1, 2, 3, 4, 8, 9, 10, 34, 80, ...range(100, 300), 1111];
    for (const n of bits) {
      bitset.set(n);
    }

    const yieldedBits: number[] = [];
    for (const bit of bitset) {
      yieldedBits.push(bit);
    }
    expect(yieldedBits).toEqual(bits);
  });
  test("BitSet.forEach", () => {
    const bitset = new BitSet();

    const bits = [0, 1, 2, 3, 4, 8, 9, 10, 34, 80, ...range(100, 300), 1111];
    for (const n of bits) {
      bitset.set(n);
    }

    const yieldedBits: number[] = [];
    bitset.forEach((bit) => yieldedBits.push(bit));
    expect(yieldedBits).toEqual(bits);
  });

  test("BitSet.slice", () => {
    const bitset = BitSet.fromIndices([
      1, 3, 13, 15, 16, 17, 18, 20, 29, 30, 31, 32, 33, 34, 36,
    ]);

    expectBitIndices(
      bitset.slice(12, 18),
      [13, 15, 16, 17].map((x) => x - 12)
    );

    expectBitIndices(
      bitset.slice(18, 12),
      [13, 15, 16, 17].map((x) => x - 12)
    );

    expectBitIndices(bitset.slice(16, 16), []);

    expectBitIndices(bitset.slice(16, 17), [16 - 16]);

    expectBitIndices(
      bitset.slice(16, 18),
      [16, 17].map((x) => x - 16)
    );

    expectBitIndices(
      bitset.slice(12, 16),
      [13, 15].map((x) => x - 12)
    );

    expectBitIndices(
      bitset.slice(16, 20),
      [16, 17, 18].map((x) => x - 16)
    );

    expectBitIndices(
      bitset.slice(13, 50),
      [13, 15, 16, 17, 18, 20, 29, 30, 31, 32, 33, 34, 36].map((x) => x - 13)
    );
  });
});
