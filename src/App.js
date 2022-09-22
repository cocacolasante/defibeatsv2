import { Routes, Route } from 'react-router-dom';
import './App.css';
import "./bootstrapcss/bootstrap.min.css"

import SearchAndPlayer from './routes/SearchAndPlayer';
import Home from './routes/Home';
import Browse from './routes/Browse';
import MySongs from './routes/MySongs';
import Upload from './routes/Upload';
import Profile from './routes/Profile';

function App() {
  return (
    <Routes>
      <Route path='/' element={ <SearchAndPlayer />} >
        <Route index element={ <Home />} />
        <Route path='/browse' element={<Browse />} />
        <Route path='/mysongs' element={<MySongs />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/profile' element={<Profile />} />
      </Route>
     
    </Routes>
  );
}

export default App;
