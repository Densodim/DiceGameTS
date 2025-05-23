import { Player } from "./Player.js";
import { Dice } from "./Dice.js";
import { UserInputHandler } from "./UserInputHandler.js";
import { GameMessages } from "./GameMessages.js";
import { DiceFormatter } from "./DiceFormatter.js";

export class DiceSelector {
  private userInputHandler: UserInputHandler;
  private formatter: DiceFormatter;

  constructor() {
    this.userInputHandler = new UserInputHandler();
    this.formatter = new DiceFormatter();
  }

  public async selectDice(
    firstPlayer: Player,
    secondPlayer: Player,
    dice: Dice[]
  ): Promise<void> {
    if (firstPlayer.getName() === "Computer") {
      await this.handleComputerFirst(firstPlayer, secondPlayer, dice);
    } else {
      await this.handlePlayerFirst(firstPlayer, secondPlayer, dice);
    }
  }

  private async handleComputerFirst(
    firstPlayer: Player,
    secondPlayer: Player,
    dice: Dice[]
  ): Promise<void> {
    await this.handleComputerSelection(firstPlayer, dice);
    await this.handlePlayerSelection(secondPlayer, dice, firstPlayer.getDice());
  }

  private async handlePlayerFirst(
    firstPlayer: Player,
    secondPlayer: Player,
    dice: Dice[]
  ): Promise<void> {
    await this.handlePlayerSelection(firstPlayer, dice);
    await this.handleComputerSelection(
      secondPlayer,
      this.getAvailableDice(dice, firstPlayer.getDice())
    );
  }

  private async handleComputerSelection(
    player: Player,
    dice: Dice[]
  ): Promise<void> {
    const choice = this.makeComputerChoice(dice.length);
    this.assignDiceToPlayer(player, dice, choice);
    this.showDiceChoice(player, true);
  }

  private async handlePlayerSelection(
    player: Player,
    dice: Dice[],
    excludeDice?: Dice | null
  ): Promise<void> {
    await this.displayDiceOptions(dice, excludeDice || undefined);
    const choice = await this.getUserChoice();
    this.assignDiceToPlayer(player, dice, Number(choice));
    this.showDiceChoice(player, false);
  }

  private makeComputerChoice(max: number): number {
    return Math.floor(Math.random() * max);
  }

  private assignDiceToPlayer(
    player: Player,
    dice: Dice[],
    index: number
  ): void {
    player.getDice = () => dice[index];
  }

  private showDiceChoice(player: Player, isComputer: boolean): void {
    GameMessages.showDiceChoice(
      isComputer,
      this.formatter.formatDiceValues(player.getDice()?.getValues() || [])
    );
  }

  private getAvailableDice(dice: Dice[], excludeDice: Dice | null): Dice[] {
    return dice.filter((die) => die !== excludeDice);
  }

  private async displayDiceOptions(
    dice: Dice[],
    excludeDice?: Dice
  ): Promise<void> {
    GameMessages.showDiceOptions();
    dice.forEach((die, i) => {
      if (!excludeDice || die !== excludeDice) {
        GameMessages.showDiceOption(
          i,
          this.formatter.formatDiceValues(die.getValues())
        );
      }
    });
    GameMessages.showExitOptions();
  }

  private async getUserChoice(): Promise<string> {
    const choice = await this.userInputHandler.getUserInput("Your selection: ");
    if (choice === "X") {
      GameMessages.showExit();
      process.exit(0);
    }
    return choice;
  }
}
