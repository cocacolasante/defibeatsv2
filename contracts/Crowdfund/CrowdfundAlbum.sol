// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract CrowdfundCreator{
    address public owner;

    constructor(){
        owner = msg.sender;

    }

    function createCrowdfund() public {

    }

    
}

contract CrowdfundContract{
    address public artistAddress;

    constructor(){}
}
