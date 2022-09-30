import { ethers } from "ethers";
import { DEFIBEATS_ADDRESS } from "../config";
import { useEffect, useState } from "react";
import defibeatsAbi from "../assets/defibeats.json"
import profileNftAbi from "../assets/profilenft.json"
import {PROFILENFT_ADDRESS} from "../config"
import { useSelector } from "react-redux";



const RecentUploads = () => {
  
  const account = useSelector(state=>state.provider.account)
  const [recentSongs, setRecentSongs] = useState()


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
            
            
            if(i[6]){
                output.push(i[0].toString()) // token id
                output.push(i[1]) // name
                output.push(i[2]) // collection name
                output.push(i[3]) // current owner
                output.push(i[4]) // token uri
                output.push(i[5].toString()) // price
                output.push(i[6]) // is for sale
                output.push(i[7]) // original producer
                output.push(await _getOriginalProducer(i[7])) // og producer image
                
            } 
            
            return output
          }))
            songsMetaMapping.reverse()
          setRecentSongs(songsMetaMapping)
         
      }

      }catch(error){
          console.log(error)
      }
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
           
           {!recentSongs ? 
                (<p>loading</p>) 
                : 
                recentSongs.map((i)=>{
                   if(i[0]){
                    return(
                    <div className="song-card-mapping" key={i[0]}> {console.log(recentSongs)}
                        <h3>Name: {i[1]} </h3>
                        <img className="song-producer-image" src={i[8]} />                  
                            
                        <p>Original Producer: {i[7].slice(0, 6)}...{i[7].slice(-6)}</p>
                        <div>
                          <h5>Collection Name: {i[2]} </h5>
                        </div>
                        
                        <div className="play-btn-container"> 
                        <button className="play-buy-btn">Play</button>
                        <button>Buy</button>
                        </div>
                  </div>
                )
                   }
                
           }) }
           
        </div>
    </div>
  )
}

export default RecentUploads