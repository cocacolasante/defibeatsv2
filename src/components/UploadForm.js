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
    <div id='content-wrapper'>
      <div className="title-container-upload">
        <h2>Create song</h2>
      </div>
      <div className="upload-form-container">
        <form className="form">
          <div className="form-div">
            <label >Song Name</label>
            <input type='text' onChange={(e)=>setName(e.target.value)} placeholder="Enter Song Name..." />
          </div>
          <div className="form-div">
            <label >Collection Name</label>
            <input type='text' onChange={(e)=>setCollectionName(e.target.value)} placeholder="Enter Collection Name..." />
          </div>
          <div className="form-div">
          <label for="genre">Choose Song Genre:</label>
            <select id="genre" name="genre">
              <option value="rock">Rock</option>
              <option value="rap-hiphop">Rap/Hip-Hop</option>
              <option value="alternative">Alternative</option>
              <option value="punk">Punk</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label for='description'>Enter short song description or message</label>
            <textarea value='description' onChange={(e)=>setDescription(e.target.value)} />
          </div>
          <div className="form-div">
            <label >Song File</label>
            <input type='file' placeholder="Enter Song File..." />
          </div>
          <button onSubmit={null} >Mint Song Now!</button>
        </form>
      </div>
    </div>
  )
}

export default UploadForm