import { Gate } from "@components/gate";
import { Grid } from "@components/grid";
import { useState } from "react";
import { QuantumCircuit } from "src/lib/parser";

type Gates = "H" | "X" | "CNOT" | "Z" | "U";

function View() {
  const gateTypes: Gates[] = ["H", "X", "CNOT", "Z", "U"];
  const [selectedGate, setSelectedGate] = useState<Gates | null>(null);
  const circuit = new QuantumCircuit();

  return (
    <>
      <div className="gates">
        {gateTypes.map((type) => (
          <Gate type={type} onSelect={() => setSelectedGate(type)} />
        ))}
      </div>
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
      <div className="selection">
        Selected: {selectedGate}
      </div>
    </>
  );
}

export { View };
