const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

const nullAddress = "0x0000000000000000000000000000000000000000"

describe("Crowdfund NFT Contract", () =>{
    let NFTContract, deployer, user1, user2, user3
    beforeEach(async () =>{
        const accounts = await ethers.getSigners()

        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]

        const nftContractFactory = await ethers.getContractFactory("CrowdfundNFT")
        NFTContract = await nftContractFactory.deploy("DMX", "SAMPLEBASEURI")
        await NFTContract.deployed()

        // console.log(`NFT contract address: ${NFTContract.address} Deployer: ${await NFTContract.returnAdmin()}`)
    })
    it("checks the admin", async () =>{
        expect(await NFTContract.returnAdmin()).to.equal(deployer.address)
    })
    it("checks the base uri", async () =>{
        expect(await NFTContract.returnBaseURI()).to.equal("SAMPLEBASEURI")
    })
    it("checks the token acount", async () =>{
        expect(await NFTContract.returnCurrentToken()).to.equal(0)
    })
    describe("Describes the mint function", () =>{
        beforeEach(async () =>{
            await NFTContract.connect(deployer).mint(user1.address)

        })
        it("checks the token count", async () =>{
            expect(await NFTContract.returnCurrentToken()).to.equal(1)
        })
        it("checks the token uri", async () =>{
            expect(await NFTContract.tokenURI(1)).to.equal("SAMPLEBASEURI1.json")
        })
        it("checks the owner of nft 1", async () =>{
            expect(await NFTContract.ownerOf(1)).to.equal(user1.address)
        })
    })
})