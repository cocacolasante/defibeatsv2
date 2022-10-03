
const { ethers } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config()

const DEFIBEATS_ADDRESS = "0x13C4ae82Ad0AF06Cb0967F18EcFA32CCc548A549"

async function main() {
  const DefiBeats = await ethers.getContractAt("DefiBeats", DEFIBEATS_ADDRESS)
  console.log(`DefiBeats fetched at ${DefiBeats.address}`)

  let txn = await DefiBeats.connect(process.env.PUBLIC_KEY_DEPLOYER).setFeaturedSong(1)
  await txn.wait()

  let featSong = await DefiBeats.featuredSong()

  console.log(`Featured song is ${featSong}`)



}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});