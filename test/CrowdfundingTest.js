const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const toWeiStr = (num) => ethers.utils.parseEther(num.toString())
const toWeiInt = (num) => ethers.utils.parseEther(num) 
const fromWei = (num) => ethers.utils.formatEther(num)

const nullAddress = "0x0000000000000000000000000000000000000000"

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
        CrowdfundContract = await crowdfundcontractFactory.deploy(artist.address, 100, 0, "dopest on the block", EscrowContract.address)
        await CrowdfundContract.deployed()
        
        // console.log(`Crowdfund Contract deployed ${CrowdfundContract.address}`)

        await EscrowContract.connect(deployer).setCrowdfundContract(CrowdfundContract.address)



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
    describe("invest functions", () =>{
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
            expect(await ethers.provider.getBalance(EscrowContract.address)).to.equal("100000000000000000")
        })
        it("checks for repeat investments", async () =>{
            await CrowdfundContract.connect(user1).invest({value: "100000000000000000"})
            expect(await CrowdfundContract.investors(user1.address)).to.equal("200000000000000000")
            expect(await ethers.provider.getBalance(EscrowContract.address)).to.equal("200000000000000000")
            
        })
        it("checks others can invest", async () =>{
            await CrowdfundContract.connect(user2).invest({value: "100000000000000000"})
            expect(await CrowdfundContract.investors(user2.address)).to.equal("100000000000000000")
            expect(await CrowdfundContract.allInvestors(1)).to.equal(user2.address)
            expect(await ethers.provider.getBalance(EscrowContract.address)).to.equal("200000000000000000")

        })
        describe("cancel and refund functions", () =>{
            beforeEach(async () =>{
                await CrowdfundContract.connect(user2).invest({value: "100000000000000000"})
                await CrowdfundContract.connect(user3).invest({value: "100000000000000000"})
                await CrowdfundContract.connect(user4).invest({value: "100000000000000000"})
            })
            it("checks the refund function returns money", async () =>{
                await CrowdfundContract.connect(user2).cancelInvestment()
                expect(await ethers.provider.getBalance(EscrowContract.address)).to.equal("300000000000000000")
            })
            it("checks the address was removed from allInvestors", async () =>{
                await CrowdfundContract.connect(user2).cancelInvestment()
                

                expect(await CrowdfundContract.allInvestors(1)).to.equal(nullAddress)
            })
            it("checks if invested twice, both instances refunded and removed", async ()=>{
                await CrowdfundContract.connect(user2).invest({value: "100000000000000000"})
                await CrowdfundContract.connect(user2).cancelInvestment()
                expect(await CrowdfundContract.allInvestors(1)).to.equal(nullAddress)
                expect(await CrowdfundContract.allInvestors(4)).to.equal(nullAddress)
                

            })
            it("checks the cancel function pays back all users", async () =>{
                let initialBalance2 = await ethers.provider.getBalance(user2.address)
                // eslint-disable-next-line no-undef
                initialBalance2 = BigInt(initialBalance2);
                let initialBalance3 = await ethers.provider.getBalance(user3.address)
                initialBalance3 = BigInt(initialBalance3);

                let initialBalance4 = await ethers.provider.getBalance(user4.address)
                initialBalance4 = BigInt(initialBalance4);


                await CrowdfundContract.connect(deployer).cancelCrowdfund();
                expect(await ethers.provider.getBalance(EscrowContract.address)).to.equal(0)
                // eslint-disable-next-line no-undef
                expect(await ethers.provider.getBalance(user2.address) ).to.equal(initialBalance2 + BigInt(100000000000000000))
                expect(await ethers.provider.getBalance(user3.address) ).to.equal(initialBalance3 + BigInt(100000000000000000))
                expect(await ethers.provider.getBalance(user4.address) ).to.equal(initialBalance4 + BigInt(100000000000000000))
                expect(await ethers.provider.getBalance(CrowdfundContract.address)).to.equal(0)
            })
        })
        describe("complete crowdfund", async () =>{
            beforeEach(async() =>{
                await CrowdfundContract.connect(user2).invest({value: "100000000000000000"})
                await CrowdfundContract.connect(user3).invest({value: "100000000000000000"})
                await CrowdfundContract.connect(user4).invest({value: "100000000000000000"})
            })
            it("checks the complete function", async () =>{
                await CrowdfundContract.connect(deployer).completeCrowdfund()
                expect(await ethers.provider.getBalance(artist.address)).to.equal("10000400000000000000000")
            })
            
        })
    })
})