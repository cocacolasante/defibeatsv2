import {useState} from "react"
import { create as ipfsClient} from "ipfs-http-client"
import { ethers } from "ethers"
import env from "react-dotenv";
import defibeatsAbi from "../assets/defibeats.json"
import { Buffer } from "buffer";
import {DEFIBEATS_ADDRESS} from "../config"

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


const UploadForm = () => {
      
  const [name, setName] = useState()
  const [songFile, setSongFile] = useState()
  const [collectionName, setCollectionName] = useState()
  const [description, setDescription] = useState("")

  const uploadToIpfs = async (event) =>{
    event.preventDefault()
    const file = event.target.files[0]

    if(typeof file !== 'undefined'){
      try{
        const result = await client.add(file)
        
        setSongFile(`https://defibeats.infura-ipfs.io/ipfs/${result.path}`)
        console.log(songFile)
      }catch(error){
        console.log(error)
      }
    }
  }

  const createSong = async (event) => {
    event.preventDefault()

    if(!name || !songFile || !collectionName || !description) return;
    
    try {
      const result = await client.add(JSON.stringify({name: name, collectionName: collectionName, description: description, song: songFile}))
      
      const uri = `https://defibeats.infura-ipfs.io/ipfs/${result.path}`

      mintSong(uri, name, collectionName);


    } catch(error){
      console.log(error)
    }
  }

  const mintSong = async (_uri, _name, _collectionName) => {

    try{
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const DefiBeats = new ethers.Contract(DEFIBEATS_ADDRESS, defibeatsAbi.abi, signer)

        console.log("Loading Metamask to pay for gas")
        

        let txn = await DefiBeats.makeSong(_uri, _name, _collectionName)
        const receipt = await txn.wait()

        if(receipt.status === 1){
          console.log("Song Mint Successful!")
        } else {
          alert("Transaction failed, please try again")
        }
      }

    }catch (error){
      console.log(error)
    }

  }

  
  return (
    <div id='content-wrapper'>
      <div className="title-container-upload">
        <h2>Create song</h2>
      </div>
      <div className="upload-form-container">
        <form onSubmit={createSong} className="form">
          <div className="form-div">
            <label >Song Name</label>
            <input type='text' onChange={(e)=>setName(e.target.value)} placeholder="Enter Song Name..." />
          </div>
          <div className="form-div">
            <label >Collection Name</label>
            <input type='text' onChange={(e)=>setCollectionName(e.target.value)} placeholder="Enter Collection Name..." />
          </div>
          <div>
            <label for='description'>Enter short song description or message</label>
            <br />
            <textarea placeholder='description' onChange={(e)=>setDescription(e.target.value)} />   
          </div>
          <br />
          <div className="form-div">
            <label>Song File</label>
            <input onChange={uploadToIpfs} type='file' placeholder="Enter Song File..." />
          </div>
          <input type="submit" value="Mint Song Now!" />
        </form>
      </div>
    </div>
  )
}

export default UploadForm