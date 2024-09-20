import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  deploy: {
    upgradeableWorldImplementation: true,
  },
  codegen: {
    outputDirectory: "codegen",
  },
  tables: {
    Player: {
      schema: {
        player: "address",
        entityId: "bytes32",
      },
      key: ["player"],
    },

    Score: {
      schema: {
        entityId: "bytes32",
        value: "uint64",
      },
      key: ["entityId"],
    }
  },
});
