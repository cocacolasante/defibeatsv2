import FeaturedSong from "../components/FeaturedSong";
import RecentUploads from "../components/RecentUploads";

const Home = ({contract}) =>{

    return(
        <div className="home-container">
            <div className="featured-container" >
                <FeaturedSong />
            </div>
            <div className="home-recent-upload" >
                <RecentUploads />
            </div>
        </div>
    )
}

export default Home;