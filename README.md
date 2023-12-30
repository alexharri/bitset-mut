<h1 align="center">
  bitset-mut
</h1>

<p align="center">
  A highly performant bit set implementation, with a nice-to-use interface.
</p>

---

The `bitset-mut` package exports a single `BitSet` class.

```tsx
import { BitSet } from "bitset-mut";

const bitset = new BitSet();
```

As the package name suggests, most methods mutate the original `BitSet` instead of returning a new `BitSet`. This is done because cloning large `BitSet`s may prove expensive.

This can be worked around by cloning before mutating via the `clone()` method.

## Basic usage

```tsx
import { BitSet } from "bitset-mut";

const a = new BitSet("11110101");
const b = new BitSet([0, 2, 7]);

a.add(1).remove(5);
b.flip(4, 6);

console.log(a.and(b).toString());
//=> "11010101"
```

## Creating a `BitSet`

The `BitSet` constructor accepts:

- A bit string, only comprised of 0s and 1s (e.g. `"10011010"`)
- An array of indices, which sets the bits at the provided indices
- Another `BitSet`, which clones the provided `BitSet`

If no arguments are provided, an empty `BitSet` is created.

```tsx
new BitSet().toString();
//=> "0"

new BitSet("01100101").toString();
//=> "1100101"

new BitSet([0, 1, 5]).toString();
//=> "100011"
```

You can also create `BitSet`s using a few static methods:

```tsx
BitSet.fromIndices([0, 1, 5]).toString();
//=> "100011"

BitSet.fromBitMask(0b1001).toString();
//=> "1001"

BitSet.random(10).toString();
//=> "101001101"
```

## Usage

