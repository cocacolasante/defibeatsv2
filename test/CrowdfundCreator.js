const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

const nullAddress = "0x0000000000000000000000000000000000000000"

describe("Crowdfund Creator", () =>{
    let CrowdfundCreatorContract, deployer, user1, user2, user3, artist
    beforeEach(async () =>{
        const accounts = await ethers.getSigners();
        deployer = accounts[0]
        user1= accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]
        artist = accounts[4]

        const crowdfundCreatorFactory = await ethers.getContractFactory("CrowdfundCreator")
        CrowdfundCreatorContract = await crowdfundCreatorFactory.deploy();
        await CrowdfundCreatorContract.deployed()

        // console.log(`Crowdfund Creator deployed to ${CrowdfundCreatorContract.address}`);


    })
    it("checks the admin", async () =>{
        expect(await CrowdfundCreatorContract.owner())
    })
    it("checks the project id", async () =>{
        expect(await CrowdfundCreatorContract.projectID()).to.equal(0)
    })


    describe('Describes the Create Project functions', async () =>{
        let projectStruct, CrowdfundProjectContract, EscrowContract
        beforeEach(async () =>{
            await CrowdfundCreatorContract.createCrowdfund(artist.address, 100000, 1, "testalbum", "testBaseUri")

            projectStruct = await CrowdfundCreatorContract.projects(1)

            CrowdfundProjectContract = projectStruct.crowdfundContract()

            EscrowContract = await CrowdfundProjectContract.returnEscrowContract();
        })
        it("checks the escrow contract was created", async () =>{
            expect(EscrowContract.address).to.not.equal(nullAddress)
        })
        
    })
})
