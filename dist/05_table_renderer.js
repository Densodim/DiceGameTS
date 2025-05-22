import AsciiTable from "ascii-table";
export class TableRenderer {
    renderTable(probabilities, dice) {
        const table = new AsciiTable("Probability Table");
        // Add headers
        const headers = [
            "User \\ Opponent",
            ...dice.map((die) => die.getValues().join(",")),
        ];
        table.setHeading(...headers);
        // Add rows
        for (let i = 0; i < probabilities.length; i++) {
            const row = [dice[i].getValues().join(",")];
            for (let j = 0; j < probabilities[i].length; j++) {
                row.push(probabilities[i][j].toFixed(2));
            }
            table.addRow(...row);
        }
        return table.toString();
    }
}
