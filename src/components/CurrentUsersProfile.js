import { ethers } from 'ethers';
import profileNftAbi from "../assets/profilenft.json"
import { create as ipfsClient} from "ipfs-http-client"
import env from "react-dotenv";
import { Buffer } from "buffer";
import { useState } from 'react';
import {PROFILENFT_ADDRESS} from "../config"
import { useSelector } from 'react-redux';



const CurrentUsersProfile = () => {
  
  const auth =
  'Basic ' + Buffer.from(env.REACT_APP_INFURA_PROJECT_ID + ':' + env.REACT_APP_INFURA_SECRET_KEY).toString('base64');
const client = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
      },
  });

  const [profilePic, setProfilePic] = useState()
  
  const description = "DeFi Beats Profile NFT"
  

  const uploadToIpfs = async (event) =>{
    event.preventDefault()
    const file = event.target.files[0]

    if(typeof file !== 'undefined'){
      try{
        const result = await client.add(file)
        console.log(result)
        setProfilePic(`https://defibeats.infura-ipfs.io/ipfs/${result.path}`)

        console.log(`https://defibeats.infura-ipfs.io/ipfs/${result.path}`)

      }catch(error){
        console.log(error)
      }
    }
  }

  const createProfilePic = async (event) => {
    event.preventDefault()

    if(!profilePic) return;
    
    try {
      const result = await client.add(JSON.stringify({description: description, image: profilePic}))
      const uri = `https://defibeats.infura-ipfs.io/ipfs/${result.path}`

      mintProfileNft(uri);
      

      
    } catch(error){
      console.log(error)
    }
  }

  const mintProfileNft = async (uri) =>{
    
    try{
      
      const {ethereum} = window;
      if(ethereum){
        
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const ProfileNFT = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, signer)

        console.log("Popping Metamask for gas fees")

        let txn = await ProfileNFT.mint(uri)
        const receipt = await txn.wait()
        console.log(receipt)

        if(receipt.status === 1){
          console.log("Mint Successful!")
        } else {
          alert("Transaction failed, please try again")
        }

      }
    }catch (error){
      console.log(error)
    }
    
  }



  return (
    <div id=''>
        <div>
            <h2>username {useSelector(state=>state.provider.account)} </h2>
        </div>
        <div>
            <input onChange={uploadToIpfs} type='file' placeholder="Upload Profile Picture..." />
            <button onClick={createProfilePic} >Mint Profile Photo Now</button>
        </div>
    </div>
  )
}

export default CurrentUsersProfile