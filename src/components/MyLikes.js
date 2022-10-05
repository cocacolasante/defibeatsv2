import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { ethers } from "ethers"
import { PROFILENFT_ADDRESS } from "../config"
import profileNftAbi from "../assets/profilenft.json"
import ProducersCard from "./ProducersCard"



const MyLikes = () => {
    const [myCurrentLikes, setMyCurrentLikes] = useState()
    const currentAccount = useSelector(state=>state.provider.account)


    const fetchCurrentLikes = async () => {
        try{
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum)
                const ProfileNFT = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)

                const allLikes = await ProfileNFT.returnLikedCreatorsList(currentAccount)

                const likedProfileMapping = await Promise.all(allLikes.map(async (i)=>{
                    let output = []
                    // REMINDER -- FILTER OUT DUPLICATE ADDED CREATORS 
                    
                        output.push(i[0]) // address
                        output.push(i[1]) // user status
                        output.push(i[2].toString()) // tips received
                        output.push(i[3].toString()) // profile token id
                        output.push(i[4].toString()) // number of likes
                        output.push(i[5]) // user name
                        output.push(await _getOriginalProducerImage(i[0])) // profile image
                        
                    
                    return output
                }))

                setMyCurrentLikes(likedProfileMapping)

                
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

    
    //return image uri for img src link
    return (ogProdIm)



  }

    useEffect(()=>{
        fetchCurrentLikes()
    },[])

  return (
    <div>
        <h6>MyLikes</h6>
        
        <div className='user-profile-container'>
            {!myCurrentLikes ? <p>Loading Info From Blockchain</p> :
                myCurrentLikes.map((i)=>{
                    return(
                <ProducersCard 
                    userAddress={ i[0]}
                    username={i[5]}
                    userStatus={i[1]}
                    profNft={i[6]}
                />)
            })}
        </div>
    </div>
  )
}

export default MyLikes