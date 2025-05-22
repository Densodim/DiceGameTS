import AsciiTable from "ascii-table";
export class TableRenderer {
    TABLE_TITLE = "Probability Table";
    renderTable(probabilities, dice) {
        const table = this.createTable();
        this.addHeaders(table, dice);
        this.addRows(table, probabilities, dice);
        return table.toString();
    }
    createTable() {
        return new AsciiTable(this.TABLE_TITLE);
    }
    addHeaders(table, dice) {
        const headers = ["User \\ Opponent", ...this.getDiceValues(dice)];
        table.setHeading(...headers);
    }
    addRows(table, probabilities, dice) {
        probabilities.forEach((rowProbabilities, index) => {
            const row = [
                this.getDiceValues([dice[index]])[0],
                ...this.formatProbabilities(rowProbabilities),
            ];
            table.addRow(...row);
        });
    }
    getDiceValues(dice) {
        return dice.map((die) => die.getValues().join(","));
    }
    formatProbabilities(probabilities) {
        return probabilities.map((prob) => prob.toFixed(2));
    }
}
