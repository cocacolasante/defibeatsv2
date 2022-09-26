import { Alchemy, Network } from "alchemy-sdk";
import SongListing from './SongListing'
import env from "react-dotenv";
import { ethers } from "ethers";
import { DEFIBEATS_ADDRESS } from "../config";
import { useEffect } from "react";


const RecentUploads = () => {

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
      console.log(JSON.stringify(allNftSongs, null, 2));

  }

  useEffect(()=>{
    fetchRecentMints();
  }, [])

  return (
    <div className='recent-upload-container'>
        <h2>Recent Uploads</h2>
        <div className='recent-upload-card-container'>
           

        </div>
    </div>
  )
}

export default RecentUploads