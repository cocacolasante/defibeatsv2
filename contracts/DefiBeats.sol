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

    // featured song token id
    Song public featuredSong;

    uint public mintFee = 1;

    mapping(uint=>address) public ownerOfNft; // mapping of original minters

    mapping(uint=>Song) public songs;

    Song[] public allSongs;

    struct Song{
        uint tokenId;
        string name;
        string collection;
        address payable currentOwner;
        string tokenUri;
        uint price;
        bool isForSale;
        address payable originalProducer;
    }

    event SongMade(uint indexed tokenId, address indexed producer, string tokenUri);

    event SongListed(uint indexed tokenId, address seller, string tokenUri);

    event SongCancelled(uint indexed tokenId, address seller, string tokenUri);

    event SongPurchased(uint indexed tokenId, address seller, string tokenUri, uint indexed price);

    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }

    constructor() ERC721("DefiBeats", "DFB"){
        feeAccount = payable(msg.sender);
        admin = msg.sender;

    }

    // make song / mint function
    function makeSong(string memory _tokenUri, string memory songName, string memory collection) external payable returns(uint){
        require(msg.value >= mintFee, "Please pay the minting fee");

        // transfer minting fee
        feeAccount.transfer(msg.value);

        _tokenIds.increment();
        tokenCount++;

        uint newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        
        ownerOfNft[newTokenId] = msg.sender;
        _setTokenURI(newTokenId, _tokenUri);

        

        songs[newTokenId] = Song(
            newTokenId,
            songName,
            collection,
            payable(msg.sender),
            _tokenUri,
            0,
            false,
            payable(msg.sender)
        );
        allSongs.push(Song(
            newTokenId,
            songName,
            collection,
            payable(msg.sender),
            _tokenUri,
            0,
            false,
            payable(msg.sender)
        ));

        emit SongMade(newTokenId, msg.sender, _tokenUri);

        return newTokenId;

    }

    // song number is tokenId
    function listSong(uint songNumber, uint songPrice) external{
        require(msg.sender == ownerOf(songNumber), "cannot list songs you do not own");

        // updating mapping
        Song storage song = songs[songNumber];

        song.isForSale = true;
        song.price = songPrice;
        song.currentOwner = payable(msg.sender);

        
        setApprovalForAll(address(this), true);

        // transfer nft from owner to contract
        transferFrom(msg.sender, address(this), song.tokenId);

        
        emit SongListed(song.tokenId , msg.sender, song.tokenUri);

       

    }

    function buySong(uint songNumber) external payable {
        Song storage song = songs[songNumber];
        uint totalPrice = song.price + transactionFee + transactionFee;
        require(msg.value >= totalPrice, "Please pay the required amount");

        uint transactionFees = transactionFee + royaltyFee;
        uint amountToTransfer = msg.value - transactionFees;

        // transfer payment
        
        song.originalProducer.transfer(royaltyFee); 
        feeAccount.transfer(transactionFee);
        song.currentOwner.transfer(amountToTransfer);

        // transfer nft
        _transfer(address(this), msg.sender, song.tokenId);

        // update song mapping and struct
        song.currentOwner = payable(msg.sender);
        song.isForSale = false;


        emit SongPurchased(song.tokenId , msg.sender, song.tokenUri, msg.value);   

    }

    function cancelListing(uint songNumber) public {
        Song storage song = songs[songNumber];
        require(msg.sender == song.currentOwner, "Only current owner can cancel listing");

        _transfer(address(this), msg.sender, song.tokenId);

        song.isForSale = false;
        song.price = 0;

        emit SongCancelled(song.tokenId , msg.sender, song.tokenUri);
    }

    function updateListingPrice(uint songNumber, uint newPrice) public {
        Song storage song = songs[songNumber];
        require(msg.sender == song.currentOwner, "Only current owner can cancel listing");

        song.price = newPrice;

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

    function setMintFeeAmount(uint newMintFee) public onlyAdmin returns(uint){
        return mintFee = newMintFee;
    }

    function returnAllSongs() external view returns(Song[] memory){
        uint iterateCount = _tokenIds.current() + 1;
        Song[] memory _allSongs = new Song[](iterateCount);
        for(uint i = 0; i < iterateCount; i++){
            _allSongs[i] = songs[i];
        }
        return _allSongs;
    }

    function returnAllSongsForSale() external view returns(Song[] memory){
        uint iterateCount = _tokenIds.current() + 1;
        Song[] memory _allSongs = new Song[](iterateCount);
        uint counterIndex;
        for(uint i = 0; i < iterateCount; i++){
            if(songs[i].isForSale != false){
                _allSongs[counterIndex] = songs[i];
                counterIndex++;
            }
            
        }
        return (_allSongs);
    }

    function setFavoriteSong(uint songNumber) external onlyAdmin returns(Song memory) {
        Song storage song = songs[songNumber];
        return featuredSong = song;
    }
    
  
}
