import readline from "readline/promises";

export class UserInputHandler {
  public async getUserInput(prompt: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const input = await rl.question(prompt);
    rl.close();
    return input;
  }
}
