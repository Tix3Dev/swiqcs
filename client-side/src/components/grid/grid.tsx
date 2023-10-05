import { useState } from "react";
import "./grid.css";

type GridProps = {
  numRows: number;
  numCols: number;
  onSelect: (row: number, col: number) => void;
};

function Grid({ numCols, numRows, onSelect }: GridProps) {
  const [hoveredCell, setHoveredCell] = useState({ row: -1, col: -1 });

  const handleMouseOver = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };

  const rows = [];
  for (let row = 0; row < numRows; row++) {
    const cols = [];
    for (let column = 0; column < numCols; column++) {
      const className = `cell ${
        hoveredCell.row === row && hoveredCell.col === column ? "hovered" : ""
      }`;
      cols.push(
        <div
          key={column}
          className={className}
          onMouseOver={() => handleMouseOver(row, column)}
          onClick={() => onSelect(hoveredCell.row, hoveredCell.col)}
        />
      );
    }
    rows.push(
      <div key={row} className="row">
        {cols}
      </div>
    );
  }

  return <div className="grid">{rows}</div>;
}

export default Grid;
