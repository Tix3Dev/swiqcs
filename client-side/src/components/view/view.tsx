import { Gate } from "@components/gate";
import { Grid } from "@components/grid";
import { useState } from "react";
import { QuantumCircuit } from "src/lib/parser";

const circuit = new QuantumCircuit();

function View() {
  const gateTypes: string[] = ["H", "X", "CNOT", "BLACK_DUDE", "TOFFOLI"];
  const [selectedGate, setSelectedGate] = useState("");
  const [connecting, setConnecting] = useState(false);

  return (
    <>
      {gateTypes.map((type) => (
        <Gate type={type} onSelect={() => setSelectedGate(type)} />
      ))}
      <Grid
        numCols={10}
        numRows={1}
        onSelect={(x, y) => {
          /* 
            [
              X (row) index 0
              [
                 Y idx 0     Y idx 1     Y idx 2    Y idx 3
                ["H", NaN], ["I", NaN], ["BD", 0], ["X", 0]
              ],

              X (row) index 1
              [
                Y idx 0    Y idx 1     Y idx 2    Y idx 3
                ["H", 0], ["I", NaN], ["BD", 0], ["X", NaN]
              ]
            ]
          */

          circuit.push(selectedGate, x, y, connecting ? y : NaN);
          return selectedGate;
        }}
        onRun={() => circuit.execute()}
      />
      Selected: {selectedGate}
    </>
  );
}

export { View };
