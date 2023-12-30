import FastBitSet from "fastbitset";

export function makeFastBitSet(bitstr: string) {
  const bitset = new FastBitSet();
  for (let i = 0; i < bitstr.length; i++) {
    if (bitstr[i] === "1") {
      bitset.add(i);
    }
  }
  return bitset;
}

export function makeRandomFastBitSet(size: number) {
  const bitset = new FastBitSet();
  for (let i = 0; i < size; i++) {
    if (Math.random() > 0.5) {
      bitset.add(i);
    }
  }
  return bitset;
}
