class QuantumCircuit {
  gates: { gate: string; qubits: number[] }[] = [];

  addGate(gate: string, qubits: number[]) {
    this.gates.push({ gate, qubits });
  }

  checkConstraints(): string | null {
    for (const gateData of this.gates) {
      for (const qubit of gateData.qubits) {
        if (qubit < 0) {
          return `Invalid qubit index: ${qubit}`;
        }
      }
    }

    return null;
  }

  execute(): void {}
}

export { QuantumCircuit };
