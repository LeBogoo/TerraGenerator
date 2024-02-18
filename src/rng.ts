export class RNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = Math.floor(seed);
  }

  private lcg(): number {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);

    this.seed = (a * this.seed + c) % m;

    return this.seed / m;
  }

  next(): number {
    // Generate a random number between 0 and 0xffffff (16777215)
    return Math.floor(this.lcg() * 0xffffff);
  }
}
