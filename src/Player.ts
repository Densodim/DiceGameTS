import { Dice } from "./Dice.js";
import readline from "node:readline/promises";

interface IPlayer {
  chooseDice(diceOptions: Dice[]): Promise<void>;
  getDice(): Dice | null;
  getName(): string;
}

export class Player implements IPlayer {
  private dice: Dice | null = null;

  constructor(private name: string) {}

  async chooseDice(diceOptions: Dice[]): Promise<void> {
    console.log("Available dice:");
    diceOptions.forEach((die, i) => {
      console.log(`${i}: ${die.getValues()}`);
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const choice = await rl.question("Select a die by number: ");
    rl.close();

    this.dice = diceOptions[parseInt(choice)];
  }

  getDice(): Dice | null {
    return this.dice;
  }

  getName(): string {
    return this.name;
  }
}
