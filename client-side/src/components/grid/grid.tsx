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

import { useState } from "react";
import "./grid.css";

type GridProps = {
  numCols: number;
  numRows: number;
  onSelect: (x: number, y: number) => string;
  onLink: (from: GridItem, to: GridItem) => void;
  onRun: () => void;
  handleNumRowsChange: (newNumRows: number, rowIndex: number) => void;
};

function Grid({ numCols, numRows, onSelect, onLink, onRun, handleNumRowsChange }: GridProps) {
  const [grid, setGrid] = useState<string[][]>(() => {
    // Initialize the grid with empty cells
    const initialGrid: string[][] = [];
    for (let row = 0; row < numRows; row++) {
      initialGrid.push(Array.from({ length: numCols }, () => ""));
    }
    return initialGrid;
  });

  const [hoveredCell, setHoveredCell] = useState({ row: -1, col: -1 });
  const [isSelectingTwo, setIsSelectingTwo] = useState(false); // State to track if selecting two elements
  const [selectedCells, setSelectedCells] = useState<Vector2D[]>([]);

  const handleMouseOver = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (row: number, col: number) => {
    if (isSelectingTwo) {
      // In "Select Two" mode, listen for two clicks
      setSelectedCells((prevSelectedCells) => {
        const newSelectedCells = [...prevSelectedCells, { x: col, y: row }];

        if (newSelectedCells.length === 2) {
          // Two cells have been clicked, invoke onLink
          const [cell1, cell2] = newSelectedCells;
          // console.log(grid[cell1.x][cell1.y]); // gives error
          console.log(newSelectedCells, grid[cell1.y][cell1.x]);

          onLink(
            { ...cell1, gate: grid[cell1.y][cell1.x] },
            { ...cell2, gate: grid[cell2.y][cell2.x] }
          );
          setIsSelectingTwo(false); // Exit "Select Two" mode
          return [];
        } else {
          return newSelectedCells;
        }
      });
    } else {
      // In normal mode, use the onSelect callback
      const type = onSelect(col, row);
      const newGrid = [...grid];
      newGrid[row][col] = type;
      setGrid(newGrid);
    }
  };

  const addRow = () => {
    const newRow = Array.from({ length: numCols }, () => "");
    setGrid((prevGrid) => [...prevGrid, newRow]);

    // Call the handleNumRowsChange function to update the number of rows
    handleNumRowsChange(numRows + 1, numRows);
  };

  const removeRow = (rowIndex: number) => {
    if (grid.length <= 1) {
      return;
    }
    const newGrid = [...grid];
    newGrid.splice(rowIndex, 1);

    setGrid(newGrid);
    
    // Call the handleNumRowsChange function to update the number of rows
    handleNumRowsChange(numRows - 1, rowIndex);
  };

  return (
    <div>
      <div className="buttons">
        <button onClick={onRun}>Run</button>
        <button onClick={addRow}>Add Row</button>
        <button onClick={() => setIsSelectingTwo(true)}>Link</button>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} data-testid={`row-${rowIndex}`} className="row">
            <button
              data-testid={`remove-row-${rowIndex}`}
              onClick={() => removeRow(rowIndex)}
            >
              Remove Row
            </button>
            <div className="cells">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  data-testid={`cell-${rowIndex}-${colIndex}`}
                  className={`cell ${
                    hoveredCell.row === rowIndex && hoveredCell.col === colIndex
                      ? "hovered"
                      : ""
                  } ${
                    selectedCells.some(
                      (selectedCell) =>
                        selectedCell.y === rowIndex && selectedCell.x === colIndex
                    )
                      ? "selected"
                      : ""
                  }`}
                  onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Grid };
