import { ethers } from 'ethers';
import { PROFILENFT_ADDRESS } from '../config';
import profileNftAbi from "../assets/profilenft.json"
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const ProducersProfile = () => {

  const [producersProfile, setProducersProfile] = useState([])
  const producerAddress = useSelector(state=>state.provider.account)

  // use alchemy api to pull meta data
  // use balanceOf to pull nfts created by producer

  const fetchUsersProfile = async () =>{
    try{
      const {ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const ProfileNFT = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, signer)

        const ArtistProfile = await ProfileNFT.creatorsProfile(producerAddress)
        console.log(ArtistProfile)
        setProducersProfile(ArtistProfile)

      }

    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchUsersProfile()
  }, [])

  return (
    <div id='content'>
        <h1>Test</h1>
        <div id='content-wrapper'>
              <div>
                  <h2>Producer Address: {producersProfile[0]}</h2>
              </div>
              <div>
                  <h3>UserName</h3>
                  <h4>Profile Picture: </h4>
                  <p>Message: {producersProfile[1]}</p>
                  <p>Likes</p>
                  <button>Click here to like artist</button>
                  <p>Tips</p>
                  <input placeholder='enter tip amount in ether' type='number' />

              </div>
          </div>
    </div>
  )
}

export default ProducersProfile