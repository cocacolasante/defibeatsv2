import {useState} from "react"
import { create as ipfsHttpClient} from "ipfs-http-client"
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0/')


const UploadForm = ({DefiBeats}) => {
  const [price, setPrice] = useState()
  const [name, setName] = useState()
  const [songFile, setSongFile] = useState()
  const [collectionName, setCollectionName] = useState()
  const [description, setDescription] = useState()

  const uploadToIpfs = async (event) =>{
    event.preventDefault()
    const file = event.target.files[0]
    if(typeof file !== 'undefined'){
      try{
        const result = await client.add(file)
        console.log(result)
        setSongFile(`https://ipfs.infura.io/ipfs/${result.path}`)
      }catch(error){
        console.log(error)
      }
    }
  }

  const createSong = async () => {
    if(!name || !songFile || !collectionName || !description) return;
    try {
      const result = await client.add(JSON.stringify({name, collectionName, description, songFile}))
      mintSong(result, name, collectionName);


    } catch(error){
      console.log(error)
    }
  }

  const mintSong = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    await (await DefiBeats.makeSong(uri, name, collectionName)).wait()

  }

  
  return (
    <div className="home-container">
      <div className="title-container-upload">
        <h2>Create song</h2>
      </div>
      <div className="upload-form-container">
        <form className="form">
          <div className="form-div">
            <label >Song Name</label>
            <input type='text' placeholder="Enter Song Name..." />
          </div>
          <div className="form-div">
            <label >Collection Name</label>
            <input type='text' placeholder="Enter Collection Name..." />
          </div>
          <div className="form-div">
            <label >Song File</label>
            <input type='file' placeholder="Enter Song File..." />
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadForm