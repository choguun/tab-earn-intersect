/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineSystem, getComponentValue, getComponentValueStrict, runQuery } from "@latticexyz/recs";
import { useStore } from "./useStore";

export const useMUD = () => {
  const { networkLayer, externalWalletClient, externalWorldContract } =
    useStore();

  if (networkLayer === null) {
    throw new Error("Store not initialized");
  }

  if ((window as any).layers === undefined) {
    (window as any).layers = {
      networkLayer,
    };

    (window as any).components = {
      ...networkLayer.components,
    };

    (window as any).ecs = {
      getComponentValue,
      getComponentValueStrict,
      runQuery,
      defineSystem,
    };
  }

  return {
    networkLayer,
    externalWalletClient,
    externalWorldContract,
  };
};
