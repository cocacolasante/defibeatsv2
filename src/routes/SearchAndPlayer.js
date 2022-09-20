import SearchBar from "../components/SearchBar";
import MusicPlayer from "../components/MusicPlayer";
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

const SearchAndPlayer = () =>{


    
    return(
        <div id='wrapper'>
                
                <MusicPlayer />
            <div id='content-wrapper'>
            <SearchBar />
            <Outlet />
            </div>
      </div>
    )
}

export default SearchAndPlayer