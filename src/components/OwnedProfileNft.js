import { Alchemy, Network } from "alchemy-sdk";
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import env from "react-dotenv";
import {PROFILENFT_ADDRESS} from "../config"


const OwnedProfileNft = () => {

    const account = useSelector(state=>state.provider.account)

    const [profilePics, setProfilePics] = useState([])
    
    


    const getAllProfileNfts = async () =>{
        const config = {
            apiKey: env.REACT_APP_ALCHEMY_API_KEY,
            network: Network.MATIC_MUMBAI,
        };
    
        const alchemy = new Alchemy(config);
        const nfts = await alchemy.nft.getNftsForOwner(account, {
            contractAddresses: [PROFILENFT_ADDRESS]
        });
 
        setProfilePics(nfts.ownedNfts)
        console.log(nfts.ownedNfts)

    }

    useEffect(()=>{
        if(account){
            getAllProfileNfts();
        }
    }, [])


  return (
    <div>{profilePics.map((na, i)=>(
        <div className='input-group mb-3' key={i}>
            <p>{i} </p>
            
            <p>{i.image} </p>
            <br/>
            <button>Set As Profile</button>
        </div>
        
    ))} 
    </div>
  )
}

export default OwnedProfileNft