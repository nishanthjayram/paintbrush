export class BitSet {
  private bits: Uint32Array;
  private readonly size: number;

  constructor(size: number) {
    this.size = size;
    this.bits = new Uint32Array(Math.ceil(size / 32));
  }

  private getIndices(index: number) {
    const wordIndex = index >>> 5;
    const bitIndex = index & 31;
    return { wordIndex, bitIndex };
  }

  set(index: number) {
    if (index >= this.size) return;
    const { wordIndex, bitIndex } = this.getIndices(index);
    this.bits[wordIndex] |= 1 << bitIndex;
  }

  clear(index: number) {
    if (index >= this.size) return;
    const { wordIndex, bitIndex } = this.getIndices(index);
    this.bits[wordIndex] &= ~(1 << bitIndex);
  }

  check(index: number) {
    const { wordIndex, bitIndex } = this.getIndices(index);
    return (this.bits[wordIndex] & (1 << bitIndex)) !== 0;
  }

  clearAll() {
    this.bits.fill(0);
  }

  setRange(start: number, end: number) {
    const startWord = start >>> 5;
    const endWord = end >>> 5;

    if (startWord === endWord) {
      const mask = ((1 << ((end & 31) + 1)) - 1) & ~((1 << (start & 31)) - 1);
      this.bits[startWord] |= mask;
      return;
    }

    // Set first partial word
    this.bits[startWord] |= ~((1 << (start & 31)) - 1);

    // Set full words
    for (let i = startWord + 1; i < endWord; i++) {
      this.bits[i] = 0xffffffff;
    }

    // Set last partial word
    this.bits[endWord] |= (1 << ((end & 31) + 1)) - 1;
  }
}
