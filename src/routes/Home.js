import FeaturedSong from "../components/FeaturedSong";
import RecentListings from "../components/RecentListings";
import TopPurchases from "../components/TopPurchases";
import TopProducers from "../components/TopProducers";

const Home = () =>{

    return(
        <div id="content backgroundcolor-container" >
            
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
       
    )
}

export default Home;