import SongCard from "./SongCard";
import { loadProfile } from "../redux/actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const MusicPlayer = () =>{
    const provider = useSelector(state=>state.provider.connection)
    const activeAccount = useSelector(state=>state.provider.account)
    const dispatch = useDispatch()

    const loadProfileData = async ()=>{
        await loadProfile(provider, activeAccount, dispatch)
    }

    useEffect(()=>{
        loadProfileData();
    },[])
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

