import { useState } from "react";
import "./grid.css";

type GridProps = {
  numCols: number;
  numRows: number;
  onSelect: (row: number, col: number) => string;
  onRun: () => void;
};

function Grid({ numCols, numRows, onSelect, onRun }: GridProps) {
  const [grid, setGrid] = useState<string[][]>(() => {
    // Initialize the grid with empty cells
    const initialGrid: string[][] = [];
    for (let row = 0; row < numRows; row++) {
      initialGrid.push(Array.from({ length: numCols }, () => ""));
    }
    return initialGrid;
  });

  const [hoveredCell, setHoveredCell] = useState({ row: -1, col: -1 });

  const handleMouseOver = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (row: number, col: number) => {
    const type = onSelect(row, col);

    const newGrid = [...grid];
    newGrid[row][col] = type;
    setGrid(newGrid);
  };

  const addRow = () => {
    const newRow = Array.from({ length: numCols }, () => "");
    setGrid((prevGrid) => [...prevGrid, newRow]);
  };

  const removeRow = (rowIndex: number) => {
    if (grid.length <= 1) {
      return;
    }
    const newGrid = [...grid];
    newGrid.splice(rowIndex, 1);
    setGrid(newGrid);
  };

  return (
    <div>
      <div className="buttons">
        <button onClick={onRun}>Run</button>
        <button onClick={addRow}>Add Row</button>
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
                  data-testid={`cell-${rowIndex}-${colIndex}`} // Add data-testid attribute
                  className={`cell ${
                    hoveredCell.row === rowIndex && hoveredCell.col === colIndex
                      ? "hovered"
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
