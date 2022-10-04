import React from 'react'


const ProducersCard = (props) => {
  return (
    <div className='producer-card-container' >
        <h6>{props.userAddress.slice(0, 6)}...{props.userAddress.slice(-6)}</h6>
        <div className="song-card-mapping2">

                <p>Producer Username: {props.username}</p>
            
            <div>
                <p>UserName</p>
                    <img className="song-producer-image2" alt='profile nft' src={props.profNft} />
                    <p>{props.userStatus} </p>
                    <p>{props.userslikes}</p>
                <div className="play-btn-container" >
                    <button >Click here to like artist</button>
                </div>
                    <input placeholder='enter tip amount in ether' type='number' />

            </div>
      </div>
      </div>
  )
}

export default ProducersCard