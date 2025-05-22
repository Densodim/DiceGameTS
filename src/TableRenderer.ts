import AsciiTable from "ascii-table";
import { Dice } from "./Dice.js";

interface ITableRenderer {
  renderTable(probabilities: number[][], dice: Dice[]): string;
}

export class TableRenderer implements ITableRenderer {
  private readonly TABLE_TITLE = "Probability Table";

  renderTable(probabilities: number[][], dice: Dice[]): string {
    const table = this.createTable();
    this.addHeaders(table, dice);
    this.addRows(table, probabilities, dice);
    return table.toString();
  }

  private createTable(): AsciiTable {
    return new AsciiTable(this.TABLE_TITLE);
  }

  private addHeaders(table: AsciiTable, dice: Dice[]): void {
    const headers = ["User \\ Opponent", ...this.getDiceValues(dice)];
    table.setHeading(...headers);
  }

  private addRows(
    table: AsciiTable,
    probabilities: number[][],
    dice: Dice[]
  ): void {
    probabilities.forEach((rowProbabilities, index) => {
      const row = [
        this.getDiceValues([dice[index]])[0],
        ...this.formatProbabilities(rowProbabilities),
      ];
      table.addRow(...row);
    });
  }

  private getDiceValues(dice: Dice[]): string[] {
    return dice.map((die) => die.getValues().join(","));
  }

  private formatProbabilities(probabilities: number[]): string[] {
    return probabilities.map((prob) => prob.toFixed(2));
  }
}
