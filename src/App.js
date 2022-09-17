import { Routes, Route } from 'react-router-dom';
import './App.css';

import SearchAndPlayer from './routes/SearchAndPlayer';

function App() {
  return (
    <Routes>
      <Route path='/' element={ <SearchAndPlayer />} >
        {/* <Route index element={ <Home />} /> */}
        
      </Route>
     
    </Routes>
  );
}

export default App;
