import { DiceParser } from "./DiceParser.js";
import { ProbabilityCalculator } from "./ProbabilityCalculator.js";
import { TableRenderer } from "./TableRenderer.js";
import { Dice } from "./Dice.js";
import { GameMessages } from "./GameMessages.js";

export class GameInitializer {
  private parser: DiceParser;
  private probCalc: ProbabilityCalculator;
  private tableRenderer: TableRenderer;

  constructor() {
    this.parser = new DiceParser();
    this.probCalc = new ProbabilityCalculator();
    this.tableRenderer = new TableRenderer();
  }

  public initializeGame(args: string[]): Dice[] {
    const dice = this.parseAndValidateDice(args);
    this.displayGameStart(dice);
    this.displayProbabilities(dice);
    return dice;
  }

  private parseAndValidateDice(args: string[]): Dice[] {
    return this.parser.parseDice(args);
  }

  private displayGameStart(dice: Dice[]): void {
    const diceValues = dice.map((d) => d.getValues().join(","));
    GameMessages.gameStart(diceValues);
  }

  private displayProbabilities(dice: Dice[]): void {
    const probabilities = this.probCalc.calculateProbabilities(dice);
    const table = this.tableRenderer.renderTable(probabilities, dice);
    GameMessages.showProbabilities(table);
  }
}
