import { Link } from "react-router-dom"

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
                    <Link to={`/browse/${props.userAddress}`} >View Profile</Link>
            </div>
      </div>
      </div>
  )
}

export default ProducersCard