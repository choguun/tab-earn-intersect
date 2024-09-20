/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { transportObserver } from "@latticexyz/common";
import { transactionQueue } from "@latticexyz/common/actions";
import IWorldAbi from "../IWorld.abi.json";
import {
  createPublicClient,
  fallback,
  webSocket,
  http,
  getContract,
  Hex,
} from "viem";
import { useWalletClient } from "wagmi";

import { useStore } from "./hooks/useStore";
import { NetworkConfig } from "./mud/utils";

export type Props = {
  networkConfig: NetworkConfig;
  children: React.ReactNode;
};

export function ExternalWalletProvider({ networkConfig, children }: Props) {
  const { data: externalWalletClient } = useWalletClient();
  useEffect(() => {
    if (networkConfig.useBurner) return;

    if (!externalWalletClient) {
      useStore.setState({
        externalWalletClient: null,
        externalWorldContract: null,
      });
      return;
    }

    const customExternalWalletClient = externalWalletClient.extend(
      transactionQueue()
    );

    // TODO: centralize this somewhere
    const publicClient = createPublicClient({
      chain: networkConfig.chain,
      transport: transportObserver(
        fallback([webSocket(), http()], { retryCount: 0 })
      ),
      pollingInterval: 250,
    });

    const externalWorldContract = getContract({
      address: networkConfig.worldAddress as Hex,
      abi: IWorldAbi,
      client: {
        public: publicClient,
        wallet: customExternalWalletClient,
      },
    });

    useStore.setState({
      externalWalletClient: customExternalWalletClient,
      externalWorldContract: externalWorldContract as any,
    });
  }, [
    externalWalletClient,
    networkConfig.chain,
    networkConfig.useBurner,
    networkConfig.worldAddress,
  ]);

  return children;
}
