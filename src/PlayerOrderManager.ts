import { RandomGenerator } from "./RandomGenerator.js";
import { Player } from "./Player.js";
import { UserInputHandler } from "./UserInputHandler";
import { GameMessages } from "./GameMessages.js";

export class PlayerOrderManager {
  private randomGen: RandomGenerator;
  private userInputHandler: UserInputHandler;

  constructor() {
    this.randomGen = new RandomGenerator();
    this.userInputHandler = new UserInputHandler();
  }

  public async determinePlayerOrder(
    players: Player[]
  ): Promise<[Player, Player]> {
    GameMessages.determineFirstMove();
    const [randomNumber, hmacValue, key] = this.generateRandomValue();
    await this.displayGuessOptions(hmacValue);
    const userInput = await this.getUserGuess();
    this.displaySelection(randomNumber, key);
    return this.determineOrder(players, userInput);
  }

  private generateRandomValue(): [number, string, Buffer] {
    const key = this.randomGen.generateSecureKey();
    const [randomNumber, hmacValue] = this.randomGen.generateRandomNumber(
      1,
      key
    );
    return [randomNumber, hmacValue, key];
  }

  private async displayGuessOptions(hmacValue: string): Promise<void> {
    GameMessages.showRandomValue(hmacValue);
    GameMessages.showGuessOptions();
  }

  private async getUserGuess(): Promise<string> {
    const userInput = await this.userInputHandler.getUserInput(
      "Your selection: "
    );
    if (userInput === "X") {
      GameMessages.showExit();
      process.exit(0);
    }
    return userInput;
  }

  private displaySelection(randomNumber: number, key: Buffer): void {
    GameMessages.showSelection(randomNumber, key.toString("hex"));
  }

  private determineOrder(
    players: Player[],
    userInput: string
  ): [Player, Player] {
    const [firstPlayer, secondPlayer] =
      userInput === "0" ? [players[1], players[0]] : [players[0], players[1]];
    GameMessages.showFirstMove(firstPlayer.getName() === "Computer");
    return [firstPlayer, secondPlayer];
  }
}
