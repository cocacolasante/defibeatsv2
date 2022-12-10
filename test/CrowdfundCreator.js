const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

const nullAddress = "0x0000000000000000000000000000000000000000"

describe("Crowdfund Creator", () =>{
    let CrowdfundCreatorContract, deployer, user1, user2, user3
    beforeEach(async () =>{
        const accounts = await ethers.getSigners();
        deployer = accounts[0]
        user1= accounts[1]
        user2 = accounts[2]
        user3 = accounts[3]

        const crowdfundCreatorFactory = await ethers.getContractFactory("CrowdfundCreator")
        CrowdfundCreatorContract = await crowdfundCreatorFactory.deploy();
        await CrowdfundCreatorContract.deployed()

        console.log(`Crowdfund Creator deployed to ${CrowdfundCreatorContract.address}`);


    })
    it("checks the admin", async () =>{
        expect(await CrowdfundCreatorContract.returnOwner())
    })
})
