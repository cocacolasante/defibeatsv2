import FeaturedSong from "../components/FeaturedSong";
import RecentUploads from "../components/RecentUploads";
import TopPurchases from "../components/TopPurchases";

const Home = () =>{

    return(
        <div id="content">
            <div className="content-wrapper">
                <FeaturedSong />
                <div className="home-recent-upload" >
                    <RecentUploads />
                </div>
                <div className="home-recent-upload" >
                    <TopPurchases />
                </div>
            </div>
        </div>
    )
}

export default Home;