/*
 * Creates components for use by the client.
 *
 * By default it returns the components from setupNetwork.ts, those which are
 * automatically inferred from the mud.config.ts table definitions.
 *
 * However, you can add or override components here as needed. This
 * lets you add user defined components, which may or may not have
 * an onchain component.
 */

import { Type, defineComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ components, world }: SetupNetworkResult) {
  return {
    ...components,
    Transaction: defineComponent(world, {
      entity: Type.OptionalEntity,
      systemCall: Type.String,
      systemId: Type.String,
      gasEstimate: Type.OptionalBigInt,
      manualGasEstimate: Type.Boolean,
      gasPrice: Type.OptionalBigInt,
      status: Type.String,
      hash: Type.OptionalString,
      error: Type.OptionalString,
      submittedBlock: Type.OptionalBigInt,
      completedBlock: Type.OptionalBigInt,
      submittedTimestamp: Type.OptionalBigInt,
      completedTimestamp: Type.OptionalBigInt,
      actionId: Type.OptionalString,
      clientSubmittedTimestamp: Type.OptionalBigInt,
    }),
    Action: defineComponent(
      world,
      {
        entity: Type.OptionalEntity,
        type: Type.String,
        status: Type.String,
      },
      { id: "Action" },
    ),
    WalletBalance: defineComponent(
      world,
      {
        value: Type.BigInt,
      },
      { id: "WalletBalance" },
    ),
    // add your client components or overrides here
  };
}
