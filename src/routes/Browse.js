import { Routes, Route } from 'react-router-dom'
import ProducersProfile from '../components/ProducersProfile'
import SongBrowse from '../components/SongBrowse'

import React from 'react'

const Browse = () => {
  return(
    <Routes>
            <Route index element={<SongBrowse />} />
                <Route path=":producers" element={<ProducersProfile />} />
            </Routes>
    )
}

export default Browse