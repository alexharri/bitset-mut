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
