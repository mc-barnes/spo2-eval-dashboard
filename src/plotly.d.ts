declare module "plotly.js-basic-dist-min" {
  const Plotly: object;
  export default Plotly;
}

declare module "react-plotly.js/factory" {
  import type { ComponentType } from "react";
  function createPlotlyComponent(plotly: object): ComponentType<Record<string, unknown>>;
  export default createPlotlyComponent;
}
