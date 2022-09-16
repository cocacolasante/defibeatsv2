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
    mapping(uint=>address) public ownerOfNft;
    mapping(address=>Creator) public creators;

    

    struct Creator{
        address payable creator;
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

        ownerOfNft[newTokenId] = msg.sender;
        _setTokenURI(newTokenId, _tokenUri);

        creators[msg.sender] = Creator(
            payable(msg.sender),
            "",
            0,
            newTokenId
        );

        return(newTokenId);
    }

    function burn(uint _tokenId) external {
        require(msg.sender == ownerOf(_tokenId), "must be owner to burn");

        delete ownerOfNft[_tokenId];
        _burn(_tokenId);
    
    }

    function setMessage(string memory message) public returns(string memory) {
        return(creators[msg.sender].profileMessage = message);
    }

    function tipCreator(address creator) external payable {
        require(msg.value > 0, "cannot tip 0");
        payable(creator).transfer(msg.value);
        creators[creator].tipsReceived += msg.value;
    }

    function setProfile(uint tokenId) public returns(uint){
        return(creators[msg.sender].profileToken = tokenId);
    }
}
