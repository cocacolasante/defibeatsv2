const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

describe("Defi Beats V2", () =>{
  let DefiBeats, deployer, user1, user2
  const SAMPLE_URI = "SAMPLEURI"


  beforeEach(async () =>{
    const accounts = await ethers.getSigners()
    deployer = accounts[0]
    user1 = accounts[1]
    user2 = accounts[2]  
    
    const contractFactory = await ethers.getContractFactory("DefiBeats")
    DefiBeats = await contractFactory.deploy()
    await DefiBeats.deployed();
 


    await DefiBeats.connect(user1).makeSong(SAMPLE_URI, "test1", "test2")
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
})