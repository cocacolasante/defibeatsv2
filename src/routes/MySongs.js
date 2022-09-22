

import React, { useState } from 'react'

const MySongs = () => {

  const [mySongs, setMySongs] = useState([])

  return (
    <div id="content">
      <div>
        <h1>MySongs</h1>
      </div>
      <div>{mySongs.map((na, i)=>(
        <div className='input-group mb-3' key={i}>
            <p>{i} </p>
            
            <p>{i.image} </p>
            <br/>
            <button>Play</button>
            <button>List For Sale</button>
        </div>
        
    ))} 
    </div>
    </div>
  )
}

export default MySongs