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
        uint hireDate;
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
            block.timestamp,
            false,
            false
        );

        payable(address(this)).transfer(msg.value);

        // emit job offered function
    }

    function cancelJob(uint jobNumber) external payable{
        Job storage job = jobs[jobNumber];
        require(msg.sender == job.purchaser, "must be purchaser to cancel");
        require(block.timestamp <= job.hireDate + 2 days, "cannot cancel after 48 hours");

        job.isCancelled = true;
        job.purchaser.transfer(job.commission);

    }

    function rejectJob(uint jobNumber) external payable{
        Job storage job = jobs[jobNumber];
        require(msg.sender == job.producer, "must be producer to cancel");
        

        job.isCancelled = true;
        job.purchaser.transfer(job.commission);

    }

    function noResponseCancelFromPurchaser(uint jobNumber) external payable {
        Job storage job = jobs[jobNumber];
        require(block.timestamp <= job.hireDate + 120 days, "still time left on job");

        job.isCancelled = true;
        job.purchaser.transfer(job.commission);

    }
}
