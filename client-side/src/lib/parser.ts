type Gate = {
  gate: string;
  qbit: number[];
};

class Parser {
  gates: Gate[] = [];
  gateCache: Set<number> = new Set();

  addGate(gate: string, qbitPosition: number[]) {
    const violatesConstraints = this.checkViolations(qbitPosition[0]);
    if (violatesConstraints) {
      console.error(`qbit at ${qbitPosition} violates constraints`);
      return false;
    }

    this.gates.push({ gate, qbit: qbitPosition });
    this.gateCache.add(qbitPosition[0]);
    return true;
  }

  checkViolations(qbitPosition: number): boolean {
    return !this.gateCache.has(qbitPosition);
  }
}

export default Parser;
