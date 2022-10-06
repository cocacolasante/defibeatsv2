import React from 'react'
import { ethers } from 'ethers';
import { PROFILENFT_ADDRESS } from '../config';
import profileNftAbi from "../assets/profilenft.json"
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RecentListings from './RecentListings';
import AllSongs from './AllSongs';

import ProducersCard from '../components/ProducersCard';


const SongBrowse = () => {
    const[userProfiles, setUserProfiles] = useState()
    let params = useParams();




    const getProfileData = async () => {
        try {
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum)
                const ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)

                const allProfiles = await ProfileNFTContract.returnAllProfiles()
                
                const profileMetaMapping = await Promise.all(allProfiles.map(async (i)=>{
                    let output = []
                    // REMINDER -- FILTER OUT DUPLICATE ADDED CREATORS 
                    
                        output.push(i[0]) // address
                        output.push(i[1]) // user status
                        output.push(i[2].toString()) // tips received
                        output.push(i[3].toString()) // profile token id
                        output.push(i[4].toString()) // number of likes
                        output.push(i[5]) // user name
                        output.push(await _getOriginalProducer(i[0])) // profile image
                        
                        
                    
                    return output
                }))

                profileMetaMapping.sort((a, b)=>{
                    return b[4][0] - a[4][0]
                })
                profileMetaMapping.length = 8;

                
                setUserProfiles(profileMetaMapping)
                
                
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
        getProfileData();
    }, [])

  return (
    <div>
        <div>
            <h2>Top Producers</h2>
            <div className='user-profile-container'>
            {
                !userProfiles ? <p>Loading</p> :
                userProfiles.map((i)=>{
                    return(
                        <ProducersCard 
                        userAddress={i[0]}
                        profNft={i[6]}
                        username={i[5]}
                        userStatus={i[1]}
                        userslikes={i[4]}
                    />
                    )
            })}
            </div>
        </div>
        <div className="user-profile-container" >
            <RecentListings />
        </div>
        <div className="user-profile-container" >
            <AllSongs />
        </div>
    </div>
  )
}

export default SongBrowse