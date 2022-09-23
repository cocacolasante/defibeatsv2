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

    const [profilePics, setProfilePics] = useState([])
    const [currentProfile, setCurrentProfile] = useState()
    const [testPicArray, setTestPicArray] = useState([])
    const [nftProfileContract, setnftProfileContract] = useState()

    
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
 
        
        // console.log(nfts.ownedNfts)
        const nftOwned = nfts.ownedNfts
        // console.log(nftOwned)

        const nftOwnedUri1 = nftOwned[0];
        const tokenMeta = nftOwnedUri1["rawMetadata"]
        const tokenLink = tokenMeta["image"]
        // console.log(tokenLink)
        // setTestPic(tokenLink)


        let profilesGateways = new Promise.all(nftOwned.map(async i =>{

            pictureArrayIpfsGateway.push(i["rawMetadata"]["image"])

            setCurrentProfile(pictureArrayIpfsGateway[1])
              
            
        }))

        console.log(pictureArrayIpfsGateway)
        // map through array of gateways and get image link to add to img src

    }



   
    useEffect(()=>{
        if(account){
            getAllProfileNfts();
        }
    }, [])


  return (
    <div>
        <div id="content" className="profile-picture">
            <img className="img-thumbnail" src={currentProfile} />
        </div>
        <div>
            
        </div>
    </div>
  )
}

export default OwnedProfileNft