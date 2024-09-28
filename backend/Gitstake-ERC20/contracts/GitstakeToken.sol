// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GitstakeToken is ERC20 {
    address public immutable i_owner;

    constructor(uint256 initialSupply) ERC20("StakeToken", "GST") {
        i_owner = msg.sender;
        _mint(msg.sender, initialSupply * 10 ** 18);
    }

    function approveOwnerOfSupply(uint256 initialSupply) external {
        approve(msg.sender, initialSupply * 10 ** 18);
    }

    function getTokenOwner() external view returns (address) {
        return i_owner;
    }

    function fundContract(address to, uint256 amt) external {
        require(msg.sender == i_owner, "Only owner can transfer");
        transferFrom(i_owner, to, amt);
    }
}
