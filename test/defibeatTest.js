const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

describe("Defi Beats V2", () =>{
  let DefiBeats, deployer, user1, user2, user3
  const SAMPLE_URI = "SAMPLEURI"
  const SAMPLE_URI2 = "SAMPLEURI2"


  beforeEach(async () =>{
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    user1 = accounts[1]
    user2 = accounts[2]  
    user3 = accounts[3]
    
    
    const contractFactory = await ethers.getContractFactory("DefiBeats")
    DefiBeats = await contractFactory.deploy()
    await DefiBeats.deployed();
 


    await DefiBeats.connect(user1).makeSong(SAMPLE_URI, "testnamebeat", "testcollectionname")
    await DefiBeats.connect(user1).listSong(1, 10)
    

  })
  it("checks the contract was deployed and the name", async () => {
    expect(await DefiBeats.name()).to.equal("DefiBeats")
  })
  it("checks the fee account is the deployer", async () => {
    expect(await DefiBeats.feeAccount()).to.equal(deployer.address)
  })
  it("checks the mint function", async()=>{
    expect(await DefiBeats.ownerOfNft(1)).to.equal(user1.address)
  })
  // it("checks the transfer nft function", async () => {
  //   await DefiBeats.connect(user1).transferFrom(user1.address, user2.address, 1);

  //   expect(await DefiBeats.ownerOf(1)).to.equal(user2.address)
  // })
  it("checks the listing function and event", async () => {
    expect(await DefiBeats.ownerOf(1)).to.equal(DefiBeats.address).to.emit(DefiBeats, "SongListed")
  })
  it("checks the buy function nft transfer", async() =>{
    await DefiBeats.connect(user2).buySong(1, {value: "15"});
    expect(await DefiBeats.ownerOf(1)).to.equal(user2.address);
  })
  it("checks the msg value was transferred to seller", async () => {
    let intialBalance = await ethers.provider.getBalance(user1.address);
    
    intialBalance = BigInt(intialBalance)

    await DefiBeats.connect(user2).buySong(1, {value: "15"});

    // console.log(await ethers.provider.getBalance(user1.address))
    expect(await ethers.provider.getBalance(user1.address)).to.equal(intialBalance + BigInt(14))

  })
  it("checks the transaction fee was sent to fee account", async () => {
    let intialBalance = await ethers.provider.getBalance(deployer.address)
    intialBalance = BigInt(intialBalance)
    await DefiBeats.connect(user2).buySong(1, {value: "15"});
    expect(await ethers.provider.getBalance(deployer.address)).to.equal(intialBalance + BigInt(1))
  })
  it("checks the cancel listing event is emitted", async () => {
    expect(await DefiBeats.connect(user1).cancelListing(1)).to.emit(DefiBeats, "SongCancelled")
  })
  it("checks the nft is transferred from market to owner after cancelled listing", async () =>{
    await DefiBeats.connect(user1).cancelListing(1)
    expect(await DefiBeats.ownerOf(1)).to.equal(user1.address)

  })

  describe("buy and list functions and money transfers", () =>{

    beforeEach(async()=>{
      await DefiBeats.connect(user2).buySong(1, {value: "15"});
      
      await DefiBeats.connect(user2).listSong(1, 15)


    })
    it("checks the items current owner was updated", async () => {
      const song = await DefiBeats.songs(1);
      expect(song.currentOwner).to.equal(user2.address)
    })
    it("checks that the new owner can list the song", async () =>{

      expect(await DefiBeats.ownerOf(1)).to.equal(DefiBeats.address)
    })
    it("checks the new owner gets paid", async () =>{
      let initialBalance = await ethers.provider.getBalance(user2.address)
      initialBalance = BigInt(initialBalance)

      await DefiBeats.connect(user3).buySong(1, {value: "17"})

      expect(await ethers.provider.getBalance(user2.address)).to.equal(initialBalance + BigInt(15))
    })
    it("checks the original producer gets paid", async () =>{
      let initialBalance = await ethers.provider.getBalance(user1.address)

      initialBalance = BigInt(initialBalance)
      
      await DefiBeats.connect(user3).buySong(1, {value: "17"})

      expect(await ethers.provider.getBalance(user1.address)).to.equal(initialBalance + BigInt(1))
    })
  })
  describe("update listing functions", ()=>{

    beforeEach(async () => {
      await DefiBeats.connect(user1).makeSong(SAMPLE_URI, "user1 song", "user1 collection")
      await DefiBeats.connect(user1).listSong(2, 100)

      await DefiBeats.connect(user2).buySong(2, {value: "102"})
    })
    it("checks the updating price function", async () =>{
      await DefiBeats.connect(user1).updateListingPrice(1, 20)

      const song = await DefiBeats.songs(1)

      expect(song.price).to.equal(20)
    })
    it("checks the fee was updated", async () =>{
      await DefiBeats.connect(deployer).updateFee(5)

      expect(await DefiBeats.transactionFee()).to.equal(5)
    })
    it("checks the royalty fee was updated", async () => {
      await DefiBeats.connect(deployer).updateRoyaltyFee(10)

      expect(await DefiBeats.royaltyFee()).to.equal(10)
    })
    it("checks the change fee account", async ()=>{
      await DefiBeats.connect(deployer).changeFeeAccount(user2.address)

      expect(await DefiBeats.feeAccount()).to.equal(user2.address)
    })

  })
  describe("Profile NFT contract", () => {
    let ProfileNFT
    beforeEach(async () =>{
      const profileFactory = await ethers.getContractFactory("ProfileNFT")
      ProfileNFT = await profileFactory.deploy()
      await ProfileNFT.deployed()
    })
    describe("deployment ", () => {
      it("checks the name and symbol", async () => {
        expect(await ProfileNFT.name()).to.equal("DefiBeats Profile")
        expect(await ProfileNFT.symbol()).to.equal("DFBP")
      })
    })
    describe("mint functions", () => {
      beforeEach(async () =>{
        await ProfileNFT.connect(user1).mint(SAMPLE_URI)
      })
      it("checks the mint function token count", async () =>{
        expect(await ProfileNFT.tokenCount()).to.equal(1)
      })
      it("checks the owner of mint", async () => {
        expect(await ProfileNFT.ownerOf(1)).to.equal(user1.address)
      })
      it("checks token uri", async () => {
        expect(await ProfileNFT.tokenURI(1)).to.equal(SAMPLE_URI)
      })
      it("checks the creators address added to profile", async () => {
        const creator = await ProfileNFT.creatorsProfile(user1.address)
        expect(creator.creatorAddress).to.equal(user1.address)
      })
      it("checks the profile message as blank", async () => {
        const creator = await ProfileNFT.creatorsProfile(user1.address)
        expect(creator.message).to.equal(undefined)
      })
      it("checks the tip amount as zero", async () => {
        const creator = await ProfileNFT.creatorsProfile(user1.address)
        expect(creator.tipsReceived).to.equal(0)
      })
      it("checks the profile nft was set", async () => {
        const creator = await ProfileNFT.creatorsProfile(user1.address)
        expect(creator.profileToken).to.equal(1)
      })
    })
    describe("burn function", async () =>{
      beforeEach(async () =>{
        await ProfileNFT.connect(user1).mint(SAMPLE_URI)
        await ProfileNFT.connect(user1).burn(1)
        
      })
      it("checks the address is zero", async () =>{
        // assert(await ProfileNFT.ownerOf(1))
      })
    })
    describe("helper functions", async () =>{
      beforeEach(async () =>{
        await ProfileNFT.connect(user1).mint(SAMPLE_URI)

      })
      it("checks the message was set", async () =>{
        await ProfileNFT.connect(user1).setMessage(user1.address, "test message")

        const profile = await ProfileNFT.creatorsProfile(user1.address);

        expect(profile.profileMessage).to.equal("test message")
        
      })
      it("checks the tip artist function", async () => {
        let initialBalance = await ethers.provider.getBalance(user1.address)
        initialBalance = BigInt(initialBalance)

        await ProfileNFT.connect(user2).tipCreator(user1.address, {value: "1"})
        expect(await ethers.provider.getBalance(user1.address)).to.equal(initialBalance + BigInt(1))

      })
      it("checks the tips are counted/accumulated in the struct", async () => {
        
        await ProfileNFT.connect(user2).tipCreator(user1.address, {value: "1"})
        await ProfileNFT.connect(user2).tipCreator(user1.address, {value: "1"})
        await ProfileNFT.connect(user2).tipCreator(user1.address, {value: "1"})
        const profile = await ProfileNFT.creatorsProfile(user1.address);

        expect(profile.tipsReceived).to.equal(3)

      })
      it("checks the set profile nft", async () => {
        // set profile to token 1
        await ProfileNFT.connect(user1).mint(SAMPLE_URI2);
        await ProfileNFT.connect(user1).setProfile(1);
        let profile = await ProfileNFT.creatorsProfile(user1.address)
        expect(profile.profileToken).to.equal(1)

        // reset profile to token 2
        await ProfileNFT.connect(user1).setProfile(2);
        profile = await ProfileNFT.creatorsProfile(user1.address)
        expect(profile.profileToken).to.equal(2)
      })
      it("checks the send like function", async () =>{
        await ProfileNFT.connect(user2).sendLike(user1.address)
        let profile = await ProfileNFT.creatorsProfile(user1.address)

        expect(await profile.numOfLikes).to.equal(1)
      })
    })
  })
})

