import { ethers } from "ethers";
import { DEFIBEATS_ADDRESS } from "../config";
import { useEffect, useState } from "react";
import defibeatsAbi from "../assets/defibeats.json"
import profileNftAbi from "../assets/profilenft.json"
import {PROFILENFT_ADDRESS} from "../config"
import { Link } from "react-router-dom"

function FeaturedSong() {

  const toWei = (num) => ethers.utils.parseEther(num.toString())
  const fromWei = (num) => ethers.utils.formatEther(num)

  const [featuredSong, setFeaturedSong] = useState()
  const [producerNft, setProducerNft] = useState()
  const [songAudio, setSongAudio] = useState()
  const [ogProdAddy, setOgProdAddy]  = useState()
  const [ipfsLink, setIpfsLink] = useState()

  const getFeaturedSong = async () =>{
    try {
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const DefiBeatsContract = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, provider)

        const featSongData = await DefiBeatsContract.featuredSong()

        const featSongMapping = featSongData.map((i)=>{
          let output = []
          output.push(i)
          return output
        })
        setIpfsLink(featSongMapping[4][0])
        setOgProdAddy(featSongMapping[7][0])
        setFeaturedSong(featSongMapping)
        

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

    setProducerNft(ogProdIm)
    
    //return image uri for img src link
    return (ogProdIm)



  }

  const getAudioFile = async (ipfsUri) =>{
    let response = await fetch(ipfsUri)
    const jsonResponse = await response.json()
    setSongAudio(jsonResponse["song"])
    return jsonResponse["song"]
    
  }

  useEffect(()=>{
    getFeaturedSong()
    
  },[])

  useEffect(()=>{
    _getOriginalProducer(ogProdAddy)
    
  },[ogProdAddy])

  useEffect(()=>{
    getAudioFile(ipfsLink)
  },[ipfsLink])

  return (
    <div id="content">
        <h2>Featured Song</h2>
        <div className='home-featured-song'>
        {console.log(featuredSong)}
        {console.log(songAudio)}
           
           {!featuredSong ? 
                (<p>loading</p>) 
                : 
                  <div className="featured-song-container layoutoutline-solid"> 
                        <h3>Name: {featuredSong[1]}  </h3>
                        <img className="song-producer-image" alt="producer nft" src={producerNft} />                  
                        <p>Original Producer: </p>
                        <div>
                          <h5>Collection Name: {featuredSong[2]} </h5>
                        </div>
                        <div>
                        {!featuredSong[6] ? <p>Not For Sale</p> : <p>Price: {fromWei(featuredSong[5].toString())} Matic </p> }
                          
                        </div>
                        
                        <div className="play-btn-container"> 
                        {!featuredSong[6] ? <p>Not For Sale</p> : <button value={featuredSong[0]} onClick={null} >Buy</button>  }
                        {/* <button value={featuredSong[0]} onClick={e=>buySong(e.target.value, featuredSong[5])} >Buy</button> */}
                        </div>

                        <div className="audio-bar-container" >
                          {
                            !songAudio ? <p>Loading Song</p> :
                            <audio className="audio-bar" controls>
                              <source src={songAudio} />
                            </audio>  
                          }
                              
                        </div>
                  </div>
                
                   
           }
           
        </div>
    </div>
  )
}

export default FeaturedSong;