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
    
    mapping(address=>mapping(address=>bool)) public hasLikeProfile;

    // mapping of users likes to creators profiles
    mapping(address=>Creator[]) public usersLikedList;

    address[] public users;

    struct Creator{
        address payable creatorAddress;
        string profileMessage;
        uint tipsReceived;
        uint profileToken;
        uint numOfLikes;
        string username;
    }

    constructor()ERC721("DefiBeats Profile", "DFBP"){}

    function mint(string memory _tokenUri) external returns(uint){
        _tokenIds.increment();
        tokenCount++;

        uint newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        
        if(creatorsProfile[msg.sender].creatorAddress == address(0)){
            users.push(msg.sender);

            creatorsProfile[msg.sender] = Creator(
                payable(msg.sender),
                "",
                0,
                newTokenId,
                0,
                ""
            );

            numberToCreator[newTokenId] = Creator(
                payable(msg.sender),
                "",
                0,
                newTokenId,
                0,
                ""
            );


        }
      

        _setTokenURI(newTokenId, _tokenUri);

        setProfile(newTokenId);

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

    function sendLike(address creatorAddress) external returns(uint){
        require(msg.sender !=creatorAddress, "cannot like your own profile");
        require(hasLikeProfile[msg.sender][creatorAddress] == false, "already liked artist");

        hasLikeProfile[msg.sender][creatorAddress] = true;
        
        Creator storage creator = creatorsProfile[creatorAddress];

        usersLikedList[msg.sender].push(creator);


        return creator.numOfLikes++;
    }

    function setUsername(address creatorAddress, string memory _username) external returns(string memory){
        require(msg.sender ==creatorAddress, "cannot like your own profile");
        // require(_username.length <= 15, "username is too long");

        Creator storage creator = creatorsProfile[msg.sender];

        return creator.username = _username;
        
    }

    // uses the users address array and i iterator as the key in the creators profile to map through address=>struct mapping
    
    function returnAllProfiles() external view returns(Creator[] memory){
        uint iterateCount = users.length;
        Creator[] memory allCreators = new Creator[](iterateCount);
        for(uint i = 0; i < iterateCount; i++){
            allCreators[i] = creatorsProfile[users[i]];
        }
        return(allCreators);
    }

    function returnLikedCreatorsList() external view returns(Creator[] memory){
        uint iterateCount = usersLikedList[msg.sender].length;
        Creator[] memory likedCreators = new Creator[](iterateCount);
         for(uint i = 0; i < iterateCount; i++){
            likedCreators[i] = usersLikedList[msg.sender][i];
        }
        return(likedCreators);

    }

}
