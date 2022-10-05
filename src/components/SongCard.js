import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import profileNftAbi from "../assets/profilenft.json"
import { PROFILENFT_ADDRESS } from '../config'
import { useState, useEffect } from 'react'


const SongCard = () => {

  const [activeAccount, setActiveAccount] = useState()
  const [currentProfile, setCurrentProfile] = useState()

  const [profileImage, setProfileImage] = useState()

  const checkIfWalletIsConnected = async () => {

    const {ethereum} = window;

    if(!ethereum){
        alert("please install metamask")
        return;
    } else{
        console.log("we have the ethereum object")
    }

    const accounts = await ethereum.request({method: "eth_accounts"})

    if(accounts.length !== 0){
        const currentAccount = accounts[0]
        setActiveAccount(currentAccount)


    } else{
        console.log("No accounts authorized or connected")
    }
    
}

  const fetchCurrentUser = async () => {
    try{
      const {ethereum} =window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)
        const profileData = await ProfileNFTContract.creatorsProfile(activeAccount)

        const profileDataMapping = profileData.map((i)=>{
          let output =[]
            output.push(i)

          return output
        })
        setCurrentProfile(profileDataMapping)
      }

    } catch(error){
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

  useEffect(()=>{
    checkIfWalletIsConnected()
    
  },[])

  useEffect(()=>{
    fetchCurrentUser()
    _getOriginalProducerImage(activeAccount)
  },[activeAccount])

  return (
    <div className='song-card-side-container layoutoutline-solid'>
      {!currentProfile ? <p>Loading Blockchain Data</p>:
        <div className='side-user-container'>
        <img className="song-producer-image3" src={profileImage} alt="profile image" />
          <p>Signed In As: {currentProfile[0].toString().slice(0, 6)}...{currentProfile[0].toString().slice(-6)}</p>
          <p>Username: {currentProfile[5]} </p>
          <p>Current Status: {currentProfile[1]}</p>
          <p>Current Status: {currentProfile[1]} </p>
        </div>
      }
    </div>
  )
}

export default SongCard