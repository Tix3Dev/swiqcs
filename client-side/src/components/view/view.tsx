// This file is part of a quantum circuit simulator
// Everything is openly developed on GitHub: https://github.com/Tix3Dev/swiqcs
//
// Copyright (C) 2023  Yves Vollmeier <https://github.com/Tix3Dev> and main collaborators
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Gate } from "@components/gate";
import { Grid } from "@components/grid";
import { useState, useEffect } from "react";
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
  const [outputString, setOutputString] = useState("");

  const [numRows, setNumRows] = useState(1);
  const circuit = createQuantumCircuit(numRows);

  // Function to update the numRows when it changes
  const handleNumRowsChange = (newNumRows: number, rowIndex: number) => {
    if (newNumRows > numRows) {
      console.log("number of rows increased");
    }
    else {
      console.log("number of rows decreased");
      circuit.removeRow(rowIndex);
    }

    setNumRows(newNumRows);
  };

  useEffect(() => {
    setOutputString(circuit.outputString);
  }, [circuit.outputString]);

  return (
    <>
      <div className="gates">
        {gateTypes.map((type) => (
          <Gate type={type} onSelect={() => setSelectedGate(type)} />
        ))}
      </div>
      <div className="selection">
        Selected: {selectedGate}
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
        // onRun={() => {
        //   circuit.execute();
        //   setOutputString(circuit.outputString);
        // }}
        onRun={async() => {
          await circuit.execute();
          setOutputString(circuit.outputString);
        }}

        onLink={(from, to) => {
          // Cannot span horizontally
          if (from.x !== to.x) {  
            console.log("weird conditional executed 11");
            return;
          }
          circuit.link(from, to);
        }}
        handleNumRowsChange={handleNumRowsChange} // Pass the callback to Grid
      />
      <div className="output">
        Output:
      </div>
      <div className="output">
        {outputString}
      </div>
    </>
  );
}

export { View };