- [BitSet.add](#BitSet.add(index))
- [BitSet.remove](#BitSet.remove(index))
- [BitSet.has](#BitSet.has(index))
- [BitSet.set](#BitSet.set)
- [BitSet.setRange](#BitSet.setRange)
- [BitSet.setMultiple](#BitSet.setMultiple(indices))
- [BitSet.flip](#BitSet.flip(index))
- [BitSet.slice](#BitSet.slice())
- [BitSet.invert](#BitSet.invert())
- [BitSet.and](#BitSet.and(other))
- [BitSet.or](#BitSet.or(other))
- [BitSet.andNot](#BitSet.andNot(other))
- [BitSet.xor](#BitSet.xor(other))
- [BitSet.clear](#BitSet.clear())
- [BitSet.empty](#BitSet.empty())
- [BitSet.equals](#BitSet.equals(other))
- [BitSet.intersects](#BitSet.intersects(other))
- [BitSet.isEmpty](#BitSet.isEmpty())
- [BitSet.clone](#BitSet.clone())
- [BitSet.forEach](#BitSet.forEach(callback))
- [BitSet.Symbol.iterator](#BitSet[Symbol.iterator])
- [BitSet.toString](#BitSet.toString())
- [BitSet.size](#BitSet.size)
- [BitSet.length](#BitSet.length)
- [BitSet.cardinality](#BitSet.cardinality)

### BitSet.add(index)

```tsx
class BitSet {
  add(index: number): BitSet;
}
```

Sets the bit at `index` to 1, adding `index` to the set.

### BitSet.remove(index)

```tsx
class BitSet {
  remove(index: number): BitSet;
}
```

Sets the bit at `index` to 0, removing `index` from the set.

### BitSet.has(index)

```tsx
class BitSet {
  has(index: number): boolean;
}
```

<h3 id="BitSet.set">BitSet.set(index, value)</h3>

```tsx
class BitSet {
  set(index: number, value?: number = 1): boolean;
}
```

Sets the bit at `index` to 1 if `value` is truthy, and 0 otherwise. If `value` is not provided, it defaults to 1.

<h3 id="BitSet.setRange">BitSet.setRange(from, to, value)</h3>

```tsx
class BitSet {
  setRange(from: number, to: number, value?: number = 1): boolean;
}
```

Sets the bits between `from` and `to` (inclusive) to 1 if `value` is truthy, and 0 otherwise. If `value` is not provided, it defaults to 1.

### BitSet.setMultiple(indices)

```tsx
class BitSet {
  setMultiple(indices: number[], value?: number = 1): boolean;
}
```

Sets the bit at the `indices` to 1 if `value` is truthy, and 0 otherwise. If `value` is not provided, it defaults to 1.

### BitSet.flip(index)

```tsx
class BitSet {
  flip(index: number): BitSet;
}
```

Flips the bit at `index`, changing 0 to 1 and 1 to 0.

### BitSet.flip(from, to)

```tsx
class BitSet {
  flip(from: number, to: number): BitSet;
}
```

Flips the bit between `from` and `to` (inclusive), changing 0 to 1 and 1 to 0.

### BitSet.slice()

```tsx
class BitSet {
  slice(): BitSet;
}
```

Clones the bit set. To clone a specific portion, use `BitSet.slice(from, to)`.

### BitSet.slice(from, to)

```tsx
class BitSet {
  slice(from: number, to: number): BitSet;
}
```

Returns a new `BitSet` only containing the bits in the range `from` (inclusive) and `to` (exclusive).

### BitSet.invert()

```tsx
class BitSet {
  invert(): BitSet;
}
```

Inverts every bit in the bit set, changing 0 to 1 and 1 to 0.

### BitSet.and(other)

```tsx
class BitSet {
  and(other: BitSet): BitSet;
}
```

Performs bitwise AND (intersection), mutating the `BitSet`.

```tsx
const a = new BitSet("1011");
const b = new BitSet("1101");

a.and(b);

a.toString(); // 'a' has been mutated
//=> "1001"

b.toString(); // 'b' has not been mutated
//=> "1101"
```

### BitSet.or(other)

```tsx
class BitSet {
  or(other: BitSet): BitSet;
}
```

Performs bitwise OR (union), mutating the `BitSet`.

```tsx
const a = new BitSet("0101");
const b = new BitSet("1100");

a.or(b);

a.toString(); // 'a' has been mutated
//=> "1101"

b.toString(); // 'b' has not been mutated
//=> "1100"
```

### BitSet.andNot(other)

```tsx
class BitSet {
  andNot(other: BitSet): BitSet;
}
```

Performs bitwise AND NOT (subtraction), mutating the `BitSet`.

```tsx
const a = new BitSet("0111");
const b = new BitSet("1100");

a.andNot(b);

a.toString(); // 'a' has been mutated
//=> "0011"

b.toString(); // 'b' has not been mutated
//=> "1100"
```

### BitSet.xor(other)

```tsx
class BitSet {
  xor(other: BitSet): BitSet;
}
```

Performs bitwise XOR, mutating the `BitSet`.

```tsx
const a = new BitSet("0111");
const b = new BitSet("1100");

a.xor(b);

a.toString(); // 'a' has been mutated
//=> "1011"

b.toString(); // 'b' has not been mutated
//=> "1100"
```

### BitSet.clear()

```tsx
class BitSet {
  clear(): BitSet;
}
```

Sets all bits to zero without changing the size of the `BitSet`.

### BitSet.clear(index)

```tsx
class BitSet {
  clear(index: number): BitSet;
}
```

Sets the bit at the specified index to zero.

### BitSet.clear(from, to)

```tsx
class BitSet {
  clear(from: number, to: number): BitSet;
}
```

Sets the bits between `from` and `to` (inclusive) to zero

### BitSet.empty()

```tsx
class BitSet {
  empty(): BitSet;
}
```

Removes all bits from the bitset, setting its size to 0.

### BitSet.equals(other)

```tsx
class BitSet {
  equals(other: BitSet): boolean;
}
```

Returns true if this and the other `BitSet` are equal (have the same bits set to 1). The size of the `BitSet`s is not considered.

### BitSet.intersects(other)

```tsx
class BitSet {
  intersects(other: BitSet): boolean;
}
```

Returns true if this and the other `BitSet` have any bits set to 1 in common (i.e. if they overlap).

### BitSet.isEmpty()

```tsx
class BitSet {
  isEmpty(): boolean;
}
```

Returns true if no bits are set to 1.

### BitSet.clone()

```tsx
class BitSet {
  clone(): BitSet;
}
```

Returns a clone of the `BitSet`.

### BitSet.forEach(callback)

```tsx
class BitSet {
  forEach(callback: (index: number) => void): void;
}
```

Invokes `callback` with the index of every bit set to 1, in ascending order.

### BitSet[Symbol.iterator]

```tsx
class BitSet {
  [Symbol.iterator](): Iterator<number>;
}
```

Returns an iterator that yields the index of every bit set to 1, in ascending order.

### BitSet.toString()

```tsx
class BitSet {
  toString(): string;
}
```

Returns the `BitSet` serialized as a bit string (e.g. `"10001010"`).

### BitSet.size

```tsx
class BitSet {
  size: number;
}
```

Returns the number of bits in the `BitSet`.

### BitSet.length

```tsx
class BitSet {
  length: number;
}
```

Returns the number of words (32-bit integers) in the `BitSet`.

### BitSet.cardinality

```tsx
class BitSet {
  readonly cardinality: number;
}
```

Returns the number of bits (i.e. count) set to 1.
