import { Link } from "react-router-dom"

const ProducersCard = (props) => {
  return (
    <div className='producer-card-container' >
        <h6>{props.userAddress.slice(0, 6)}...{props.userAddress.slice(-6)}</h6>
        <div className="song-card-mapping2 layoutoutline-solid">

                <p>Username: {props.username}</p>
            
            <div>
                
              <img className="song-producer-image2" alt='profile nft' src={props.profNft} />
              <p>Current Status: {props.userStatus} </p>
              <p>Likes: {props.userslikes}</p>
              <div className="link-profile-div">

                <Link className="blue-button-thin" to={`/browse/${props.userAddress}`} >View Profile</Link>
              </div>
            </div>
      </div>
      </div>
  )
}

export default ProducersCard