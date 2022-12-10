// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ICrowdfundContract {
    function invest() external payable;
    function cancelInvestment() external;

    function cancelCrowdfund() external;
    function completeCrowdfund() external;
    
     
}