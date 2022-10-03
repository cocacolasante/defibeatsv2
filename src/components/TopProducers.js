import { ethers } from "ethers";
import { useEffect, useState } from "react";
import defibeatsAbi from "../assets/defibeats.json"
import profileNftAbi from "../assets/profilenft.json"
import {PROFILENFT_ADDRESS} from "../config"




const TopProducers = () => {

    const[userProfiles, setUserProfiles] = useState()


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
                console.log(profileMetaMapping)
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
        <div id="content-wrapper">
            <h3>TopProducers</h3>
            <div className='recent-upload-card-container'> 
            {
                !userProfiles ? (<p>Loading...</p>)
                : (
                   userProfiles.map((i)=>{
                    return(
                        <div className="song-card-mapping" key={i[0]}>
                            <h3>Producer: {i[0].slice(0, 6)}...{i[0].slice(-6)}</h3>
                            {!i[5] ? <p></p> : <p>{i[5]}</p>}
                            <img className="song-producer-image" src={i[6]} /> 
                            <div>
                                {!i[1] ? <p>No status...</p> : <p>{i[1]}</p>}
                            </div>
                            <div className="play-btn-container"> 
                                <button className="play-buy-btn">Click to Like</button>
                                <button className="play-buy-btn">Click to View Profile</button>
                            </div>
                        </div>
                    )
                   })
                )
            }

            </div>
        </div>
    )
}

export default TopProducers