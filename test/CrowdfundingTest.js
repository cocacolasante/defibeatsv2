const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

describe("CrowdfundAlbum", () =>{
    let CrowdfundContract, EscrowContract, deployer, user1, user2, user3, user4, artist
    beforeEach(async () =>{
        const accounts = await ethers.getSigners()

        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        user4 = accounts[4]
        artist = accounts[5]

        const escrowContractFactory = await ethers.getContractFactory("Escrow")
        EscrowContract = await escrowContractFactory.deploy()
        await EscrowContract.deployed()

        // console.log(`Escrow deployed at ${EscrowContract.address}`)


        const crowdfundcontractFactory = await ethers.getContractFactory("CrowdfundContract")
        CrowdfundContract = await crowdfundcontractFactory.deploy(artist.address, 100, 849000, "dopest on the block", EscrowContract.address)
        await CrowdfundContract.deployed()
        
        // console.log(`Crowdfund Contract deployed ${CrowdfundContract.address}`)



    })
    describe("getter functions in crowdfund and escrow", () =>{
        it("checks the admin of the crowd funding contract", async () =>{
            expect(await EscrowContract.returnAdmin()).to.equal(deployer.address)
            expect(await CrowdfundContract.returnCrowdfundAdmin()).to.equal(deployer.address)
        })
        it("checks the artist address", async () =>{
            expect(await CrowdfundContract.returnArtistAddress()).to.equal(artist.address)
        })
        it("checks the escrow contract address", async () =>{
            expect(await CrowdfundContract.returnEscrowContract()).to.equal(EscrowContract.address)
        })

    })
    describe("donate functions", () =>{
        beforeEach(async () =>{
            await CrowdfundContract.connect(user1).invest({value: "100000000000000000"})
        })
        it("checks the investment was tracked in the mapping", async () =>{
            expect(await CrowdfundContract.investors(user1.address)).to.equal("100000000000000000")
        })
        it("checks the investors address was added to array", async () =>{
            expect(await CrowdfundContract.allInvestors(0)).to.equal(user1.address)
        })
        it("checks the escrow received the funds", async () =>{
            
        })
    })
})