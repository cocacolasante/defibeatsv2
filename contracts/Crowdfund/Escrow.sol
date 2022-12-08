// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Escrow{
    address private admin;

    modifier onlyAdmin {
        require(msg.sender == admin, "only admin can call function");
        _;
    }

    receive() external payable{}
    
    constructor() payable {
        admin = msg.sender;
    }

    function releaseFund() public onlyAdmin {

    }



    // getter functions

    function returnAdmin() public view returns(address){
        return admin;
    }
}