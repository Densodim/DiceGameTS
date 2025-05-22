import { Dice } from "./01_dice.js";
export class DiceParser {
    parseDice(args) {
        const dice = [];
        for (const arg of args) {
            const values = arg.split(",");
            if (values.length !== 6 || !values.every((v) => /^\d+$/.test(v))) {
                throw new Error(`Invalid dice: ${arg}`);
            }
            dice.push(new Dice(values.map((v) => parseInt(v))));
        }
        if (dice.length < 3) {
            throw new Error("At least 3 dice are required.");
        }
        return dice;
    }
}
