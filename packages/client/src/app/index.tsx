/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useComponentValue } from "@latticexyz/react";
// import { useMUD } from "./MUDContext";
import { App as Amalgema } from "./app";
import { useStore } from "../hooks/useStore";

export const App = () => {
  const layers = useStore((state) => {
    return {
      networkLayer: state.networkLayer,
    };
  });

  if (!layers.networkLayer) return <></>;

  return (
    <Amalgema />
  );
};
