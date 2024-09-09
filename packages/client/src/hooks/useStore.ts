import IWorldAbi from "contracts/out/IWorld.sol/IWorld.abi.json";
import {
  GetContractReturnType,
  PublicClient,
  Transport,
  Chain,
  WalletClient,
  Address,
} from "viem";
import { Config } from "wagmi";
import { create } from "zustand";

import { NetworkLayer } from "../layers/Network";

export type ContractType = GetContractReturnType<
  typeof IWorldAbi,
  PublicClient<Transport, Chain>,
  Address
>;

export type Store = {
  networkLayer: NetworkLayer | null;
  wagmiConfig: Config | null;
  externalWalletClient: WalletClient | null;
  externalWorldContract: ContractType | null;
  loadingPageHidden: boolean;
};

export const useStore = create<Store>(() => ({
  networkLayer: null,
  wagmiConfig: null,
  externalWalletClient: null,
  externalWorldContract: null,
  loadingPageHidden: false,
}));
