
import MyLikes from "../components/MyLikes"

import MyRecentSongs from "../components/MyRecentSongs"

const MySongs = () => {


  return (
    <div id="content" >
      <div>
        <h2>MySongs</h2>
      </div>
      <div>
      <MyRecentSongs />
    </div>
    <div>
      <h2>My Likes</h2>
    </div>
      <div>
      <MyLikes />

      </div>
    </div>
  )
}

export default MySongs