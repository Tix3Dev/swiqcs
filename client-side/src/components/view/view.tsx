import { Gate } from "@components/gate";
import { Grid } from "@components/grid";
import { useState } from "react";
import { QuantumCircuit } from "src/lib/parser";

type Gates = "H" | "X" | "CNOT";

function View() {
  const gateTypes: Gates[] = ["H", "X", "CNOT"];
  const [selectedGate, setSelectedGate] = useState<Gates | null>(null);
  const circuit = new QuantumCircuit();

  return (
    <>
      {gateTypes.map((type) => (
        <Gate type={type} onSelect={() => setSelectedGate(type)} />
      ))}
      <Grid
        numCols={10}
        numRows={1}
        onSelect={(row, col) => {
          circuit.addGate(selectedGate!, [col]);
          return selectedGate as string;
        }}
        onRun={() => {
          const constraintViolation = circuit.checkConstraints();
          if (constraintViolation) {
            console.error(`Constraint Violation: ${constraintViolation}`);
          } else {
            circuit.execute();
          }
        }}
      />
      Selected: {selectedGate}
    </>
  );
}

export { View };
