import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function FeaturedSong() {
  return (
    <Card className="text-center">
      <h2>Top Featured Song</h2>
      <Card.Body>
        <img className='song-listing-card' src="https://i.seadn.io/gae/oo6bKqCDQFRD839UmX82upGBkUyPoubPmmhdTkavo8behTMDIJUQFNPjXfURI57k7JtP-x-yoGLqRDwd2INW8y7U_4szibDDE5acow?w=500&auto=format" />
        <Card.Title>Special title</Card.Title>
        <Card.Text>
          Artist name, collection name, descriptions, price
        </Card.Text>
        <Button variant="primary">Buy Now</Button>
      </Card.Body>
    </Card>
  );
}

export default FeaturedSong;