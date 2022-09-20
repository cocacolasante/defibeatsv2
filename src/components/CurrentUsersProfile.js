import { ethers } from 'ethers';
import profileNftAbi from "../assets/profilenft.json"

const CurrentUsersProfile = () => {

  const PROFILENFT_ADDRESS=""

  const mintProfilePic = async () =>{
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const ProfileNFT = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, signer)

        console.log("Popping Metamask for gas fees")

        ProfileNFT.mint()

      }
    }catch (error){
      console.log(error)
    }
    
  }



  return (
    <div>
        <div>
            <h2>username</h2>
        </div>
        <div>
            
        </div>
    </div>
  )
}

export default CurrentUsersProfile