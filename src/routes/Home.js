import FeaturedSong from "../components/FeaturedSong";
import RecentListings from "../components/RecentListings";
import TopPurchases from "../components/TopPurchases";
import TopProducers from "../components/TopProducers";

const Home = () =>{

    return(
        <div id="content">
            <div className="content-wrapper">
                <FeaturedSong />
                <div className="home-recent-upload" >
                    <RecentListings />
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