/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createBurnerAccount,
  getNonceManager,
  transportObserver,
} from "@latticexyz/common";
import { transactionQueue } from "@latticexyz/common/actions";
import { encodeEntity, syncToRecs } from "@latticexyz/store-sync/recs";
import mudConfig from "contracts/mud.config";
import IWorldAbi from "../../IWorld.abi.json";
import { map, filter } from "rxjs";
import { getContract } from "viem";
import {
  createPublicClient,
  fallback,
  webSocket,
  http,
  createWalletClient,
  Hex,
  ClientConfig,
} from "viem";

import { useStore } from "../hooks/useStore";

import { createClock } from "./createClock";
import { NetworkConfig } from "./utils";
import { createWaitForTransaction } from "./waitForTransaction";
import { world } from "./world";

export const addressToEntityID = (address: Hex) =>
  encodeEntity({ address: "address" }, { address });

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork(networkConfig: NetworkConfig) {
  const clientOptions = {
    chain: networkConfig.chain,
    transport: transportObserver(
      fallback([webSocket(), http()], { retryCount: 0 })
    ),
    pollingInterval: 250,
  } as const satisfies ClientConfig;

  const publicClient = createPublicClient(clientOptions);

  const txReceiptClient = createPublicClient({
    ...clientOptions,
    transport: transportObserver(
      fallback([webSocket(), http()], { retryCount: 0 })
    ),
    pollingInterval: 250,
  });

  const { components, latestBlock$, storedBlockLogs$ } = await syncToRecs({
    world,
    config: mudConfig,
    address: networkConfig.worldAddress as Hex,
    publicClient: txReceiptClient,
    startBlock:
      networkConfig.initialBlockNumber > 0n
        ? BigInt(networkConfig.initialBlockNumber)
        : undefined,
    // making the block range very small here, as we've had problems with
    // large JIB Craft worlds overloading the RPC
    maxBlockRange: 100n,
  });

  const clock = createClock(networkConfig.clock);
  world.registerDisposer(() => clock.dispose());

  const waitForTransaction = createWaitForTransaction({
    storedBlockLogs$,
    client: txReceiptClient,
  } as const);

  // time it takes to receive events from a sent tx
  let meanResponseTime = 2000;
  const updateMeanResponseTime = (newResponseTime: number) => {
    meanResponseTime = newResponseTime;
  };
  const getMeanResponseTime = () => meanResponseTime;

  latestBlock$
    .pipe(
      map((block) => {
        // accelerate the player's clock to compensate for the time it
        // takes for their tx to be included in a block. this has the
        // effect of making the beginnings of turns feel more responsive
        // as you can "pre-send" your txs to arrive at the start of the
        // next turn. this will hopefully alleviate the latency advantage
        // at the beginning of turns.
        // unfortunately, we can only change the player's clock by whole seconds
        // because that is the granularity of the block timestamps.
        // in my manual testing 2 second acceleration was possible with a response time
        // around 3600 ms.
        const clientTimeAhead =
          Math.ceil(getMeanResponseTime() / 2 / 1000) * 1000;
        return Number(block.timestamp) * 1000 + clientTimeAhead;
      }), // Map to timestamp in ms
      filter((blockTimestamp) => blockTimestamp !== clock.lastUpdateTime), // Ignore if the clock was already refreshed with this block
      filter((blockTimestamp) => blockTimestamp !== clock.currentTime) // Ignore if the current local timestamp is correct
    )
    .subscribe(clock.update); // Update the local clock

  const burnerAccount = createBurnerAccount(networkConfig.privateKey as Hex);
  const walletClient = createWalletClient({
    ...clientOptions,
    account: burnerAccount,
  });

  const txQueue = transactionQueue({
    queueConcurrency: 3,
  });
  const customWalletClient = walletClient.extend(txQueue);
  const walletNonceManager = await getNonceManager({
    client: publicClient,
    address: walletClient.account.address,
    blockTag: "pending",
    queueConcurrency: 3,
  });
  walletNonceManager.resetNonce();

  const worldContract = getContract({
    address: networkConfig.worldAddress as Hex,
    abi: IWorldAbi,
    client: { public: publicClient, wallet: customWalletClient },
  });

  // If flag is set, use the burner key as the "External" wallet
  if (networkConfig.useBurner) {
    const externalWalletClient = customWalletClient;
    const externalWorldContract = worldContract;

    useStore.setState({
      externalWalletClient: externalWalletClient as any,
      externalWorldContract: externalWorldContract as any
    });
  }

  return {
    world,
    components,
    playerEntity: encodeEntity(
      { address: "address" },
      { address: walletClient.account.address }
    ),
    publicClient,
    txReceiptClient,
    walletClient,
    walletNonceManager,
    waitForTransaction,
    worldContract,
    networkConfig,
    clock,
    latestBlock$,
    storedBlockLogs$,
    chains: [networkConfig.chain],
    responseTime: {
      updateMeanResponseTime,
      getMeanResponseTime,
    },
  };
}
