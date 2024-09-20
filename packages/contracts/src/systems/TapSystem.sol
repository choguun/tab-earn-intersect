// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";

import { Player, Score } from "../codegen/index.sol";
import { addressToEntity } from "../libraries/LibUtils.sol";

contract TapSystem is System {
  function registerPlayer() public {
    bytes32 playerEntityId = addressToEntity(_msgSender());
    Player._set(_msgSender(), playerEntityId);
    Score._set(playerEntityId, 0);
  }

  function mineBlock() public {
      bytes32 playerEntityId = Player._get(_msgSender());
      require(playerEntityId != bytes32(0), "Player does not exist");

      Score.setValue(playerEntityId, Score.getValue(playerEntityId) + 1);
   }
}
