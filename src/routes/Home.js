import FeaturedSong from "../components/FeaturedSong";
import RecentUploads from "../components/RecentUploads";
import TopPurchases from "../components/TopPurchases";
import TopProducers from "../components/TopProducers";

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
                <div className="home-recent-upload" >
                    <TopProducers />
                </div>
            </div>
        </div>
    )
}

export default Home;