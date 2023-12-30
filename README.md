# BitSet

## Creating a `BitSet`

The `BitSet` constructor accepts one of:

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

You can also create a `BitSet` using some static methods:

```tsx
BitSet.fromIndices([0, 1, 5]).toString();
//=> "100011"

BitSet.fromBitMask(0b1001).toString();
//=> "1001"

BitSet.random(10).toString();
//=> "101001101"
```

## Methods

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

### BitSet.set(index, value)

```tsx
class BitSet {
  set(index: number, value?: number = 1): boolean;
}
```

Sets the bit at `index` to 1 if `value` is truthy, and 0 otherwise. If `value` is not provided, it defaults to 1.

### BitSet.setRange(from, to, value)

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

### BitSet.slice

```tsx
class BitSet {
  slice(from?: number, to?: number): BitSet;
}
```

Returns a new `BitSet` only containing the bits in the range `from` and `to` (exclusive).

### BitSet.invert

```tsx
class BitSet {
  invert(): BitSet;
}
```

Inverts every bit in the bit set, changing 0 to 1 and 1 to 0.

### BitSet.and

```tsx
class BitSet {
  and(bits: BitSet): BitSet;
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

### BitSet.or

```tsx
class BitSet {
  or(bits: BitSet): BitSet;
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

### BitSet.andNot

```tsx
class BitSet {
  andNot(bits: BitSet): BitSet;
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

### BitSet.andNot

```tsx
class BitSet {
  xor(bits: BitSet): BitSet;
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

### BitSet.cardinality

```tsx
class BitSet {
  cardinality: number;
}
```

Returns the number of bits (i.e. count) set to 1.
