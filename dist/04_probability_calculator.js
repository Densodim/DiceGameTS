export class ProbabilityCalculator {
    calculateProbabilities(dice) {
        const n = dice.length;
        const probabilities = Array(n)
            .fill(0)
            .map(() => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    let winCount = 0;
                    for (const a of dice[i].getValues()) {
                        for (const b of dice[j].getValues()) {
                            if (a > b)
                                winCount++;
                        }
                    }
                    const totalOutcomes = dice[i].getValues().length * dice[j].getValues().length;
                    probabilities[i][j] = winCount / totalOutcomes;
                }
            }
        }
        return probabilities;
    }
}
