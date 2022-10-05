import { ethers } from 'ethers'
import React from 'react'
import { useParams } from 'react-router-dom'
import { PROFILENFT_ADDRESS } from '../config'
import { DEFIBEATS_ADDRESS } from '../config'
import profileNftAbi from "../assets/profilenft.json"
import defibeatsAbi from "../assets/defibeats.json"
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const ProducersProfile = () => {
  let params = useParams()

  const account = useSelector(state=>state.provider.account)

  const [profileAddress, setProfileAddress] = useState()
  const [profileImage, setProfileImage] = useState()
  const [hasLiked, setHasLiked] = useState(false)
  const [tippingAmount, setTippingAmount] = useState()

  const [recentSongs, setRecentSongs] = useState()
  const[allFees, setAllFees] = useState()


  const [producerProfile, setProducerProfile] = useState()

  const fetchUsersProfile = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)

        const profileData = await ProfileNFTContract.creatorsProfile(params.address)

        const profileDataMapping = profileData.map((i)=>{
          let output =[]
            output.push(i)

          return output
        })
        
        setProducerProfile(profileDataMapping)

      }

    }catch(error){
      console.log(error)
    }
  }

  const _getOriginalProducerImage = async (ogProducersAddress) =>{

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

    setProfileImage(ogProdIm)
    
    //return image uri for img src link
    return (ogProdIm)



  }

  const likeProfile = async () =>{
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const localProfileContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, signer)

        console.log("Popping metamask to pay for gas now")
        let txn = await localProfileContract.sendLike(params.address)
        
        const receipt = await txn.wait()

        if(receipt.status === 1){
          console.log("Profile Liked Successful!")
        } else {
          alert("Transaction failed, please try again")
        }


      }

    }catch (error){
      console.log(error)
    }
  }

  const fetchHasLiked = async () =>{
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)

        const hasLikedProfile = await ProfileNFTContract.hasLikeProfile(account, params.address)
        setHasLiked(hasLikedProfile)
      }

    }catch(error){
      console.log(error)
    }
  }

  const unlikeProfile = async () =>{
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const localProfileContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, signer)

        console.log("Popping metamask to pay for gas")

        let txn = await localProfileContract.unLike(params.address)
        const receipt = await txn.wait()

        if(receipt.status === 1){
          console.log("Profile Unliked Successful")
        } else {
          alert("Transaction failed, please try again")
        }
      }

    }catch(error){
      console.log(error)
    }
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
            
            
            if(i[7] === params.address){
                output.push(i[0].toString()) // token id
                output.push(i[1]) // name
                output.push(i[2]) // collection name
                output.push(i[3]) // current owner
                output.push(i[4]) // token uri
                output.push(i[5].toString()) // price
                output.push(i[6]) // is for sale
                output.push(i[7]) // original producer
                output.push(await _getOriginalProducerImage(i[7])) // og producer image
                output.push(await getAudioFile(i[4])) // get song uri

                
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

        console.log(`Total Price Sent: ${totalValueSent}`)

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

  const getAudioFile = async (ipfsUri) =>{
    let response = await fetch(ipfsUri)
    const jsonResponse = await response.json()
    console.log(jsonResponse["song"])

    return jsonResponse["song"]
    
  }

  const tipProducer = async () => {
    try {
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer =  provider.getSigner()
        const ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, signer)

        console.log('Popping metamask to pay for gas fees')
        let txn = await ProfileNFTContract.tipCreator(params.address, {value: tippingAmount})
        let receipt = await txn.wait() 

        if(receipt.status === 1){
          console.log("Tipped Producer Successful")
        } else {
          alert("Transaction failed, please try again")
        }
        
      }

    }catch (error){
      console.log(error)
    }
  }

 



  useEffect(()=>{
    fetchUsersProfile()
    setProfileAddress(params.address);
    _getOriginalProducerImage(params.address);
    fetchHasLiked();
    getSongData();
    getFeeAmounts()

  },[])

  return (
    <div > 
    {
      !producerProfile ? <p>Loading...</p>:
      (
        <div>
          <h1>Username: {producerProfile[5]} </h1>
          <h2>ProducersProfile: {params.address.slice(0, 6)}...{params.address.slice(-6)} </h2>
          <h3>{producerProfile[1]}</h3>
          <img src={profileImage} className="song-producer-image2"  />
          <p>Current Status: {producerProfile[1]} </p>
          <div>
            <h3>Users Likes</h3>
            <p>{producerProfile[4].toString()}</p>
          </div>
          <div>
            <h3>Total Users Tips</h3>
            <p>{producerProfile[2].toString()}</p>
          </div>
          <div>
            <input onChange={e=>setTippingAmount(e.target.value)} placeholder='Enter Tip Amount'/>
            <button onClick={tipProducer}>Tip Producer</button>
          </div>
          <div>
          {!hasLiked ?<button onClick={likeProfile} >Like User's Profile</button> : 
            <button onClick={unlikeProfile} >Liked</button> }
          </div>
          <div>
            <h2>Recent Uploads</h2>
          </div>
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
                        <div>
                        {!i[6] ? <p>Not For Sale</p> : <p>Price: {i[5]} Matic </p>}
                          
                        </div>
                        
                        <div className="play-btn-container"> 
                        {
                          !i[6] ? <button>Not For Sale</button> :
                          <button value={i[0]} onClick={e=>buySong(e.target.value, i[5])} >Buy</button>
                        }
                        
                        </div>
                        <div className="audio-bar-container" >
                          <audio className="audio-bar" controls>
                            <source src={i[9]} />
                          </audio>      
                        </div>
                  </div>
                )
                   }
                
                  }) }
           
        </div>
        </div>
      )
    }
      
     
    </div>
  )
}

export default ProducersProfile