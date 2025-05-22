export class Dice {
    constructor(values) {
        this.values = values;
    }
    roll() {
        return this.values[Math.floor(Math.random() * this.values.length)];
    }
    getValues() {
        return this.values;
    }
}
