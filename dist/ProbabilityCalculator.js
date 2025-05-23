export class ProbabilityCalculator {
    calculateProbabilities(dice) {
        const probabilities = this.createEmptyMatrix(dice.length);
        dice.forEach((dice1, i) => {
            dice.forEach((dice2, j) => {
                probabilities[i][j] = this.calculateWinProbability(dice1, dice2);
            });
        });
        return probabilities;
    }
    createEmptyMatrix(size) {
        return Array(size)
            .fill(0)
            .map(() => Array(size).fill(0));
    }
    calculateWinProbability(dice1, dice2) {
        const winCount = this.countWinningOutcomes(dice1, dice2);
        const totalOutcomes = dice1.getValues().length * dice2.getValues().length;
        return winCount / totalOutcomes;
    }
    countWinningOutcomes(dice1, dice2) {
        return dice1.getValues().reduce((count, value1) => {
            return (count + dice2.getValues().filter((value2) => value1 > value2).length);
        }, 0);
    }
}
