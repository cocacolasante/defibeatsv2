import SongListing from './SongListing'

import React from 'react'

const RecentUploads = () => {
  return (
    <div className='recent-upload-container'>
        <h2>Recent Uploads</h2>
        <div className='recent-upload-card-container'>
            <SongListing />
            <SongListing />
            <SongListing />
            

        </div>
    </div>
  )
}

export default RecentUploads