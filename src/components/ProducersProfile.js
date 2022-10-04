import { ethers } from 'ethers'
import React from 'react'
import { useParams } from 'react-router-dom'
import { PROFILENFT_ADDRESS } from '../config'
import profileNftAbi from "../assets/profilenft.json"
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const ProducersProfile = () => {
  let params = useParams()

  const account = useSelector(state=>state.provider.account)

  const [profileAddress, setProfileAddress] = useState()
  const [profileImage, setProfileImage] = useState()
  const [hasLiked, setHasLiked] = useState(false)

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



  useEffect(()=>{
    fetchUsersProfile()
    setProfileAddress(params.address);
    _getOriginalProducerImage(params.address);
    fetchHasLiked();
    
  },[])

  return (
    <div> 
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
            <input placeholder='Enter Tip Amount'/>
            <button >Tip Producer</button>
          </div>
          <div>
          {!hasLiked ?<button onClick={likeProfile} >Like User's Profile</button> : 
            <button onClick={unlikeProfile} >Liked</button> }
          </div>
          <div>
            <h2>Recent Uploads</h2>
          </div>
          <div>
            
          </div>
        </div>
      )
    }
      
     
    </div>
  )
}

export default ProducersProfile