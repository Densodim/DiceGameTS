import readline from "node:readline/promises";
export class Player {
    constructor(name) {
        this.name = name;
        this.dice = null;
    }
    async chooseDice(diceOptions) {
        console.log("Available dice:");
        diceOptions.forEach((die, i) => {
            console.log(`${i}: ${die.getValues()}`);
        });
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const choice = await rl.question("Select a die by number: ");
        rl.close();
        this.dice = diceOptions[parseInt(choice)];
    }
    getDice() {
        return this.dice;
    }
    getName() {
        return this.name;
    }
}
