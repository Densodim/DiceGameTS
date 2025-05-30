import { Dice } from "./Dice.js";
export class DiceParser {
    parseDice(args) {
        this.validateDiceCount(args);
        return args.map((arg) => this.createDice(arg));
    }
    validateDiceCount(args) {
        if (args.length !== 3) {
            throw new Error("The game requires exactly 3 dice.");
        }
    }
    createDice(arg) {
        const values = this.parseValues(arg);
        this.validateValues(values, arg);
        return new Dice(values.map((v) => Number(v)));
    }
    parseValues(arg) {
        return arg.split(",");
    }
    validateValues(values, arg) {
        if (values.length !== 6 ||
            values.some((v) => {
                const num = Number(v);
                return isNaN(num) || !Number.isInteger(num);
            })) {
            throw new Error(`The wrong bone format: ${arg}. 6 numbers are expected, separated by commas.`);
        }
    }
    formatDiceValues(values) {
        return values.join(",");
    }
}
