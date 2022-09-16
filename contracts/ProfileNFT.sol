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
    mapping(address=>string) public profileMessage;

    constructor()ERC721("DefiBeats Profile", "DFBP"){}

    function mint(string memory _tokenUri) external returns(uint){
        _tokenIds.increment();

        uint newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);

        ownerOfNft[newTokenId] = msg.sender;
        _setTokenURI(newTokenId, _tokenUri);

        return(newTokenId);
    }

    function burn(uint _tokenId) external {
        require(msg.sender == ownerOf(_tokenId), "must be owner to burn");

        delete ownerOfNft[_tokenId];
        _burn(_tokenId);
    
    }

    function setMessage(string memory message) public returns(string memory) {
        return(profileMessage[msg.sender] = message);
    }
    
}