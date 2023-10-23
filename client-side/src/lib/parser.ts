class QuantumCircuit {
  gates: Array<Array<{ gate: string; link: number; meta: Vector2D }>> = [];
  group_count: Array<number> = [];
  numRows: number;
  outputString: String = "";

  constructor(numRows: number) {
    this.numRows = numRows;
  }

  updateNumRows(numRows: number) {
    this.numRows = numRows;
  }

  push(gate: string, x: number, y: number, link: number) {
    if (this.group_count.length <= y) {
      this.group_count.push(0);
    }

    this.gates[x] ??= [];

    // Fill in holes for the inner array
    while (this.gates[x].length <= y) {
      this.gates[x].push({
        gate: "I",
        link: NaN,
        meta: { x: -1, y: -1 },
      });
    }

    this.gates[x][y] = { gate, link, meta: { x, y } };
  }

  find(targetGate: string, position: Vector2D) {
    return this.gates[position.x].find(({ gate, meta: { y } }) => {
      return targetGate === gate && position.y === y;
    });
  }

  link(from: GridItem, to: GridItem) {
    const fromItem = this.find(from.gate, { x: from.x, y: from.y });
    const toItem = this.find(to.gate, { x: to.x, y: to.y });

    if (!fromItem || !toItem) {
      console.log("weird conditional executed 1");
      return;
    }
    if (from.x !== to.x) {
      console.log("weird conditional executed 2");
      return;
    }

    fromItem.link = this.group_count[from.x];
    toItem.link = this.group_count[from.x];

    // TODO: for some reason the next link numbers I get when
    // running the code are not 0,1,2,3 but rather 1,3,5
    // but this is not a big problem as long as there are just
    // different link groups
    this.group_count[from.x] += 1;
  }

  removeRow(rowIndex: number) {
    for (let x = 0; x < this.gates.length; x++) {
      console.log(this.gates[x]);

      if (!this.gates[x]) {
        continue;
      }

      if (typeof this.gates[x][rowIndex] === 'undefined') continue;

      this.gates[x].splice(rowIndex, 1);
      
      if (this.gates[x].length === 0) {
        this.gates.splice(x, 1);
      }
    }
  }

  async execute(): Promise<void> {
    const newArray = [];

    console.log(this.gates);
    for (let x = 0; x < this.gates.length; x++) {
      if (!this.gates[x]) {
        continue;
      }

      // Create a new sub-array of length x+1
      // newArray[x] = new Array(x + 1); // TODO: WHYYYYYYYYY
      newArray[x] = new Array(this.gates[x].length);

      for (let y = 0; y < this.gates[x].length; y++) {
        // Copy the values from the original array without the 'meta' property

        if (!this.gates[x][y]) {
          console.log("weird conditional executed 3");
          continue;
        }

        newArray[x][y] = {
          gate: this.gates[x][y].gate,
          link: this.gates[x][y].link,
        };
      }
    }

    // update server url if necessary
    const response = await fetch("http://127.0.0.1:5000/evaluate", {
      method: "POST",
      body: JSON.stringify([...[this.numRows], ...newArray]), // concat two array notation
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });
    const data = await response.json();
    console.log("Message:");
    console.log(data["message"]);
    this.outputString = data["message"];
  }
}

export { QuantumCircuit };