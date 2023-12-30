# Benchmarks

This document compares the performance of `bitset-mut` with two other popular bit set implementations:

 * `bitset`
 * `fastbitset`

 ## Overview

Overall, `bitset-mut` and `fastbitset` are roughly equivalent in performance, while `bitset` is slower (often significantly so).

`bitset-mut` and `fastbitset` both mutate the original bit set, while some of `bitset`'s methods return a new `BitSet` instance. This makes some of `bitset`'s methods inherently slower (due to the cost of cloning).

API wise, `bitset-mut` and `bitset` have a much broader interface than `fastbitset`.

## Results

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

### `BitSet.flip`

`bitset` is fastest, but performance is comparable across the board.

```
Running '1m-indices' on random (dense) bitset benchmark
  'bitset' ran in 101.1 ms
  'bitset-mut' ran in 113.4 ms
  'fastbitset' ran in 110.0 ms
```