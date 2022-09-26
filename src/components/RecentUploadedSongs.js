

import React from 'react'

const RecentUploadedSongs = ({songNFT}) => {
    const {name, collectionName, description, song} = songNFT
  return (
    <div>
        <div>
            <h3>{name}</h3>
        </div>
        <div>
            <img src='null' />
        </div>
        <div>
            <h5>{collectionName}</h5>
            <p>{description}</p>
        </div>
        <div>
            <h6>{song}</h6>
        </div>
    </div>
  )
}

export default RecentUploadedSongs