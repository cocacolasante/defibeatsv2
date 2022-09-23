import { Alchemy, Network } from "alchemy-sdk";
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import Identicon from "identicon.js"
import env from "react-dotenv";
import {PROFILENFT_ADDRESS} from "../config"
import profileNftAbi from "../assets/profilenft.json"
import { ethers } from "ethers";


const OwnedProfileNft = () => {

    const account = useSelector(state=>state.provider.account)

    const profileContract = async () =>{
        try {
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum)
                
                const ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)
                setnftProfileContract(ProfileNFTContract)
            }

        }catch(error){
            console.log(error)
        }
    }

    const [profilePics, setProfilePics] = useState()
    const [currentProfile, setCurrentProfile] = useState()
    const [nftProfileContract, setnftProfileContract] = useState()

    const [isLoading, setIsLoading] = useState(false)

    const [nftProfImg, setNftProfImg] = useState()

    const [profileNftMeta, setProfileNftMeta] = useState()


    
    let pictureArrayIpfsGateway =[]
   


    const getAllProfileNfts = async () =>{
        


        const config = {
            apiKey: env.REACT_APP_ALCHEMY_API_KEY,
            network: Network.MATIC_MUMBAI,
        };
    
        const alchemy = new Alchemy(config);
        const nfts = await alchemy.nft.getNftsForOwner(account, {
            contractAddresses: [PROFILENFT_ADDRESS]
        });
 
        
        const nftOwned = nfts.ownedNfts

        // outline to get to nft image uri
        // const nftOwnedUri1 = nftOwned[0];
        // const tokenMeta = nftOwnedUri1["rawMetadata"]
        // const tokenLink = tokenMeta["image"]

        setProfileNftMeta(nftOwned)

        let profImageMap = nftOwned.map( i =>{

            //set current profile picture
            pictureArrayIpfsGateway.push(i["rawMetadata"]["image"])
            setCurrentProfile(pictureArrayIpfsGateway[1])

            return (i["rawMetadata"]["image"])
        })

        setNftProfImg(profImageMap)

        
        // nftOwned.map(async i =>{

        //     //set current profile picture
        //     pictureArrayIpfsGateway.push(i["rawMetadata"]["image"])
        //     setCurrentProfile(pictureArrayIpfsGateway[1])

        //     setProfilePics(pictureArrayIpfsGateway[i])
            
        //     let image = i["rawMetadata"]["image"]
        //     // setNftProfImg(image)
            
        //     console.log(nftProfImg)

        // })
        

        
    }




    const renderAllProfileNfts = async () =>{
        if(!isLoading && nftProfImg){
            nftProfImg.map((i, image)=>{
                return(
                    <div key={i}>
                        <img src={image} className="img-thumbnail" />
                    </div>
                )
            })
        }
        
    }

   
    useEffect(()=>{
        profileContract();
  
        if(account){
            getAllProfileNfts()
            
        }
        
    },[] )


  return (
    <div>
        <div id="content" className="profile-picture">
        <h3>Current Profile Picture</h3>
            <img className="img-thumbnail" src={currentProfile} />
            {!nftProfImg ? (
                <p>Loading blockchain data</p>
            ) : (
                nftProfImg.map((i)=>{
                return(
                    <div key={i}>
                        <img className="img-thumbnail"  src={i} />
                        <button>Set As Profile</button>
                    </div>
                )
            })
            )}
        </div>

    </div>
  )
}

export default OwnedProfileNft