import { DiceParser } from "./DiceParser.js";
import { RandomGenerator } from "./RandomGenerator.js";
import { ProbabilityCalculator } from "./ProbabilityCalculator.js";
import { TableRenderer } from "./TableRenderer.js";
import { FairnessVerifier } from "./FairnessVerifier.js";
import { Player } from "./Player.js";
import { Dice } from "./Dice.js";
import readline from "node:readline/promises";

interface IGame {
  start(args: string[]): Promise<void>;
}

class Game implements IGame {
  private parser: DiceParser;
  private randomGen: RandomGenerator;
  private probCalc: ProbabilityCalculator;
  private tableRenderer: TableRenderer;
  private verifier: FairnessVerifier;
  private players: Player[];

  constructor() {
    this.parser = new DiceParser();
    this.randomGen = new RandomGenerator();
    this.probCalc = new ProbabilityCalculator();
    this.tableRenderer = new TableRenderer();
    this.verifier = new FairnessVerifier();
    this.players = [new Player("Player 1"), new Player("Computer")];
  }

  async start(args: string[]): Promise<void> {
    try {
      const dice = await this.initializeGame(args);
      const [firstPlayer, secondPlayer] = await this.determinePlayerOrder();
      await this.playRound(firstPlayer, secondPlayer, dice);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async initializeGame(args: string[]): Promise<Dice[]> {
    const dice = this.parser.parseDice(args);
    console.log(
      "Game started with dice:",
      dice.map((d) => d.getValues())
    );

    const probabilities = this.probCalc.calculateProbabilities(dice);
    console.log(this.tableRenderer.renderTable(probabilities, dice));

    return dice;
  }

  private async determinePlayerOrder(): Promise<[Player, Player]> {
    const key = this.randomGen.generateSecureKey();
    const [randomNumber, hmacValue] = this.randomGen.generateRandomNumber(
      1,
      key
    );

    console.log(
      `I selected a random value in the range 0..1 (HMAC=${hmacValue}).`
    );
    console.log("Try to guess my selection.");
    console.log("0 - 0");
    console.log("1 - 1");
    console.log("X - exit");
    console.log("? - help");

    const userInput = await this.getUserInput("Your selection: ");
    if (userInput === "X") {
      console.log("Exiting the game.");
      process.exit(0);
    }

    const [firstPlayer, secondPlayer] =
      userInput === "0"
        ? [this.players[0], this.players[1]]
        : [this.players[1], this.players[0]];

    console.log(`${firstPlayer.getName()} goes first!`);
    return [firstPlayer, secondPlayer];
  }

  private async playRound(
    firstPlayer: Player,
    secondPlayer: Player,
    dice: Dice[]
  ): Promise<void> {
    await this.chooseDice(firstPlayer, secondPlayer, dice);
    await this.playDiceRoll(firstPlayer, secondPlayer);
  }

  private async chooseDice(
    firstPlayer: Player,
    secondPlayer: Player,
    dice: Dice[]
  ): Promise<void> {
    await firstPlayer.chooseDice(dice);
    console.log(
      `${firstPlayer.getName()} chose: ${firstPlayer.getDice()?.getValues()}`
    );

    const availableDice = dice.filter((die) => die !== firstPlayer.getDice());
    secondPlayer.getDice = () =>
      availableDice[Math.floor(Math.random() * availableDice.length)];
    console.log(
      `${secondPlayer.getName()} chose: ${secondPlayer.getDice()?.getValues()}`
    );
  }

  private async playDiceRoll(
    firstPlayer: Player,
    secondPlayer: Player
  ): Promise<void> {
    const [computerNumber, computerHmac, key] = this.generateComputerNumber();
    const playerChoice = await this.getPlayerChoice();

    if (this.verifier.verifyHmac(computerNumber, key, computerHmac)) {
      this.determineWinner(
        firstPlayer,
        secondPlayer,
        computerNumber,
        playerChoice
      );
    } else {
      console.log("HMAC verification failed. Possible tampering detected.");
    }
  }

  private generateComputerNumber(): [number, string, Buffer] {
    const newKey = this.randomGen.generateSecureKey();
    const [number, hmac] = this.randomGen.generateRandomNumber(5, newKey);
    console.log(`Computer generated random number: ${number}, HMAC: ${hmac}`);
    return [number, hmac, newKey];
  }

  private async getPlayerChoice(): Promise<number> {
    const choice = await this.getUserInput("Choose a number between 0 and 5: ");
    return Number(choice);
  }

  private determineWinner(
    firstPlayer: Player,
    secondPlayer: Player,
    computerNumber: number,
    playerChoice: number
  ): void {
    const result = (computerNumber + playerChoice) % 6;
    console.log(`Result of (computer number + player choice) % 6 = ${result}`);

    const playerRoll = firstPlayer.getDice()?.roll();
    const computerRoll = secondPlayer.getDice()?.roll();

    console.log(`${firstPlayer.getName()} rolled: ${playerRoll}`);
    console.log(`${secondPlayer.getName()} rolled: ${computerRoll}`);

    if (playerRoll && computerRoll) {
      if (playerRoll > computerRoll) {
        console.log(`${firstPlayer.getName()} wins!`);
      } else if (playerRoll < computerRoll) {
        console.log(`${secondPlayer.getName()} wins!`);
      } else {
        console.log("It's a tie!");
      }
    }
  }

  private async getUserInput(prompt: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const input = await rl.question(prompt);
    rl.close();
    return input;
  }

  private handleError(error: unknown): void {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error)
    );
    console.log("Usage: node dice.js <dice1> <dice2> <dice3> ...");
  }
}

const game = new Game();
game.start(process.argv.slice(2));
