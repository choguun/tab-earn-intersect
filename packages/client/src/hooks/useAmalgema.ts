import { useStore } from "./useStore";

export const useAmalgema = () => {
  const { networkLayer, externalWalletClient, externalWorldContract } = useStore();

  if (networkLayer === null) {
    throw new Error("Network layer not initialized");
  }

  return { ...networkLayer, externalWalletClient, externalWorldContract };
};
