// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;

function addressToEntity(address a) pure returns (bytes32) {
  return bytes32(uint256(uint160((a))));
}

function entityToAddress(bytes32 value) pure returns (address) {
  return address(uint160(uint256(value)));
}

