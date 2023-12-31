# Benchmarks

This document compares the performance of `bitset-mut` with two other popular bit set implementations:

 * `bitset`
 * `fastbitset`

 ## Overview

Overall, `bitset-mut` and `fastbitset` are roughly equivalent in performance, while `bitset` is slower (often significantly so).

`bitset-mut` and `fastbitset` both mutate the original bit set, while some of `bitset`'s methods return a new `BitSet` instance. This makes some of `bitset`'s methods inherently slower (due to the cost of cloning).

API wise, `bitset-mut` and `bitset` have a much broader interface than `fastbitset`.

## Results

### `BitSet.add`

`fastbitset` is fastest, `bitset-mut` is slowest.

```
Running '50-times-100k-indices-from-0-to-10m' benchmark
  'bitset' ran in 108.6 ms
  'bitset-mut' ran in 111.8 ms
  'fastbitset' ran in 90.5 ms

Running '50-times-100k-indices-from-0-to-100k' benchmark 10 times
  'bitset' ran in 113.1 ms
  'bitset-mut' ran in 128.2 ms
  'fastbitset' ran in 97.0 ms
```

### `BitSet.and`

`fastbitset` and `bitset-mut` are fastest (`fastbitset` is slightly faster), while `bitset` is a bit slower.

```
Running '10-times-1k-bitstring-pairs-of-length-1k' benchmark
  'bitset' ran in 23.7 ms
  'fastbitset' ran in 16.8 ms
  'bitset-mut' ran in 18.1 ms
```

Note: `fastbitset` calls this method `intersection` instead of `and`.

### `BitSet.andNot`

`fastbitset` and `bitset-mut` are fastest (`fastbitset` is slightly faster), while `bitset` is notably slower.

```
Running '10-times-1k-bitstring-pairs-of-length-1k' benchmark
  'bitset' ran in 39.8 ms
  'fastbitset' ran in 18.2 ms
  'bitset-mut' ran in 23.9 ms
```

### `BitSet.cardinality`

`fastbitset` is fastest. Otherwise the results are somewhat mixed.

```
Running '10k-bitstrings' benchmark
  'bitset' ran in 194.4 ms
  'bitset-mut' ran in 213.2 ms
  'fastbitset' ran in 180.6 ms

Running '500-sparse-bitstrings' benchmark
  'bitset' ran in 199.2 ms
  'bitset-mut' ran in 105.5 ms
  'fastbitset' ran in 89.9 ms
```

### `BitSet.flip(index)`

`bitset` is fastest, but performance is comparable across the board.

```
Running '1m-indices' on random (dense) bitset benchmark
  'bitset' ran in 101.1 ms
  'bitset-mut' ran in 113.4 ms
  'fastbitset' ran in 110.0 ms
```

### `BitSet.flip(from, to)`

`bitset-mut` is fastest. `bitset` is >2x slower.

```
Running '1m-large-ranges' on random (dense) bitset benchmark
  'bitset' ran in 1221.6 ms
  'bitset-mut' ran in 302.3 ms

Running '100k-small-ranges' benchmark on sparse bitsets
  'bitset' ran in 667.3 ms
  'bitset-mut' ran in 311.0 ms
```

### `BitSet.has`

`fastbitset` is fastest.

```
Running '10-times-1k-bitstring-and-indices' benchmark
  'bitset' ran in 291.6 ms
  'bitset-mut' ran in 290.5 ms
  'fastbitset' ran in 113.4 ms
```

### `BitSet[Symbol.iterator]`

`fastbitset` is fastest, `bitset-mut` is a tad slower.

```
Running '10k-bitstrings' benchmark
  'bitset-mut' ran in 195.8 ms
  'fastbitset' ran in 184.3 ms

Running '500-sparse-bitstrings' benchmark
  'bitset-mut' ran in 63.0 ms
  'fastbitset' ran in 53.6 ms
```

`bitset`'s iterator implementation is quite weird, so it's not comparable. It iterates over every bit and yields 1 if the bit is set, and 0 if the bit is not set.

### `BitSet.or`

`fastbitset` is fastest, while `bitset` and `bitset-mut` are roughly equivalent.

```
Running '10-times-1k-bitstring-pairs-of-length-1k' benchmark
  'bitset' ran in 30.4 ms
  'fastbitset' ran in 24.5 ms
  'bitset-mut' ran in 31.0 ms
```

### `BitSet.setRange`

`bitset-mut` is fastest, `bitset` is ~10x slower.

```
Running '10-times-100k-ranges' benchmark
  'bitset' ran in 1350.9 ms
  'bitset-mut' ran in 133.8 ms
```

`fastbitset` does not support `setRange`.

### `BitSet.xor`

`fastbitset` and `bitset-mut` are fastest. `bitset` is slowest.

```
Running '10-times-1k-bitstring-pairs-of-length-1k' benchmark
  'bitset' ran in 37.9 ms
  'bitset-mut' ran in 28.8 ms
  'fastbitset' ran in 28.1 ms
```

Note: `fastbitset` calls this method `change` instead of `xor`.
