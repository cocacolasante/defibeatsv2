// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Escrow{
    address private admin;
    address private crowdfundContract;

    modifier onlyAdmin {
        require(msg.sender == admin, "only admin can call function");
        _;
    }

    receive() external payable{}

    constructor() payable {
        admin = msg.sender;
    }

    // add only admin modifer during combined test
    function refundInvest(uint amount) public payable {
        payable(crowdfundContract).transfer(amount);
    }

    function releaseFund() public  {
        payable(crowdfundContract).transfer(address(this).balance);
    }


    // setter functions
    function setCrowdfundContract(address crowdfund) public onlyAdmin{
        crowdfundContract = crowdfund;
    }


    // getter functions

    function returnAdmin() public view returns(address){
        return admin;
    }

    function returnCrowdfundContract() public view returns(address){
        return crowdfundContract;
    }
}