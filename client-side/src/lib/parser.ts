class QuantumCircuit {
  gates: { gate: string; link: number }[][] = [];

  push(gate: string, x: number, y: number, link: number) {
    this.gates[x] ??= [];
    this.gates[x][y] = { gate, link };
  }

  execute(): void {
    console.log(this.gates);
  }
}

export { QuantumCircuit };
