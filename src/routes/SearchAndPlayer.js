import SearchBar from "../components/SearchBar";
import MusicPlayer from "../components/MusicPlayer";
import { Outlet } from 'react-router-dom';

const SearchAndPlayer = () =>{

    

    return(
        <div>
            <div >
                <MusicPlayer />
            </div>
            <div>
                <SearchBar />
            </div>
            <Outlet />
      </div>
    )
}

export default SearchAndPlayer