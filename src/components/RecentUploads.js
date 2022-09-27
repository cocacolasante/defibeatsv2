import { Alchemy, Network } from "alchemy-sdk";
import SongListing from './SongListing'
import env from "react-dotenv";
import { ethers } from "ethers";
import { DEFIBEATS_ADDRESS } from "../config";
import { useEffect, useState } from "react";
import defibeatsAbi from "../assets/defibeats.json"


const RecentUploads = () => {

  const [recentSongs, setRecentSongs] = useState()
  const [songMeta, setSongMeta] = useState([])

    const fetchRecentMints = async () => {
        const config = {
          apiKey: env.REACT_APP_ALCHEMY_API_KEY,
          network: Network.MATIC_MUMBAI,
      };

      const omitMetadata = false;

      const alchemy = new Alchemy(config);
      const allNftSongs = await alchemy.nft.getNftsForContract(DEFIBEATS_ADDRESS, {
          omitMetadata: omitMetadata,
      });
      setRecentSongs(allNftSongs)
      console.log(JSON.stringify(allNftSongs, null, 2));

  }

  const getSongData = async () => {
    try {
      const {ethereum} = window;
      if(ethereum){
          const provider = new ethers.providers.Web3Provider(ethereum)
          
          const DefiBeatsContract = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, provider)
          

          const allSongs = await DefiBeatsContract.returnAllSongs()
          // console.log(allSongs)

          const songsMetaMapping = allSongs.map((i)=>{
            let output = []
            output.push(i[0].toString()) // token id
            output.push(i[1]) // name
            output.push(i[2]) // collection name
            output.push(i[3]) // current owner
            output.push(i[4]) // token uri
            output.push(i[5].toString()) // price
            output.push(i[6]) // is for sale
            output.push(i[7]) // original producer
            return output
          })

          setSongMeta(songsMetaMapping)

          // const userTokenPicURI = await ProfileNFTContract.tokenURI(userTokenPicId)
          // let response = await fetch(userTokenPicURI)
          // const jsonResponse = await response.json()
          
          // const userTokenImage = jsonResponse["image"]

          // load current profile picture from blockchain
         
          
      }

  }catch(error){
      console.log(error)
  }

  }

  useEffect(()=>{
    getSongData();
    
  }, [])

  return (
    <div className='recent-upload-container'>
        <h2>Recent Uploads</h2>
        <div className='recent-upload-card-container'>
           
           {!songMeta ? <p>loading</p> : songMeta.map((i)=>{
                return(
              <div key={i}>
              <h3>{i[1]} </h3>
              <img />
              <div>
                <h5>{i[2]} </h5>
                <p>Descriptions</p>
              </div>
              <div>
              <button>Buy</button>
              <button>Play</button>
              </div>
            </div>
            )
           }) }
           
            

        </div>
    </div>
  )
}

export default RecentUploads