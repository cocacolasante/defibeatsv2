
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const defibeatsFactory = await hre.ethers.getContractFactory("DefiBeats")
  const DefiBeats = await defibeatsFactory.deploy()
  await DefiBeats.deployed()

  const deployer = await DefiBeats.admin()
  const feeAccount = await DefiBeats.feeAccount()

  console.log(`DefiBeats deployed to ${DefiBeats.address}, Fee Account ${feeAccount}, deployer ${deployer}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
