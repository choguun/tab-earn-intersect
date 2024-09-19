import { createBrowserRouter } from "react-router-dom";
// import { Amalgema } from "./app/Amalgema";
import { App } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  }
]);
