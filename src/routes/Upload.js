import React from 'react'
import UploadForm from '../components/UploadForm'
import MyRecentUploads from '../components/MyRecentUploads'



const Upload = () => {
  return (
    <div id='content'>
      <UploadForm />
      <div className='myrecent-uploads'>
        <MyRecentUploads />
      </div>
    </div>
  )
}

export default Upload