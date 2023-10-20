import { Gate } from "@components/gate";
import { Grid } from "@components/grid";
import { useState } from "react";
import { QuantumCircuit } from "src/lib/parser";

const circuit = new QuantumCircuit();

function View() {
  // BD=black dot | CR=cross
  const gateTypes: string[] = ["X", "Y", "Z", "H", "S", "T", "BD", "CR"];
  const [selectedGate, setSelectedGate] = useState("");
  const [connecting, setConnecting] = useState(false);

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
        onLink={(from, to) => {
          // Cannot span horizontally
          if (from.x !== to.x) return;
          circuit.link(from, to);
        }}
      />
      <div className="selection">
        Selected: {selectedGate}
      </div>
    </>
  );
}

export { View };
