// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DefiBeats is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint public tokenCount;

    uint public transactionFee = 1;
    uint public royaltyFee = 1;
    address payable public feeAccount;
    address public admin;

    mapping(uint=>address) public ownerOfNft; // mapping of original minters

    mapping(uint=>Song) public songs;

    Song[] public marketSongs;

    struct Song{
        uint tokenId;
        address payable currentOwner;
        string tokenUri;
        uint price;
        bool isForSale;
        address payable originalProducer;
    }

    event SongMade(uint indexed tokenId, address producer, string tokenUri);

    event SongListed(uint indexed tokenId, address seller, string tokenUri);

    event SongPurchased(uint indexed tokenId, address seller, string tokenUri, uint price);

    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }

    constructor() ERC721("DefiBeats", "DFB"){
        feeAccount = payable(msg.sender);
        admin = msg.sender;

    }

    // make song / mint function
    function makeSong(string memory _tokenUri) external payable returns(uint){
        _tokenIds.increment();
        tokenCount++;

        uint newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        
        ownerOfNft[newTokenId] = msg.sender;
        _setTokenURI(newTokenId, _tokenUri);

        setApprovalForAll(address(this), true);

        songs[newTokenId] = Song(
            newTokenId,
            payable(msg.sender),
            _tokenUri,
            0,
            false,
            payable(msg.sender)
        );

        emit SongMade(newTokenId, msg.sender, _tokenUri);

        return newTokenId;

    }

    // song number is tokenId
    function listSong(uint songNumber, uint songPrice) external {
        require(msg.sender == songs[songNumber].currentOwner, "cannot list songs you do not own");

        Song memory song = songs[songNumber];
        address ogProducer = song.originalProducer;

        song.currentOwner = payable(msg.sender);
        song.isForSale = true;
        song.price = songPrice;

        // transfer nft from owner to contract
        transferFrom(msg.sender, address(this), song.tokenId);

        marketSongs.push(Song(
            songNumber,
            payable(msg.sender),
            song.tokenUri,
            songPrice,
            true,
            payable(ogProducer)
        ));

        emit SongListed(song.tokenId , msg.sender, song.tokenUri);

    }

    function buySong(uint songNumber) external payable {
        Song memory song = songs[songNumber];
        uint totalPrice = song.price + transactionFee + transactionFee;
        require(msg.value >= totalPrice, "Please pay the required amount");

        uint transactionFees = transactionFee + royaltyFee;
        uint amountToTransfer = msg.value - transactionFees;

        // transfer payment
        song.currentOwner.transfer(amountToTransfer);
        song.originalProducer.transfer(royaltyFee); 
        feeAccount.transfer(transactionFee);

        // transfer nft
        _transfer(address(this), msg.sender, song.tokenId);

        // update song mapping and struct
        song.currentOwner = payable(msg.sender);
        song.isForSale = false;

        emit SongPurchased(song.tokenId , msg.sender, song.tokenUri, msg.value);   

    }

    function cancelListing(uint songNumber) public {
        Song memory song = songs[songNumber];
        require(msg.sender == song.currentOwner, "Only current owner can cancel listing");

        _transfer(address(this), msg.sender, song.tokenId);

        song.isForSale = false;
        song.price = 0;
    }



    // update contract functions
    function updateFee(uint _newFeeAmount) public onlyAdmin returns(uint) {
        return transactionFee = _newFeeAmount;
    }

    function updateRoyaltyFee(uint _newFeeAmount) public onlyAdmin returns(uint){
        return royaltyFee = _newFeeAmount;
    }
    
    function changeAdmin(address newAdmin) public onlyAdmin returns(address){
        return admin = newAdmin;
    }

    function changeFeeAccount(address newFeeAddress) public onlyAdmin returns(address){
        return feeAccount = payable(newFeeAddress);
    }


    
}