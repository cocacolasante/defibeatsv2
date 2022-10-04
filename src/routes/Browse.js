import { Routes, Route } from 'react-router-dom'
import ProducersProfile from '../components/ProducersProfile'
import ProducersPreview from './ProducersPreview'
import SongBrowse from '../components/SongBrowse'

import React from 'react'

const Browse = () => {
  return(
    <Routes>
            <Route index element={<SongBrowse />} />
                <Route path="/:address" element={<ProducersProfile />} />
            </Routes>
    )
}

export default Browse