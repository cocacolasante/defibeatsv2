import Card from 'react-bootstrap/Card';

function SongListing() {
  return (
    <Card id="song-card-id">
      <img className='song-listing-card' src="https://i.seadn.io/gae/Yhp-HsBwzjuGotCNG4XtKgFkGCrofO7FeEaciuNx9Ny_Be_VrrEBuTgzh2BQKrZMLCzdo-sLMr9pSKgmGGin6V_Sa8nxo5MXNYt6?w=500&auto=format" />
      <Card.Body>
        <Card.Title>Song Name</Card.Title>
        <Card.Text>
          Artist name, collection name, price
        </Card.Text>
      </Card.Body>
      <Card.Body>
        <Card.Link href="#">Buy Song</Card.Link>
        <Card.Link href="#">Play Song</Card.Link>
      </Card.Body>
    </Card>
  );
}

export default SongListing;