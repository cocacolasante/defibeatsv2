import { ethers } from "ethers";
import { DEFIBEATS_ADDRESS } from "../config";
import { useEffect, useState } from "react";
import defibeatsAbi from "../assets/defibeats.json"
import profileNftAbi from "../assets/profilenft.json"
import {PROFILENFT_ADDRESS} from "../config"
import { Link } from "react-router-dom"

function FeaturedSong() {

  const fromWei = (num) => ethers.utils.formatEther(num)

  const [featuredSong, setFeaturedSong] = useState()
  const [producerNft, setProducerNft] = useState()
  const [songAudio, setSongAudio] = useState()
  const [ogProdAddy, setOgProdAddy]  = useState()
  const [ipfsLink, setIpfsLink] = useState()
  const [allFees, setAllFees] = useState()


  const getFeaturedSong = async () =>{
    try {
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const DefiBeatsContract = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, provider)

        const featSongData = await DefiBeatsContract.featuredSong()
        const token = featSongData[0].toString()
        

        const featureSongStatus = await DefiBeatsContract.songs(token)

        const featSongMapping = featureSongStatus.map((i)=>{
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

    const songuri = jsonResponse["song"]

    setSongAudio(songuri)

    return jsonResponse["song"]
    
  }

  const buySong = async (songNumber, price) =>{
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const DefiBeats = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, signer)

        console.log("loading metamask to pay for gas")

        let currentPrice = ethers.BigNumber.from(price);

        let totalValueSent = currentPrice.add(allFees) 

        console.log(`Total Price Sent: ${fromWei(totalValueSent)}`)

        let txn = await DefiBeats.buySong(songNumber, {value: totalValueSent})
        let receipt = await txn.wait()

        if(receipt.status === 1){
          alert("Song Purchase Successful!")
        } else {
          alert("Transaction failed, please try again")
        }
        
      }

    }catch(error){
      console.log(error)
    }
  }

  const getFeeAmounts = async () =>{
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const DefiBeatsContract = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, provider)

        const transactionFee = await DefiBeatsContract.transactionFee()
        const royaltyFee = await DefiBeatsContract.royaltyFee()

        const totalFees = transactionFee + royaltyFee
        setAllFees(totalFees)

      }

    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    getFeaturedSong()
    getFeeAmounts()
    
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
        
           
           {!featuredSong ? 
                (<p>loading</p>) 
                : 
                  <div className="featured-song-container layoutoutline-solid"> 
                        <h3>Name: {featuredSong[1]}  </h3>
                        <img className="song-producer-image" alt="producer nft" src={producerNft} />                  
                        <p>Original Producer: {featuredSong[7][0].slice(0, 6)}...{featuredSong[7][0].slice(-6)} </p>
                        <div>
                          <h5>Collection Name: {featuredSong[2]} </h5>
                        </div>
                        <div>
                        {!featuredSong[6][0] ? <p>Last Sold For: {fromWei(featuredSong[5].toString())} </p> : <p>Price: {fromWei(featuredSong[5].toString())} Matic </p> }
                          
                        </div>
                        
                        <div className="play-btn-container"> 
                        {!featuredSong[6][0] ? <p>Not For Sale</p> : <button className="yellowButton" value={featuredSong[0]} onClick={e=>buySong(e.target.value, featuredSong[5].toString())} >Buy</button>  }
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
                        <div className="link-profile-div">
                          <Link className="blue-button-thin" to={`/browse/${featuredSong[7]}`} >View Profile</Link>
                        </div>  
                  </div>
           }
           
        </div>
    </div>
  )
}

export default FeaturedSong;