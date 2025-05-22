import { Dice } from "./Dice.js";

interface IProbabilityCalculator {
  calculateProbabilities(dice: Dice[]): number[][];
}

export class ProbabilityCalculator implements IProbabilityCalculator {
  calculateProbabilities(dice: Dice[]): number[][] {
    const probabilities = this.createEmptyMatrix(dice.length);

    dice.forEach((dice1, i) => {
      dice.forEach((dice2, j) => {
        if (i !== j) {
          probabilities[i][j] = this.calculateWinProbability(dice1, dice2);
        }
      });
    });

    return probabilities;
  }

  private createEmptyMatrix(size: number): number[][] {
    return Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));
  }

  private calculateWinProbability(dice1: Dice, dice2: Dice): number {
    const winCount = this.countWinningOutcomes(dice1, dice2);
    const totalOutcomes = dice1.getValues().length * dice2.getValues().length;
    return winCount / totalOutcomes;
  }

  private countWinningOutcomes(dice1: Dice, dice2: Dice): number {
    return dice1.getValues().reduce((count, value1) => {
      return (
        count + dice2.getValues().filter((value2) => value1 > value2).length
      );
    }, 0);
  }
}
