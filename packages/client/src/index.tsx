import ReactDOM from "react-dom/client";
import { App } from "./App";
import { MUDProvider } from "./MUDProvider";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
root.render(
  <MUDProvider>
    <App />
  </MUDProvider>,
);

