// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IEscrow {
    function releaseFund() external; 
    function refundInvest(uint amount) external;
}