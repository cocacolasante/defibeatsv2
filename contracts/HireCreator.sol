// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract HireCreator{
    address payable public producer;
    address payable public purchasee;
    uint public commission;
    bool public isCompleted;

    constructor(address payable _producer, uint _commission){
        producer = payable(_producer);
        commission = _commission;
    }

    

    
}
