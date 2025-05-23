import { Player } from "./Player.js";
import { RandomGenerator } from "./RandomGenerator.js";
import { FairnessVerifier } from "./FairnessVerifier.js";
import { UserInputHandler } from "./UserInputHandler.js";
import { GameMessages } from "./GameMessages.js";

export class GameRoundManager {
  private randomGen: RandomGenerator;
  private verifier: FairnessVerifier;
  private userInputHandler: UserInputHandler;

  constructor() {
    this.randomGen = new RandomGenerator();
    this.verifier = new FairnessVerifier();
    this.userInputHandler = new UserInputHandler();
  }

  public async playRound(
    firstPlayer: Player,
    secondPlayer: Player
  ): Promise<void> {
    if (firstPlayer.getName() === "Computer") {
      await this.playComputerFirst(firstPlayer, secondPlayer);
    } else {
      await this.playPlayerFirst(firstPlayer, secondPlayer);
    }
  }

  private async playComputerFirst(
    firstPlayer: Player,
    secondPlayer: Player
  ): Promise<void> {
    const [computerNumber, computerHmac, key] = this.generateRandomNumber();
    const playerChoice = await this.getPlayerChoice();

    if (this.verifier.verifyHmac(computerNumber, key, computerHmac)) {
      await this.processRoll(
        firstPlayer,
        secondPlayer,
        computerNumber,
        playerChoice,
        key
      );
    }
  }

  private async playPlayerFirst(
    firstPlayer: Player,
    secondPlayer: Player
  ): Promise<void> {
    const [playerNumber, playerHmac, playerKey] = this.generateRandomNumber();
    const playerChoice = await this.getPlayerChoice();

    if (this.verifier.verifyHmac(playerNumber, playerKey, playerHmac)) {
      await this.processRoll(
        firstPlayer,
        secondPlayer,
        playerNumber,
        playerChoice,
        playerKey
      );
    }
  }

  private async processRoll(
    firstPlayer: Player,
    secondPlayer: Player,
    firstNumber: number,
    firstChoice: number,
    firstKey: Buffer
  ): Promise<void> {
    const firstRoll = await this.processFirstRoll(
      firstPlayer,
      firstNumber,
      firstChoice,
      firstKey
    );
    await this.processSecondRoll(secondPlayer, firstPlayer, firstRoll);
  }

  private async processFirstRoll(
    player: Player,
    number: number,
    choice: number,
    key: Buffer
  ): Promise<number> {
    this.showNumberAndResult(number, choice, key);
    const roll = player.getDice()?.roll();
    this.showRollResult(player.getName() === "Computer", roll || 0);
    return roll || 0;
  }

  private async processSecondRoll(
    secondPlayer: Player,
    firstPlayer: Player,
    firstRoll: number
  ): Promise<void> {
    const [secondNumber, secondHmac, secondKey] = this.generateRandomNumber();
    const secondChoice = await this.getPlayerChoice();

    if (this.verifier.verifyHmac(secondNumber, secondKey, secondHmac)) {
      const secondRoll = await this.processFirstRoll(
        secondPlayer,
        secondNumber,
        secondChoice,
        secondKey
      );
      if (firstRoll !== undefined && secondRoll !== undefined) {
        this.determineWinner(
          firstRoll,
          secondRoll,
          firstPlayer.getName(),
          secondPlayer.getName()
        );
      }
    }
  }

  private showNumberAndResult(
    number: number,
    choice: number,
    key: Buffer
  ): void {
    GameMessages.showNumber(number, key.toString("hex"));
    const result = (number + choice) % 6;
    GameMessages.showFairNumberResult(number, choice, result);
  }

  private showRollResult(isComputer: boolean, result: number): void {
    GameMessages.showRollResult(isComputer, result);
  }

  private generateRandomNumber(): [number, string, Buffer] {
    const newKey = this.randomGen.generateSecureKey();
    const [number, hmac] = this.randomGen.generateRandomNumber(5, newKey);
    GameMessages.showRandomNumber(hmac);
    GameMessages.showNumberOptions();
    return [number, hmac, newKey];
  }

  private async getPlayerChoice(): Promise<number> {
    const choice = await this.userInputHandler.getUserInput("Your selection: ");
    if (choice === "X") {
      GameMessages.showExit();
      process.exit(0);
    }
    return Number(choice);
  }

  private determineWinner(
    firstRoll: number,
    secondRoll: number,
    firstName: string,
    secondName: string
  ): void {
    if (firstRoll > secondRoll) {
      GameMessages.showWinner(firstName === "Computer", firstRoll, secondRoll);
    } else if (firstRoll < secondRoll) {
      GameMessages.showWinner(secondName === "Computer", secondRoll, firstRoll);
    } else {
      GameMessages.showTie();
    }
    process.exit(0);
  }
}
