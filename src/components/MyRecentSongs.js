import { useEffect, useState } from 'react';
import {DEFIBEATS_ADDRESS} from "../config"
import defibeatsAbi from "../assets/defibeats.json"
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import profileNftAbi from "../assets/profilenft.json"
import {PROFILENFT_ADDRESS} from "../config"

const MyRecentSongs = () => {

    const account = useSelector(state=>state.provider.account)

    const [recentSongs, setRecentSongs] = useState()
    const [activeAccount, setActiveAccount] = useState()
    const [listingPrice, setListingPrice] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const toWei = (num) => ethers.utils.parseEther(num.toString())
    const fromWei = (num) => ethers.utils.formatEther(num)

    const checkIfWalletIsConnected = async () => {

        const {ethereum} = window;

        if(!ethereum){
            alert("please install metamask")
            return;
        } else{
            console.log("we have the ethereum object")
        }

        const accounts = await ethereum.request({method: "eth_accounts"})

        if(accounts.length !== 0){
            const currentAccount = accounts[0]
            setActiveAccount(currentAccount)

            console.log(`Connected to ${currentAccount}`)

        } else{
            console.log("No accounts authorized or connected")
        }
        
    }

    const getSongData = async () => {
        try {
          const {ethereum} = window;
          if(ethereum){
              const provider = new ethers.providers.Web3Provider(ethereum)
              
              const DefiBeatsContract = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, provider)
              
    
              const allSongs = await DefiBeatsContract.returnAllSongs()
              // console.log(allSongs)
    
              
              const songsMetaMapping = await Promise.all(allSongs.map(async (i)=>{
                let output = []
                
                
                if(i[3].toUpperCase() === account.toUpperCase()){
                    output.push(i[0].toString()) // token id
                    output.push(i[1]) // name
                    output.push(i[2]) // collection name
                    output.push(i[3]) // current owner
                    output.push(i[4]) // token uri
                    output.push(i[5].toString()) // price
                    output.push(i[6]) // is for sale
                    output.push(i[7]) // original producer
                    output.push(await _getOriginalProducer(i[7])) // og producer image
                    output.push(await getAudioFile(i[4])) // get song uri

                  } 
                
                return output
              }))
                
              setRecentSongs(songsMetaMapping)
             
          }
    
          }catch(error){
              console.log(error)
          }
      }

    
    const _getOriginalProducer = async (ogProducersAddress) =>{

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

    const setSongForSale = async (songNum) =>{       
        try{
            const {ethereum} = window;
      
            if(ethereum){
              const provider = new ethers.providers.Web3Provider(ethereum)
              const signer = provider.getSigner()
              const DefiBeats = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, signer)
      
              console.log("Loading Metamask to pay for gas")
              
              let txn = await DefiBeats.listSong(songNum, listingPrice)
              const receipt = await txn.wait()
             
              if(receipt.status === 1){
                setIsLoading(true)
                console.log("Song List Successful!")
                setIsLoading(false)
               
              } else {
                alert("Transaction failed, please try again")
              }
            }

      
          }catch (error){
            console.log(error)
          }
         
         
    }

    const handleSetSongButton = (e) =>{
        e.preventDefault()
        setSongForSale(e.target.value)
        
    }

    const cancelListing = async (songNum)=>{
        try{
            const {ethereum} = window;
      
            if(ethereum){
              const provider = new ethers.providers.Web3Provider(ethereum)
              const signer = provider.getSigner()
              const DefiBeats = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, signer)
      
              console.log("Loading Metamask to pay for gas")
              
      
              let txn = await DefiBeats.cancelListing(songNum)
              const receipt = await txn.wait()
                
              
              if(receipt.status === 1){
                setIsLoading(true)
                console.log("Song cancel Successful!")
                setIsLoading(false)
              } else {
                alert("Transaction failed, please try again")
              }
            }
      
          }catch (error){
            console.log(error)
          }
    }

    const handleCancelClick = (e) =>{
        e.preventDefault()
        setIsLoading(true)
        cancelListing(e.target.value)
        setIsLoading(false)
    }

    const getAudioFile = async (ipfsUri) =>{
      let response = await fetch(ipfsUri)
      const jsonResponse = await response.json()
      console.log(jsonResponse["song"])
  
      return jsonResponse["song"]
      
    }


    useEffect(()=>{ 
        checkIfWalletIsConnected()
        getSongData()
       
    }, [isLoading])

    


  return (
    <div className="text-bg-dark p-3" >
      <div>
        <h2>My Recent Songs</h2>
        <div className='user-profile-container'>
           
           {!recentSongs ? 
                (<p>loading</p>) 
                : 
                recentSongs.map((i)=>{
                   if(i[0]){
                    return(
                    <div className="producer-card-container song-card-mapping layoutoutline-solid" key={i[0]}> 
                        <h3>Name: {i[1]} </h3>
                        <img className="song-producer-image2" src={i[8]} />                  
                            
                        <p>Original Producer: {i[7].slice(0, 6)}...{i[7].slice(-6)}</p>
                      
                          <h5>Collection Name: {i[2]} </h5>
                      
                        
                        <div className="play-btn-container"> 
                       
                        {i[6] ? <button value={i[0]} onClick={handleCancelClick} className="play-buy-btn" >Cancel Listing</button> : (
                            <div>
                                <button className="play-buy-btn" value={i[0]} onClick={handleSetSongButton} >List for Sale</button>
                                <input type="number" onChange={e=>setListingPrice(toWei(e.target.value))} placeholder="listing price" />
                                </div> )}
                        </div>
                        <div className="audio-bar-container" >
                          <audio className="audio-bar" controls>
                            <source src={i[9]} />
                          </audio>      
                        </div>
                  </div>
                )
                   }
                
           }) }
           
        </div>
        </div>
    </div>
  )
}

export default MyRecentSongs