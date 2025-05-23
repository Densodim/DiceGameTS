import { DiceParser } from "./DiceParser.js";
import { RandomGenerator } from "./RandomGenerator.js";
import { ProbabilityCalculator } from "./ProbabilityCalculator.js";
import { TableRenderer } from "./TableRenderer.js";
import { FairnessVerifier } from "./FairnessVerifier.js";
import { Player } from "./Player.js";
import readline from "node:readline/promises";
class Game {
    parser;
    randomGen;
    probCalc;
    tableRenderer;
    verifier;
    players;
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
            const dice = await this.initializeGame(args);
            const [firstPlayer, secondPlayer] = await this.determinePlayerOrder();
            await this.playRound(firstPlayer, secondPlayer, dice);
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async initializeGame(args) {
        const dice = this.parser.parseDice(args);
        console.log("Game started with dice:", dice.map((d) => d.getValues()));
        const probabilities = this.probCalc.calculateProbabilities(dice);
        console.log(this.tableRenderer.renderTable(probabilities, dice));
        return dice;
    }
    async determinePlayerOrder() {
        console.log("Let's determine who makes the first move.");
        const key = this.randomGen.generateSecureKey();
        const [randomNumber, hmacValue] = this.randomGen.generateRandomNumber(1, key);
        console.log(`I selected a random value in the range 0..1 (HMAC=${hmacValue}).`);
        console.log("Try to guess my selection.");
        console.log("0 - 0");
        console.log("1 - 1");
        console.log("X - exit");
        console.log("? - help");
        const userInput = await this.getUserInput("Your selection: ");
        if (userInput === "X") {
            console.log("Exiting the game.");
            process.exit(0);
        }
        console.log(`My selection: ${randomNumber} (KEY=${key.toString("hex")}).`);
        const [firstPlayer, secondPlayer] = userInput === "0"
            ? [this.players[1], this.players[0]]
            : [this.players[0], this.players[1]];
        console.log(`${firstPlayer.getName() === "Computer" ? "I" : "You"} make the first move.`);
        return [firstPlayer, secondPlayer];
    }
    async playRound(firstPlayer, secondPlayer, dice) {
        await this.chooseDice(firstPlayer, secondPlayer, dice);
        await this.playDiceRoll(firstPlayer, secondPlayer);
    }
    async chooseDice(firstPlayer, secondPlayer, dice) {
        if (firstPlayer.getName() === "Computer") {
            const computerChoice = Math.floor(Math.random() * dice.length);
            firstPlayer.getDice = () => dice[computerChoice];
            console.log(`I make the first move and choose the [${dice[computerChoice].getValues()}] dice.`);
            console.log("Choose your dice:");
            dice.forEach((die, i) => {
                if (die !== firstPlayer.getDice()) {
                    console.log(`${i} - ${die.getValues()}`);
                }
            });
            console.log("X - exit");
            console.log("? - help");
            const userChoice = await this.getUserInput("Your selection: ");
            if (userChoice === "X") {
                console.log("Exiting the game.");
                process.exit(0);
            }
            secondPlayer.getDice = () => dice[Number(userChoice)];
            console.log(`You choose the [${secondPlayer.getDice()?.getValues()}] dice.`);
        }
        else {
            console.log("Choose your dice:");
            dice.forEach((die, i) => {
                console.log(`${i} - ${die.getValues()}`);
            });
            console.log("X - exit");
            console.log("? - help");
            const userChoice = await this.getUserInput("Your selection: ");
            if (userChoice === "X") {
                console.log("Exiting the game.");
                process.exit(0);
            }
            firstPlayer.getDice = () => dice[Number(userChoice)];
            console.log(`You choose the [${firstPlayer.getDice()?.getValues()}] dice.`);
            const availableDice = dice.filter((die) => die !== firstPlayer.getDice());
            const computerChoice = Math.floor(Math.random() * availableDice.length);
            secondPlayer.getDice = () => availableDice[computerChoice];
            console.log(`I choose the [${secondPlayer.getDice()?.getValues()}] dice.`);
        }
    }
    async playDiceRoll(firstPlayer, secondPlayer) {
        if (firstPlayer.getName() === "Computer") {
            const [computerNumber, computerHmac, key] = this.generateComputerNumber();
            const playerChoice = await this.getPlayerChoice();
            if (this.verifier.verifyHmac(computerNumber, key, computerHmac)) {
                console.log(`My number is ${computerNumber} (KEY=${key.toString("hex")}).`);
                const result = (computerNumber + playerChoice) % 6;
                console.log(`The fair number generation result is ${computerNumber} + ${playerChoice} = ${result} (mod 6).`);
                const computerRoll = firstPlayer.getDice()?.roll();
                console.log(`My roll result is ${computerRoll}.`);
                // Generate new random number for player's roll
                const [playerNumber, playerHmac, playerKey,] = this.generateComputerNumber();
                const playerSecondChoice = await this.getPlayerChoice();
                if (this.verifier.verifyHmac(playerNumber, playerKey, playerHmac)) {
                    console.log(`My number is ${playerNumber} (KEY=${playerKey.toString("hex")}).`);
                    const playerResult = (playerNumber + playerSecondChoice) % 6;
                    console.log(`The fair number generation result is ${playerNumber} + ${playerSecondChoice} = ${playerResult} (mod 6).`);
                    const playerRoll = secondPlayer.getDice()?.roll();
                    console.log(`Your roll result is ${playerRoll}.`);
                    if (computerRoll !== undefined && playerRoll !== undefined) {
                        if (computerRoll > playerRoll) {
                            console.log(`I win (${computerRoll} > ${playerRoll})!`);
                        }
                        else if (computerRoll < playerRoll) {
                            console.log(`You win (${playerRoll} > ${computerRoll})!`);
                        }
                        else {
                            console.log("It's a tie!");
                        }
                        process.exit(0);
                    }
                }
            }
        }
        else {
            const [playerNumber, playerHmac, playerKey,] = this.generateComputerNumber();
            const playerChoice = await this.getPlayerChoice();
            if (this.verifier.verifyHmac(playerNumber, playerKey, playerHmac)) {
                console.log(`My number is ${playerNumber} (KEY=${playerKey.toString("hex")}).`);
                const result = (playerNumber + playerChoice) % 6;
                console.log(`The fair number generation result is ${playerNumber} + ${playerChoice} = ${result} (mod 6).`);
                const playerRoll = firstPlayer.getDice()?.roll();
                console.log(`Your roll result is ${playerRoll}.`);
                // Generate new random number for computer's roll
                const [computerNumber, computerHmac, computerKey,] = this.generateComputerNumber();
                const computerChoice = await this.getPlayerChoice();
                if (this.verifier.verifyHmac(computerNumber, computerKey, computerHmac)) {
                    console.log(`My number is ${computerNumber} (KEY=${computerKey.toString("hex")}).`);
                    const computerResult = (computerNumber + computerChoice) % 6;
                    console.log(`The fair number generation result is ${computerNumber} + ${computerChoice} = ${computerResult} (mod 6).`);
                    const computerRoll = secondPlayer.getDice()?.roll();
                    console.log(`My roll result is ${computerRoll}.`);
                    if (playerRoll !== undefined && computerRoll !== undefined) {
                        if (playerRoll > computerRoll) {
                            console.log(`You win (${playerRoll} > ${computerRoll})!`);
                        }
                        else if (playerRoll < computerRoll) {
                            console.log(`I win (${computerRoll} > ${playerRoll})!`);
                        }
                        else {
                            console.log("It's a tie!");
                        }
                        process.exit(0);
                    }
                }
            }
        }
    }
    generateComputerNumber() {
        const newKey = this.randomGen.generateSecureKey();
        const [number, hmac] = this.randomGen.generateRandomNumber(5, newKey);
        console.log(`I selected a random value in the range 0..5 (HMAC=${hmac}).`);
        console.log("Add your number modulo 6.");
        console.log("0 - 0");
        console.log("1 - 1");
        console.log("2 - 2");
        console.log("3 - 3");
        console.log("4 - 4");
        console.log("5 - 5");
        console.log("X - exit");
        console.log("? - help");
        return [number, hmac, newKey];
    }
    async getPlayerChoice() {
        const choice = await this.getUserInput("Your selection: ");
        if (choice === "X") {
            console.log("Exiting the game.");
            process.exit(0);
        }
        return Number(choice);
    }
    async getUserInput(prompt) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const input = await rl.question(prompt);
        rl.close();
        return input;
    }
    handleError(error) {
        console.error("Error:", error instanceof Error ? error.message : String(error));
        console.log("Usage: node dice.js <dice1> <dice2> <dice3> ...");
    }
}
const game = new Game();
game.start(process.argv.slice(2));
