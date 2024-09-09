// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;

function entityToAddress(bytes32 value) pure returns (address) {
  return address(uint160(uint256(value)));
}
