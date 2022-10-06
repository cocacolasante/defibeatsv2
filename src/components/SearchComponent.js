import { useState, useEffect } from "react";



const SearchComponent = () => {

    const [search, setSearch] = useState("")

    
  return (
    <div>
        <div className="search-bar-form">
            <input className="search-bar" type="text" onChange={(e)=>setSearch(e.target.value)} placeholder="Search For a Song.." />
        </div>
    </div>
  )
}

export default SearchComponent