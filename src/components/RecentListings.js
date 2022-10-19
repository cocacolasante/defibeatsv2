import { ethers } from "ethers";
import { DEFIBEATS_ADDRESS } from "../config";
import { useEffect, useState } from "react";
import defibeatsAbi from "../assets/defibeats.json"
import profileNftAbi from "../assets/profilenft.json"
import {PROFILENFT_ADDRESS} from "../config"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"


const RecentListings = () => {
  
  const account = useSelector(state=>state.provider.account)
  const [recentSongs, setRecentSongs] = useState()
  const[allFees, setAllFees] = useState()

  const toWei = (num) => ethers.utils.parseEther(num.toString())
  const fromWei = (num) => ethers.utils.formatEther(num)
  

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
                output.push(await getAudioFile(i[4])) // get song uri
                
            } 
            
            return output
          }))
          
          songsMetaMapping.reverse()
          songsMetaMapping.length = 6
          
          setRecentSongs(songsMetaMapping)
         
      }

      }catch(error){
          console.log(error)
      }
  }

  const buySong = async (songNumber, price) =>{
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const DefiBeats = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, signer)
        

        console.log("loading metamask to pay for gas")

        //  price as an int not a string
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

  const handleBuyclick = (songNum, price) =>{
    
    buySong(songNum, price)
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

    
    //return image uri for img src link
    return (ogProdIm)



  }

  const getFeeAmounts = async () =>{
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const DefiBeatsContract = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, provider)

        const transactionFee = await DefiBeatsContract.transactionFee()
        const royaltyFee = await DefiBeatsContract.royaltyFee()

        const totalFees = parseInt(transactionFee) + parseInt(royaltyFee)
        setAllFees(totalFees)

      }

    }catch(error){
      console.log(error)
    }
  }

  const getAudioFile = async (ipfsUri) =>{
    let response = await fetch(ipfsUri)
    const jsonResponse = await response.json()
    

    return jsonResponse["song"]
    
  }

  useEffect(()=>{
    
    getSongData();
    getFeeAmounts()
    
  }, [])

  return (
    <div id="content-wrapper">
        <h2 className="heading2">Recent Listings</h2>
        <div className='recent-upload-card-container'>
  
           {!recentSongs ? 
                (<p>loading</p>) 
                : 
                recentSongs.map((i)=>{
                   if(i[0]){
                    return(
                    <div className="song-card-mapping layoutoutline-solid" key={i[0]}> 
                        <h3>Name: {i[1]} </h3>
                        <img className="song-producer-image" src={i[8]} />                  
                            
                        <p>Original Producer: {i[7].slice(0, 6)}...{i[7].slice(-6)}</p>
                        <div>
                          <h5>Collection Name: {i[2]} </h5>
                        </div>
                        <div>
                          <p>Price: {fromWei(i[5])} Matic </p>
                          
                        </div>
                        
                        <div className="play-btn-container"> 
                        <button className="yellowButton" value={i[0]} onClick={e=>buySong(e.target.value, i[5])} >Buy</button>
                        </div>
                        <div className="audio-bar-container" >
                          <audio className="audio-bar" controls>
                            <source src={i[9]} />
                          </audio>      
                        </div>
                        <div className="link-profile-div" >
                          <Link className="blue-button-thin"  to={`/browse/${i[7]}`} >View Profile</Link>
                        </div>    
                  </div>
                )
                   }
                
           }) }
           
        </div>
    </div>
  )
}

export default RecentListings