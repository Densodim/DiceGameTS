export class Dice {
  constructor(private values: number[]) {}

  roll(): number {
    return this.values[Math.floor(Math.random() * this.values.length)];
  }

  getValues(): number[] {
    return this.values;
  }
}

interface IDice {
  roll(): number;
  getValues(): number[];
}
