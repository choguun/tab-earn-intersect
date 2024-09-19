import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  deploy: {
    upgradeableWorldImplementation: true,
  },
  codegen: {
    outputDirectory: "codegen",
  },
  tables: {
    PlayerScore: {
      key: ["playerAddress"],
      schema: {
        playerAddress: "address",
        value: "uint256",
      }
    }
  },
});
