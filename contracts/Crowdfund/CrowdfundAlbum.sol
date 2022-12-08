// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IEscrow.sol";

contract CrowdfundCreator{
    address public owner;


    struct Project{
        address artist;
        uint goal;
        uint endDate;
        bool completed;
    }
    constructor(){
        owner = msg.sender;

    }
    

    function createCrowdfund() public {

    }

    
}









// crowdfunding contract to be initialized in the the crowdfund creator contract

contract CrowdfundContract{
    address private crowdfundAdmin;
    address private artistAddress;
    address private escrowAddress;


    uint public goalAmount;
    uint public endDate;
    bool public goalReached;
    
    uint public minimumInvestment = 100000000000000000;

    string public albumName;

    mapping(address => uint) public investors;

    address[] public allInvestors;

    receive() external payable{}

    constructor(address _artist, uint _goalAmount, uint _endDate, string memory _albumName, address _escrowAddress)payable{
        artistAddress = _artist;
        goalAmount = _goalAmount;
        endDate = _endDate;
        albumName = _albumName;
        crowdfundAdmin = msg.sender;
        escrowAddress = _escrowAddress;
    }


    function invest() public payable {
        require(msg.value>=minimumInvestment, "please send minimum amount");

        investors[msg.sender]+= msg.value;
        allInvestors.push(msg.sender);

        payable(escrowAddress).transfer(msg.value);

    }

    // create a function if person invests over x amount they can mint a free nft









    function completeCrowdfund() public returns(bool){
        require(block.timestamp >= endDate, "still running");

        // logic to transfer 


        return goalReached = true;
    }


    // getter functions

    function returnCrowdfundAdmin() public view returns(address){
        return crowdfundAdmin;
    }

    function returnArtistAddress() public view returns(address){
        return artistAddress;
    }
    function returnEscrowContract() public view returns(address){
        return escrowAddress;
    }
}
