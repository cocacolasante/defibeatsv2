import SongCard from "./SongCard";


const MusicPlayer = () =>{


  
    return (
        <div  className="side-bar-container">
           <div class=" "><a class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
                <div class=""><span>DeFi Beats</span></div>
                </a>      
            <SongCard />
            </div>
        </div>
    )
}

export default MusicPlayer;

