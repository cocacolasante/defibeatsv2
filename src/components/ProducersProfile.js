import { ethers } from 'ethers';
import { PROFILENFT_ADDRESS } from '../config';
import profileNftAbi from "../assets/profilenft.json"
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const ProducersProfile = () => {

  const [producersProfile, setProducersProfile] = useState([])
  const producerAddress = useSelector(state=>state.provider.account)

  const [producersSongs, setProducersSongs] = useState()

  // use balanceOf to pull nfts created by producer

  const fetchUsersProfile = async () =>{
    try{
      const {ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const ProfileNFT = new ethers.Contract(PROFILENFT_ADDRESS, profileNftAbi.abi, signer)

        const allProfiles = await ProfileNFT.
        console.log(ArtistProfile)
        setProducersProfile(ArtistProfile)

        const ArtistsSongs = await ProfileNFT.balancesOf(producerAddress)

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
                  <h2>Producer Address: </h2>
              </div>
              <div>
                  <h3>UserName</h3>
                  <h4>Profile Picture: </h4>
                  <p>Message: </p>
                  <p>Likes</p>
                  <button>Click here to like artist</button>
                  <p>Tips</p>
                  <input placeholder='enter tip amount in ether' type='number' />

              </div>
          </div>
          <div>
            <h2>Producers Songs</h2>
          </div>
          <div>
          {!producersSongs ? 
                (<p>loading</p>) 
                : 
                producersSongs.map((i)=>{
                   if(i[0]){
                    return(
                    <div className="song-card-mapping" key={i[0]}> 
                        <h3>Name: {i[1]} </h3>
                        <img className="song-producer-image" src={i[8]} />                  
                            
                        <div>
                          <h5>Collection Name: {i[2]} </h5>
                        </div>
                        <div>
                          <p>Price: {i[5]} Matic </p>
                        </div>
                        
                        <div className="play-btn-container"> 
                        <button className="play-buy-btn">Play</button>
                        {/* <button value={i[0]} onClick={e=>buySong(e.target.value, i[5])} >Buy</button> */}
                        </div>
                  </div>
                )
                   }
                
           }) }
          </div>
    </div>
  )
}

export default ProducersProfile