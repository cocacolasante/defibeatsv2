import SearchBar from "../components/SearchBar";
import MusicPlayer from "../components/MusicPlayer";
import { Outlet } from 'react-router-dom';
import Footer from "../components/Footer.compon";


const SearchAndPlayer = () =>{


    
    return(
        <div id='wrapper'>
                
                <MusicPlayer />
            <div id='content-wrapper'>
            <SearchBar />
            <Outlet />
            </div>
           
            <Footer />
            
      </div>
    )
}

export default SearchAndPlayer