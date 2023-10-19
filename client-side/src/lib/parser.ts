class QuantumCircuit {
  gates: Array<Array<{ gate: string; link: number; meta: Vector2D }>> = [];

  push(gate: string, x: number, y: number, link: number) {
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

    if (!fromItem || !toItem) return;

    fromItem.link = from.x;
    toItem.link = to.x;
  }

  async execute(): Promise<void> {
    const newArray = [];

    for (let x = 0; x < this.gates.length; x++) {
      // Create a new sub-array of length x+1
      newArray[x] = new Array(x + 1);

      for (let y = 0; y < this.gates[x].length; y++) {
        // Copy the values from the original array without the 'meta' property
        newArray[x][y] = {
          gate: this.gates[x][y].gate,
          link: this.gates[x][y].link,
        };
      }
    }

    const response = await fetch("https://dummyjson.com/products/add", {
      method: "POST",
      body: JSON.stringify(newArray),
    });
    const data = await response.json();
    console.log("Data", data);
  }
}

export { QuantumCircuit };
