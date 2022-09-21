import CurrentUsersProfile from "../components/CurrentUsersProfile"
import OwnedProfileNft from "../components/OwnedProfileNft"

const Profile = () => {
  return (
    <div id="content">
      <CurrentUsersProfile />
      <div>
        <OwnedProfileNft />
      </div>
    </div>
  )
}

export default Profile