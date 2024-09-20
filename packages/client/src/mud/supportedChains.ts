/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * The supported chains.
 * By default, there are only two chains here:
 *
 * - mudFoundry, the chain running on anvil that pnpm dev
 *   starts by default. It is similar to the viem anvil chain
 *   (see https://viem.sh/docs/clients/test.html), but with the
 *   basefee set to zero to avoid transaction fees.
 * - Redstone, our production blockchain (https://redstone.xyz/)
 * - Garnet, our test blockchain (https://garnetchain.com/))
 *
 */

import { MUDChain, mudFoundry, redstone, garnet } from "@latticexyz/common/chains";

/*
 * See https://mud.dev/guides/hello-world/add-chain-client
 * for instructions on how to add networks.
 */


export const interact: any = {
    id: 1612, // Your custom chain ID
    name: 'InteractTestnet',
    // network: 'my-custom-network',
    nativeCurrency: {
      name: 'Perl Token',
      symbol: 'Perl',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://testnet-pearl-c612f.avax-test.network/ext/bc/CcXVATAg76vM849mrPoTigwp48qhFiN9WCa51DBQXNGkBKZw7/rpc?token=3296aa3e491dd5d366815601cc95be7275cd293486b09fe082619750d7b38587'],
      },
      public: {
        http: ['https://testnet-pearl-c612f.avax-test.network/ext/bc/CcXVATAg76vM849mrPoTigwp48qhFiN9WCa51DBQXNGkBKZw7/rpc?token=3296aa3e491dd5d366815601cc95be7275cd293486b09fe082619750d7b38587'],
      },
    },
    blockExplorers: {
      default: {
        name: 'InteractExplorer',
        url: 'https://subnets-test.avax.network/intersect',
      },
    },
};

export const supportedChains: MUDChain[] = [mudFoundry, redstone, garnet, interact];
