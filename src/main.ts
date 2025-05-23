import { GameInitializer } from "./GameInitializer.js";
import { PlayerOrderManager } from "./PlayerOrderManager.js";
import { DiceSelector } from "./DiceSelector.js";
import { GameRoundManager } from "./GameRoundManager.js";
import { Player } from "./Player.js";

interface IGame {
  start(args: string[]): Promise<void>;
}

class Game implements IGame {
  private initializer: GameInitializer;
  private orderManager: PlayerOrderManager;
  private diceSelector: DiceSelector;
  private roundManager: GameRoundManager;
  private players: Player[];

  constructor() {
    this.initializer = new GameInitializer();
    this.orderManager = new PlayerOrderManager();
    this.diceSelector = new DiceSelector();
    this.roundManager = new GameRoundManager();
    this.players = [new Player("Player 1"), new Player("Computer")];
  }

  async start(args: string[]): Promise<void> {
    try {
      const dice = this.initializer.initializeGame(args);
      const [
        firstPlayer,
        secondPlayer,
      ] = await this.orderManager.determinePlayerOrder(this.players);
      await this.diceSelector.selectDice(firstPlayer, secondPlayer, dice);
      await this.roundManager.playRound(firstPlayer, secondPlayer);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): void {
    console.error("Error:", String(error));
    console.log("Usage: node dice.js <dice1> <dice2> <dice3> ...");
  }
}

const game = new Game();
game.start(process.argv.slice(2));
