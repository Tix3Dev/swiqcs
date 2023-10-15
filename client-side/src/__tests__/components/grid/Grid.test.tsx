import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { Grid } from "@components/grid";

describe("Grid component", () => {
  it("renders without crashing", () => {
    render(
      <Grid numCols={3} numRows={3} onSelect={() => ""} onRun={() => {}} />
    );
  });

  it("renders the grid cells", () => {
    render(
      <Grid numCols={3} numRows={3} onSelect={() => ""} onRun={() => {}} />
    );

    // Check if the grid cells are rendered
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cell = screen.getByTestId(`cell-${row}-${col}`);
        expect(cell).toBeInTheDocument();
      }
    }
  });

  it("adds a new row when the 'Add Row' button is clicked", () => {
    render(
      <Grid numCols={3} numRows={3} onSelect={() => ""} onRun={() => {}} />
    );
    const addButton = screen.getByText("Add Row");

    fireEvent.click(addButton);

    // Check if a new row is added
    const rows = screen.getAllByTestId(/^row-\d+$/);
    expect(rows).toHaveLength(4); // Original 3 rows + 1 new row
  });

  it("removes a row when the 'Remove Row' button is clicked", () => {
    render(
      <Grid numCols={3} numRows={3} onSelect={() => ""} onRun={() => {}} />
    );
    const removeButtons = screen.getAllByTestId(/^remove-row-\d+$/);

    // Click the 'Remove Row' button for the second row (index 1)
    fireEvent.click(removeButtons[1]);

    // Check if the row is removed
    const rows = screen.getAllByTestId(/^row-\d+$/);
    expect(rows).toHaveLength(2); // Original 3 rows - 1 removed row
  });
});
