import CurrentUsersProfile from "../components/CurrentUsersProfile"
import OwnedProfileNft from "../components/OwnedProfileNft"

const Profile = () => {
  return (
    <div className='profile-container' id="content">
    
    <OwnedProfileNft />
      <div>
        
        <CurrentUsersProfile />
      </div>
    </div>
  )
}

export default Profile