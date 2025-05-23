export class GameMessages {
  static gameStart(dice: string[]): void {
    console.log("Game started with dice:", dice);
  }

  static showProbabilities(probabilities: string): void {
    console.log(probabilities);
  }

  static determineFirstMove(): void {
    console.log("Let's determine who makes the first move.");
  }

  static showRandomValue(hmac: string): void {
    console.log(`I selected a random value in the range 0..1 (HMAC=${hmac}).`);
  }

  static showGuessOptions(): void {
    console.log("Try to guess my selection.");
    for (let i = 0; i <= 1; i++) {
      console.log(`${i} - ${i}`);
    }
    console.log("X - exit");
    console.log("? - help");
  }

  static showSelection(randomNumber: number, key: string): void {
    console.log(`My selection: ${randomNumber} (KEY=${key}).`);
  }

  static showFirstMove(isComputer: boolean): void {
    console.log(`${isComputer ? "I" : "You"} make the first move.`);
  }

  static showDiceChoice(isComputer: boolean, dice: string): void {
    console.log(`${isComputer ? "I" : "You"} choose the [${dice}] dice.`);
  }

  static showDiceOptions(): void {
    console.log("Choose your dice:");
  }

  static showDiceOption(index: number, values: string): void {
    console.log(`${index} - ${values}`);
  }

  static showExitOptions(): void {
    console.log("X - exit");
    console.log("? - help");
  }

  static showRandomNumber(hmac: string): void {
    console.log(`I selected a random value in the range 0..5 (HMAC=${hmac}).`);
  }

  static showNumberOptions(): void {
    console.log("Add your number modulo 6.");
    for (let i = 0; i <= 5; i++) {
      console.log(`${i} - ${i}`);
    }
    console.log("X - exit");
    console.log("? - help");
  }

  static showNumber(number: number, key: string): void {
    console.log(`My number is ${number} (KEY=${key}).`);
  }

  static showFairNumberResult(
    first: number,
    second: number,
    result: number
  ): void {
    console.log(
      `The fair number generation result is ${first} + ${second} = ${result} (mod 6).`
    );
  }

  static showRollResult(isComputer: boolean, result: number): void {
    console.log(`${isComputer ? "My" : "Your"} roll result is ${result}.`);
  }

  static showWinner(isComputer: boolean, first: number, second: number): void {
    console.log(`${isComputer ? "I" : "You"} win (${first} > ${second})!`);
  }

  static showTie(): void {
    console.log("It's a tie!");
  }

  static showExit(): void {
    console.log("Exiting the game.");
  }

  static showError(error: string): void {
    console.error("Error:", error);
  }

  static showUsage(): void {
    console.log("Usage: node dice.js <dice1> <dice2> <dice3> ...");
  }
}
