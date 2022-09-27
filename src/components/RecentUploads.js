import { Alchemy, Network } from "alchemy-sdk";
import env from "react-dotenv";
import { ethers } from "ethers";
import { DEFIBEATS_ADDRESS } from "../config";
import { useEffect, useState } from "react";
import defibeatsAbi from "../assets/defibeats.json"
import profileNftAbi from "../assets/profilenft.json"
import {PROFILENFT_ADDRESS} from "../config"



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

         
          const songsMetaMapping = await Promise.all(allSongs.map(async (i)=>{
            let output = []
    
            output.push(i[0].toString()) // token id
            output.push(i[1]) // name
            output.push(i[2]) // collection name
            output.push(i[3]) // current owner
            output.push(i[4]) // token uri
            output.push(i[5].toString()) // price
            output.push(i[6]) // is for sale
            output.push(i[7]) // original producer
            output.push(await _getOriginalProducer(i[7])) // og producer image
            return output
          }))

          setSongMeta(songsMetaMapping)

          console.log(songsMetaMapping)
          
      }

      }catch(error){
          console.log(error)
      }
  }

  const getSongFromIPFS = async (_tokenUri) =>{ // use i[4] in the mapping
    const response = await fetch(_tokenUri)
    const jsonResponse = await response.json()
    console.log(jsonResponse)

  }

  const _getOriginalProducer = async (ogProducersAddress) =>{

    let ogProdIm

    const {ethereum} = window;

    const provider = new ethers.providers.Web3Provider(ethereum)
    
    const ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)

    // get orginal producers profile from nft profile contract
    let originalProducerProfile = await ProfileNFTContract.creatorsProfile(ogProducersAddress)
    
    // get current token id
    const ogProdUri = originalProducerProfile[3].toString()

    // get current token uri
    const userTokenPicURI = await ProfileNFTContract.tokenURI(ogProdUri)
    let response = await fetch(userTokenPicURI)
    const jsonResponse = await response.json()

    // parse json data for image uri
    ogProdIm = jsonResponse["image"]

    console.log(ogProdIm)
    
    //return image uri for img src link
    return (ogProdIm)



  }

  useEffect(()=>{
    getSongData();
    
  }, [])

  return (
    <div id="content-wrapper">
        <h2>Recent Uploads</h2>
        <div className='recent-upload-card-container'>
           
           {!songMeta ? 
                (<p>loading</p>) 
                : 
                songMeta.map((i)=>{
                return(
                    <div className="song-card-mapping" key={i[0]}>
                        <h3>Name: {i[1]} </h3>
                        <img className="song-producer-image" src={i[8]} />                  
                            
                        <p>Original Producer: {i[7].slice(0, 6)}...{i[7].slice(-6)}</p>
                        <div>
                          <h5>Collection Name: {i[2]} </h5>
                          
                        </div>
                        
                        <div className="play-btn-container">
                        <button className="play-buy-btn">Play</button>
                        {i[6] ? <button className="play-buy-btn" >buy</button> : <button className="play-buy-btn" >not for sale</button>}
                        </div>
                  </div>
                )
           }) }
           
        </div>
    </div>
  )
}

export default RecentUploads