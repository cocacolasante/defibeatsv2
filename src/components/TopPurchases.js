import SongListing from './SongListing'


const TopPurchases = () => {
  return (
    <div className='recent-upload-container'>
        <h2>Top Purchases</h2>
        <div className='recent-upload-card-container'>
            <SongListing />
            <SongListing />
            <SongListing />
            <SongListing />
            <SongListing />
            <SongListing />
            

        </div>
    </div>
  )
}

export default TopPurchases