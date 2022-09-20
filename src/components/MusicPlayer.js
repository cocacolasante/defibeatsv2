import SongCard from "./SongCard";

const MusicPlayer = () =>{
    return (
        <div className="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navcustom">
           <div class="container-fluid d-flex flex-column p-0"><a class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
                <div class="sidebar-brand-icon rotate-n-15"><i class="fas fa-laugh-wink"></i></div>
                <div class="sidebar-brand-text mx-3"><span>DeFi Beats</span></div>
                </a>      

                <SongCard />
            </div>
        </div>
    )
}

export default MusicPlayer;

