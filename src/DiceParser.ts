import { Dice } from "./Dice.js";

interface IDiceParser {
  parseDice(args: string[]): Dice[];
}

export class DiceParser implements IDiceParser {
  parseDice(args: string[]): Dice[] {
    this.validateDiceCount(args);
    return args.map((arg) => this.createDice(arg));
  }

  private validateDiceCount(args: string[]): void {
    if (args.length !== 3) {
      throw new Error("The game requires exactly 3 dice.");
    }
  }

  private createDice(arg: string): Dice {
    const values = this.parseValues(arg);
    this.validateValues(values, arg);
    return new Dice(values.map((v) => Number(v)));
  }

  private parseValues(arg: string): string[] {
    return arg.split(",");
  }

  private validateValues(values: string[], arg: string): void {
    if (
      values.length !== 6 ||
      values.some((v) => {
        const num = Number(v);
        return isNaN(num) || !Number.isInteger(num);
      })
    ) {
      throw new Error(
        `The wrong bone format: ${arg}. 6 numbers are expected, separated by commas.`
      );
    }
  }
}
