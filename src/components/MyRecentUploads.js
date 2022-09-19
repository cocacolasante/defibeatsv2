import MyListedSong from "./MyListedSong"


const MyRecentUploads = () => {
  return (
    <div className='recent-upload-container'>
        <h2>My Recent Uploads</h2>
        <div className='recent-upload-card-container'>
            <MyListedSong />
            <MyListedSong />
            <MyListedSong />
            <MyListedSong />
            <MyListedSong />
            <MyListedSong />
            

        </div>
    </div>
  )
}

export default MyRecentUploads