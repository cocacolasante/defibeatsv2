// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CrowdfundNFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private admin;

    
    string private baseUri;

    mapping(uint=>address) public addressList;

    event TokenMinted(address to, uint tokenId, string tokenUri);

    modifier onlyAdmin{
        require(msg.sender == admin, "only admin function");
        _;
    }

    constructor(string memory _name, string memory _baseUri) ERC721(_name, "DGB"){
        admin = msg.sender;
        baseUri = _baseUri;
    }



    function mint(address _to) public onlyAdmin returns(uint){
        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();

        _mint(_to, newTokenId);

        addressList[newTokenId] = _to;
        
        string memory tokenURI = string(abi.encodePacked(baseUri, Strings.toString(newTokenId), '.json'));


        _setTokenURI(newTokenId, tokenURI);

        emit TokenMinted(_to, newTokenId, tokenURI);

        return(newTokenId);
    }



    // getter functions
    function returnAdmin() public view returns(address){
        return admin;
    }

    function returnCurrentToken() public view returns(uint){
        return _tokenIds.current();
    }

    function returnBaseURI() public view returns(string memory){
        return baseUri;
    }
}
