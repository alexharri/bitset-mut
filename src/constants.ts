export const WORD_LEN = 32;
export const WORD_LEN_HALF = 16;
export const WORD_LOG = 5; // 2 ** 5 === 32
export const BIT_INDEX_MASK = 2 ** WORD_LOG - 1;
export const WORD_FIRST_HALF_MASK = 0x0000ffff;
export const WORD_LATTER_HALF_MASK = 0xffff0000;

export const ALL_ONES_NUM = 2 ** WORD_LEN - 1;
