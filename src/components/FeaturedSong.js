

function FeaturedSong() {

  return (
    <div className="featured-song-container " >
    <h2>Featured Song</h2>
      <div className="" > 
        <div className="featured-card layoutoutline-solid">
          <h3>Name:</h3>
          <img className="song-producer-image2" src="https://i.seadn.io/gae/oo6bKqCDQFRD839UmX82upGBkUyPoubPmmhdTkavo8behTMDIJUQFNPjXfURI57k7JtP-x-yoGLqRDwd2INW8y7U_4szibDDE5acow?auto=format&w=1000" />                  
              <p>Original Producer</p>
          {/* <p>Original Producer: {i[7].slice(0, 6)}...{i[7].slice(-6)}</p> */}
          <div>
            <h5>Collection Name: </h5>
          </div>
          
          <div className="play-btn-container"> 
            
            <button className="play-buy-btn" >Buy Song</button>
          </div>
          <div className="audio-bar-container" >
            <audio className="audio-bar" controls>
              <source src={null} />
            </audio>      
          </div>
            

          </div>
    </div>
  </div>
  );
}

export default FeaturedSong;