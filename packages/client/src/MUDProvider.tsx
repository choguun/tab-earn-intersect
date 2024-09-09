import { useEffect, useMemo } from "react";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";

import { useNetworkLayer } from "./hooks/useNetworkLayer";
import { useStore } from "./hooks/useStore";
import { getNetworkConfig } from "./mud/getBrowserNetworkConfig";

import { ExternalWalletProvider } from "./ExternalWalletProvider";
import "@rainbow-me/rainbowkit/styles.css";

export const queryClient = new QueryClient();

export type Props = {
  children: React.ReactNode;
};

export function MUDProvider({ children }: Props) {
  const networkConfig = useMemo(() => getNetworkConfig(), []);
  const wagmiConfig = useMemo(
    () =>
      getDefaultConfig({
        appName: "Tap Earn Intersect",
        projectId: "57f814fbe33baeb0090e3917cf72064d",
        chains: [networkConfig.chain],
        transports: {
          [networkConfig.chain.id]: http(),
        },
      }),
    [networkConfig]
  );
  const networkLayer = useNetworkLayer(networkConfig);
  useEffect(() => {
    if (networkLayer) {
      useStore.setState({ networkLayer });
    }
  }, [networkLayer]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ExternalWalletProvider networkConfig={networkConfig}>
            {children}
          </ExternalWalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
