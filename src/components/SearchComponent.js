import { useState, useEffect } from "react";



const SearchComponent = ({AllSongs, onChangeHandler}) => {


    
  return (
    <div>
        <div className="search-bar-form">
            <input className="search-bar" type="text" onChange={onChangeHandler} placeholder="Search For a Song.." />
        </div>
    </div>
  )
}

export default SearchComponent