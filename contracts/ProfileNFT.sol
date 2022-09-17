// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ProfileNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint public tokenCount;

    mapping(address=>uint)public nftProfileOwners;
    mapping(uint=>Creator) public numberToCreator;
    mapping(address=>Creator) public creatorsProfile;

    struct Creator{
        address payable creatorAddress;
        string profileMessage;
        uint tipsReceived;
        uint profileToken;
    }

    constructor()ERC721("DefiBeats Profile", "DFBP"){}

    function mint(string memory _tokenUri) external returns(uint){
        _tokenIds.increment();
        tokenCount++;

        uint newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);

        numberToCreator[newTokenId] = Creator(
            payable(msg.sender),
            "",
            0,
            newTokenId
        );

        _setTokenURI(newTokenId, _tokenUri);

        creatorsProfile[msg.sender] = Creator(
            payable(msg.sender),
            "",
            0,
            newTokenId
        );

        return(newTokenId);
    }

    function burn(uint _tokenId) external {
        require(msg.sender == ownerOf(_tokenId), "must be owner to burn");

        delete numberToCreator[_tokenId];
        _burn(_tokenId);
    
    }

    function setMessage(address creatorsPro, string memory message) public returns(string memory ) {
        Creator storage creator = creatorsProfile[creatorsPro];
        require(msg.sender == creator.creatorAddress, "cannot set someone elses message" );

        return(creator.profileMessage = message);
    }

    function tipCreator(address creatorAddress) external payable returns(uint){
        require(msg.value > 0, "cannot tip 0");
        require(msg.sender != creatorAddress, "cannot tip yourself");

        Creator storage creator = creatorsProfile[creatorAddress];

        payable(creatorAddress).transfer(msg.value);

        return(creator.tipsReceived += msg.value);
        
    }

    function setProfile(uint tokenId) public returns(uint){
        require(msg.sender == ownerOf(tokenId), "owner can only set profile they own");

        Creator storage creator = creatorsProfile[msg.sender];
        
        return(creator.profileToken = tokenId);
    }
}
