import { DiceParser } from "./02_dice_parser.js";
import { RandomGenerator } from "./03_random_generator.js";
import { ProbabilityCalculator } from "./04_probability_calculator.js";
import { TableRenderer } from "./05_table_renderer.js";
import { FairnessVerifier } from "./06_fairness_verifier.js";
import { Player } from "./07_player.js";
import readline from "node:readline/promises";
class Game {
    constructor() {
        this.parser = new DiceParser();
        this.randomGen = new RandomGenerator();
        this.probCalc = new ProbabilityCalculator();
        this.tableRenderer = new TableRenderer();
        this.verifier = new FairnessVerifier();
        this.players = [new Player("Player 1"), new Player("Computer")];
    }
    async start(args) {
        try {
            const dice = this.parser.parseDice(args);
            console.log("Game started with dice:", dice.map((d) => d.getValues()));
            const probabilities = this.probCalc.calculateProbabilities(dice);
            console.log(this.tableRenderer.renderTable(probabilities, dice));
            // Determine who goes first
            const key = this.randomGen.generateSecureKey();
            const [randomNumber, hmacValue] = this.randomGen.generateRandomNumber(1, key);
            console.log(`I selected a random value in the range 0..1 (HMAC=${hmacValue}).`);
            console.log("Try to guess my selection.");
            console.log("0 - 0");
            console.log("1 - 1");
            console.log("X - exit");
            console.log("? - help");
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            const userInput = await rl.question("Your selection: ");
            rl.close();
            let firstPlayer, secondPlayer;
            if (userInput === "0") {
                console.log("You go first!");
                firstPlayer = this.players[0];
                secondPlayer = this.players[1];
            }
            else if (userInput === "1") {
                console.log("Computer goes first!");
                firstPlayer = this.players[1];
                secondPlayer = this.players[0];
            }
            else {
                console.log("Exiting the game.");
                return;
            }
            // First player chooses their dice
            await firstPlayer.chooseDice(dice);
            console.log(`${firstPlayer.getName()} chose: ${firstPlayer.getDice()?.getValues()}`);
            // Computer randomly selects its dice
            const availableDice = dice.filter((die) => die !== firstPlayer.getDice());
            secondPlayer.getDice = () => availableDice[Math.floor(Math.random() * availableDice.length)];
            console.log(`${secondPlayer.getName()} chose: ${secondPlayer
                .getDice()
                ?.getValues()}`);
            // Generate random number and HMAC for fairness
            const newKey = this.randomGen.generateSecureKey();
            const [computerRandomNumber, computerHmacValue,] = this.randomGen.generateRandomNumber(5, newKey);
            console.log(`Computer generated random number: ${computerRandomNumber}, HMAC: ${computerHmacValue}`);
            const rl2 = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            const playerChoice = await rl2.question("Choose a number between 0 and 5: ");
            rl2.close();
            // Verify HMAC
            if (this.verifier.verifyHmac(computerRandomNumber, newKey, computerHmacValue)) {
                console.log("HMAC verified successfully.");
                // Calculate the result using modular addition
                const result = (computerRandomNumber + parseInt(playerChoice)) % 6;
                console.log(`Result of (computer number + player choice) % 6 = ${result}`);
                // Roll the dice
                const playerRoll = firstPlayer.getDice()?.roll();
                const computerRoll = secondPlayer.getDice()?.roll();
                console.log(`${firstPlayer.getName()} rolled: ${playerRoll}`);
                console.log(`${secondPlayer.getName()} rolled: ${computerRoll}`);
                // Determine the winner
                if (playerRoll && computerRoll) {
                    if (playerRoll > computerRoll) {
                        console.log(`${firstPlayer.getName()} wins!`);
                    }
                    else if (playerRoll < computerRoll) {
                        console.log(`${secondPlayer.getName()} wins!`);
                    }
                    else {
                        console.log("It's a tie!");
                    }
                }
            }
            else {
                console.log("HMAC verification failed. Possible tampering detected.");
            }
        }
        catch (error) {
            console.error("Error:", error instanceof Error ? error.message : String(error));
            console.log("Usage: node dice.js <dice1> <dice2> <dice3> ...");
        }
    }
}
// Example usage
const game = new Game();
game.start(process.argv.slice(2));
