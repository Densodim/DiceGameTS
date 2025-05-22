declare module "ascii-table" {
  class AsciiTable {
    constructor(title?: string);
    setHeading(...args: string[]): void;
    addRow(...args: any[]): void;
    toString(): string;
  }
  export default AsciiTable;
}
