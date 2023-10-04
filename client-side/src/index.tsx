import React from "react";
import ReactDOM from "react-dom/client";
import Grid from "@components/grid";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Grid />
  </React.StrictMode>
);
