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

    // load profile contract and current users blockchain profile
    const profileContract = async () =>{
        try {
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum)
                
                const ProfileNFTContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, provider)
                setnftProfileContract(ProfileNFTContract)

                const userProfile = await ProfileNFTContract.creatorsProfile(account)

                // console.log(userProfile[3].toString()) use toString to get tokenId to set 
                // set blockchain profile data
                setBlockchainProfile(userProfile)
                // set blockchain profile picture
                const userTokenPicId = userProfile[3].toString()

                const userTokenPicURI = await ProfileNFTContract.tokenURI(userTokenPicId)
                let response = await fetch(userTokenPicURI)
                const jsonResponse = await response.json()
                
                const userTokenImage = jsonResponse["image"]

                // load current profile picture from blockchain
                setCurrentProfile(userTokenImage)
                
            }

        }catch(error){
            console.log(error)
        }
    }

    const [currentProfile, setCurrentProfile] = useState()
    const [nftProfileContract, setnftProfileContract] = useState()
    
    const [blockchainProfile, setBlockchainProfile] = useState()

    const [nftMetaData, setNftMetaData] = useState()

   
    let pictureArrayIpfsGateway =[]

    const getAllProfileNfts = async () =>{
        

        // alchemy api to pull metadata
        const config = {
            apiKey: env.REACT_APP_ALCHEMY_API_KEY,
            network: Network.MATIC_MUMBAI,
        };
    
        const alchemy = new Alchemy(config);
        const nfts = await alchemy.nft.getNftsForOwner(account, {
            contractAddresses: [PROFILENFT_ADDRESS]
        });
        // assigning meta data to variable
        const nftOwned = nfts.ownedNfts


        const nftMeta = nftOwned.map(i=>{
            let output = []
            output.push(i["tokenId"])
            output.push(i["rawMetadata"]["image"])
            return output
        })
        
        setNftMetaData(nftMeta)
     
    }

    // set profile pic function needs testing 
    const handleSetProfile = async (_tokenId) => {
        

        try{
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const localProfileContract = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, signer)

                console.log("Loading Metamask to pay for gas")

                let txn = await localProfileContract.setProfile(_tokenId)
                const receipt = await txn.wait()
                if(receipt.status === 1){
                    console.log("Profile Picture Change Successful!")
          
                  } else {
                    alert("Transaction failed, please try again")
                  }

            }
        } catch(error){
            console.log(error)
        }
    }

    const handleSetStateProfile = async (e) =>{
        
        handleSetProfile(e.target.value)
        
    }

   
    useEffect(()=>{
        profileContract();
        getAllProfileNfts();
        console.log("test to see how many times run")
           
    },[currentProfile])



  return (
    <div>
        <div id="content" className="profile-picture">
        <h3>Current Profile Picture</h3>
            <img className="img-thumbnail" src={currentProfile} />

            {!nftMetaData ? (
                <p>Loading blockchain data</p>
            ) : (
                
                nftMetaData.map((i)=>{
                return(
                    <div key={i[0]}>
                        <img className="img-thumbnail"  src={i[1]} />
                        <button type="click" value={i[0]} onClick={e=>handleSetStateProfile(e)}>Set As Profile</button>
                        <p>{i[0]}</p>
                    </div>
                )
            })
            )}
        </div>

    </div>
  )
}

export default OwnedProfileNft