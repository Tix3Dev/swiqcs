import Grid from "@components/grid";
import { render, screen } from "@testing-library/react";

test("renders learn react link", () => {
  render(<Grid />);
  const linkElement = screen.getByText(/grid/i);
  expect(linkElement).toBeInTheDocument();
});
