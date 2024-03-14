export class BitSet {
  private bits: Uint8Array;

  constructor(size: number) {
    this.bits = new Uint8Array(Math.ceil(size / 8));
  }

  set(index: number) {
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;
    this.bits[byteIndex] |= 1 << bitIndex;
  }

  clear(index: number) {
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;
    this.bits[byteIndex] &= ~(1 << bitIndex);
  }

  check(index: number) {
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;
    return (this.bits[byteIndex] & (1 << bitIndex)) !== 0;
  }
}
