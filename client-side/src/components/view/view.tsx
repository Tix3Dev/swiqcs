import { Gate } from "@components/gate";
import { Grid } from "@components/grid";
import { useState } from "react";
import { QuantumCircuit } from "src/lib/parser";

let globalCircuit: any = null;

const createQuantumCircuit = (numRows: number) => {
  if (!globalCircuit) {
    globalCircuit = new QuantumCircuit(numRows);
  }
  else {
    globalCircuit.updateNumRows(numRows);
  }
  return globalCircuit;
};

function View() {
  // BD=black dot | CR=cross
  const gateTypes: string[] = ["X", "Y", "Z", "H", "S", "T", "BD", "CR"];
  const [selectedGate, setSelectedGate] = useState("");
  const [connecting, setConnecting] = useState(false);

  const [numRows, setNumRows] = useState(1);
  const circuit = createQuantumCircuit(numRows);

  // Function to update the numRows when it changes
  const handleNumRowsChange = (newNumRows: number) => {
    setNumRows(newNumRows);
  };

  return (
    <>
      <div className="gates">
        {gateTypes.map((type) => (
          <Gate type={type} onSelect={() => setSelectedGate(type)} />
        ))}
      </div>
      <Grid
        numCols={10}
        numRows={numRows}
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
        handleNumRowsChange={handleNumRowsChange} // Pass the callback to Grid
      />
      <div className="selection">
        Selected: {selectedGate}
      </div>
    </>
  );
}

export { View };
