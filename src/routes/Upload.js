import React from 'react'
import UploadForm from '../components/UploadForm'
import MyRecentSongs from '../components/MyRecentSongs'



const Upload = () => {
  return (
    <div id='content' >
      <UploadForm />
      <div className='myrecent-uploads'>
        <MyRecentSongs />
      </div>
    </div>
  )
}

export default Upload