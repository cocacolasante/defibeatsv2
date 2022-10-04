import { ethers } from 'ethers'
import React from 'react'
import { useParams } from 'react-router-dom'
import { PROFILENFT_ADDRESS } from '../config'
import profileNftAbi from "../assets/profilenft.json"
import { useState, useEffect } from 'react'

const ProducersProfile = () => {
  let params = useParams()

  const [profileAddress, setProfileAddress] = useState()
  const [profileImage, setProfileImage] = useState()
  
  const [producerProfile, setProducerProfile] = useState([])

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

  useEffect(()=>{
    fetchUsersProfile()
    setProfileAddress(params.address);
    _getOriginalProducerImage(params.address);
    
  },[])

  return (
    <div> 
    {
      !producerProfile ? <p>Loading...</p>:
      (
        <div>
          <h1>ProducersProfile {params.address} </h1>
          <p>{producerProfile[1]}</p>
          <img src={profileImage} className="song-producer-image2"  />
          <p>Username: {producerProfile[5]}</p>
          
        </div>
      )
    }
      
      {console.log(producerProfile)}
    </div>
  )
}

export default ProducersProfile