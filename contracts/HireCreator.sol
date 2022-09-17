// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract HireCreator{
    address payable public feeAccount;
    address public admin;

    uint public feeAmount;

    uint public jobCount;

    mapping(uint => Job) public jobs;

    struct Job{
        uint jobNumber;
        address payable producer;
        address payable purchaser;
        uint commission;
        bool isCompleted;
        bool isCancelled;
    }

    constructor(uint _feeAmount){
        feeAccount = payable(msg.sender);
        admin = msg.sender;
        feeAmount = _feeAmount;
    }

    function setJob(address _producer) external payable {
        require(msg.sender != _producer, "cannot hire yourself");
        jobCount++;

        jobs[jobCount] = Job(
            jobCount,
            payable(_producer),
            payable(msg.sender),
            msg.value,
            false,
            false
        );

        payable(address(this)).transfer(msg.value);
        
    }
}
