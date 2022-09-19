import FeaturedSong from "../components/FeaturedSong";
import RecentUploads from "../components/RecentUploads";

const Home = ({contract}) =>{

    return(
        <div id="content">
        <div className="content-wrapper">
            <div className="row" >
                <FeaturedSong />
            </div>
            <div className="home-recent-upload" >
                <RecentUploads />
            </div>
        </div>
        </div>
    )
}

export default Home;