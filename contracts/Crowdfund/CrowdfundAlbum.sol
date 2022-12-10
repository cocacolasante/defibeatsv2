// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IEscrow.sol";
import "./CrowdfundNFT.sol";
import "./interfaces/ICrowdfundContract.sol";
import "./Escrow.sol";

contract CrowdfundCreator{
    uint private projectID;

    address private owner;

    mapping(uint => Project) public projects;

    struct Project{
        address artist;
        uint goal;
        uint endDate;
        bool completed;
        bool canceled;
        address crowdfundContract;
    }

    event ProjectCompleted(uint projectId, address projectAddress, address artist);

    modifier onlyPrjOwnOrOwner(uint _projectId) {
        require(msg.sender == projects[_projectId].artist || msg.sender == owner );
        _;
    }

    constructor(){
        owner = msg.sender;

    }
    

    function createCrowdfund(address _artist, uint _goalAmount, uint _endDate, bytes32  _albumName, string memory _nftBaseUri) public {
        projectID++;
        uint newProjectId = projectID;

        Escrow newEscrow = new Escrow();

        CrowdfundContract newProject = new CrowdfundContract( _artist,  _goalAmount, _endDate, _albumName, address(newEscrow), _nftBaseUri);
        newEscrow.setCrowdfundContract(address(newProject));

        Project memory newPrjStruct = Project(_artist, _goalAmount, _endDate,false, false, address(newProject));
        projects[newProjectId] = newPrjStruct;


    }

    function completeCrowdfundProject(uint _projectId) public onlyPrjOwnOrOwner(_projectId){
        projects[_projectId].completed = true;
        address currentCrowdfundAddress = projects[_projectId].crowdfundContract;
        ICrowdfundContract(currentCrowdfundAddress).completeCrowdfund();

        emit ProjectCompleted(_projectId, currentCrowdfundAddress, projects[_projectId].artist);

    }

    function cancelCrowdfund(uint _projectId) public onlyPrjOwnOrOwner(_projectId){
        projects[_projectId].canceled = true;
        address currentCrowdfundAddress = projects[_projectId].crowdfundContract;
        ICrowdfundContract(currentCrowdfundAddress).cancelCrowdfund();
    }





    function returnOwner() public view returns(address){
        return owner;
    }
    
}









// crowdfunding contract to be initialized in the the crowdfund creator contract

contract CrowdfundContract{
    address private crowdfundAdmin;
    address private artistAddress;
    address private escrowAddress;
    CrowdfundNFT private rewardNFT;

    uint public amountToGoal;
    uint public goalAmount;
    uint public endDate;
    bool public goalReached;
    
    uint public minimumInvestment = 100000000000000000;

    bytes32 albumName;

    mapping(address => uint) public investors;

    address[] public allInvestors;

    modifier onlyAdmin {
        require(msg.sender == crowdfundAdmin, " admin");
        _;        
    }

    receive() external payable{}

    // nft base uri is used for the rewards nft they will receive at the end

    constructor(address _artist, uint _goalAmount, uint _endDate, bytes32 _albumName, address _escrowAddress, string memory _nftBaseUri)payable{
        artistAddress = _artist;
        goalAmount = _goalAmount;
        endDate = _endDate;
        albumName = _albumName;
        crowdfundAdmin = msg.sender;
        escrowAddress = _escrowAddress;
        string memory albumString =string(abi.encodePacked(_albumName));
        rewardNFT = new CrowdfundNFT((albumString), _nftBaseUri);

    }


    function invest() public payable {
        require(msg.value>=minimumInvestment, "amount");

        investors[msg.sender]+= msg.value;
        
        allInvestors.push(msg.sender);

        payable(escrowAddress).transfer(msg.value);

        amountToGoal+=msg.value;

        if(amountToGoal >= goalAmount){
            goalReached = true;
        }

    }

    // create a function if person invests over x amount they can mint a free nft


    function cancelInvestment() public {
        require(investors[msg.sender] > 0, "cant cancel");

        uint refundAmount = investors[msg.sender];
        investors[msg.sender] = 0;
        IEscrow(escrowAddress).refundInvest(refundAmount);

        for(uint i; i < allInvestors.length; i++){
            if(allInvestors[i] == msg.sender){
                delete allInvestors[i];
            }
        }

    }

    // add require statements
    function cancelCrowdfund() public onlyAdmin{
        for(uint i; i < allInvestors.length; i++){

            uint refundAmount = investors[allInvestors[i]];
            investors[allInvestors[i]] = 0; // protect from reentrancy attacks from changin state variable prior to external call

            IEscrow(escrowAddress).refundInvest(refundAmount);
            payable(allInvestors[i]).transfer(refundAmount);

                        
        }
    }






    function completeCrowdfund() public onlyAdmin{
        require(block.timestamp >= endDate, "still running");
        require(goalReached ==true, "goal not reached");

        IEscrow(escrowAddress).releaseFund();

        payable(artistAddress).transfer(address(this).balance);

         for(uint i; i < allInvestors.length; i++){
            rewardNFT.mint(allInvestors[i]);
        }
        
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
