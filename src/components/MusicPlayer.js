import SongCard from "./SongCard";


const MusicPlayer = () =>{


  
    return (
        <div  className="navbar  align-items-start text-bg-light p-3 sidebar sidebar-dark ">
           <div class="container-fluid d-flex flex-column p-0 "><a class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
                <div class="sidebar-brand-text mx-3 logo-text"><span>DeFi Beats</span></div>
                </a>      
            <SongCard />
            </div>
        </div>
    )
}

export default MusicPlayer;

