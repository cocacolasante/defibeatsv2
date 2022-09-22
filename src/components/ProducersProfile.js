import { ethers } from 'ethers';
import { PROFILENFT_ADDRESS } from '../config';
import profileNftAbi from "../assets/profilenft.json"
import { useSelector } from 'react-redux';

const ProducersProfile = () => {

  

  const fetchUsersProfile = async () =>{
    try{
      const {ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const ProfileNFT = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, signer)

        const ArtistProfile = await ProfileNFT.numberToCreator(1)
        return ArtistProfile
      }

    }catch(error){
      console.log(error)
    }
  }

  return (
    <div id='content'>
        <h1>Test</h1>
        <div id='content-wrapper'>
              <div>
                  <h2>Producer</h2>
              </div>
              <div>
                  <h3>UserName</h3>
                  <h4>Profile Picture</h4>
                  <p>Message</p>
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