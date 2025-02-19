import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone , FaTiktok} from "react-icons/fa";
import { Container, Button, Col, Row, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Home() {
  const [nearestEvent, setNearestEvent] = useState(null);
  const [latestImage, setLatestImage] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const events = querySnapshot.docs.map(doc => doc.data());

      const today = new Date();

      const upcomingEvents = events.filter(event => new Date(event.date) >= today);
      if (upcomingEvents.length > 0) {
        const closestEvent = upcomingEvents.reduce((prev, curr) => 
          new Date(curr.date) < new Date(prev.date) ? curr : prev
        );
        setNearestEvent(closestEvent);
      }
    };

    const fetchLatestImage = async () => {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const images = querySnapshot.docs.map(doc => doc.data());

      if (images.length > 0) {
        const latest = images.reduce((prev, curr) => 
          new Date(curr.uploadedAt) > new Date(prev.uploadedAt) ? curr : prev
        );
        setLatestImage(latest);
      }
    };

    fetchEvents();
    fetchLatestImage();
  }, []);

  return (
    <>
      <Container className="text-center">
        <Container fluid className="bg-dark text-white py-5 rounded-3">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="fw-bold">Who are we?</h2>
              <p className="lead">
                Alma da Beira Alta is a cultural association dedicated to preserving and promoting Portuguese folklore and traditions in Luxembourg. Founded by a group of passionate individuals, the association organizes various events, workshops, and performances to showcase the rich cultural heritage of Portugal. Through music, dance, and traditional crafts, Alma da Beira Alta aims to foster a sense of community and cultural pride among Portuguese immigrants and the broader Luxembourgish society. The association also collaborates with other cultural organizations to create a vibrant and diverse cultural landscape in Luxembourg.
              </p>
            </Col>
          </Row>
        </Container>
      </Container>

      <Container className="text-center">
        <Container fluid className="my-5 bg-dark text-white p-4 rounded shadow">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h3 className="fw-bold">Upcoming Event</h3>
              {nearestEvent ? (
                <div className="p-3 border rounded shadow-sm bg-secondary text-white">
                  <h4 className="fw-bold">{nearestEvent.title}</h4>
                  <p><strong>Date:</strong> {nearestEvent.date}</p>
                  <p><strong>Location:</strong> {nearestEvent.location}</p>
                  <p>{nearestEvent.description}</p>
                  <Link to="/events">
                    <Button variant="dark" className="me-2">View All Events</Button>
                  </Link>
                </div>
              ) : (
                <p>No upcoming events at the moment.</p>
              )}
            </Col>
          </Row>
        </Container>
      </Container>

      <Container className="text-center">
        <Container className="my-5 bg-dark text-white p-4 rounded shadow">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h3 className="fw-bold">Latest from the Gallery</h3>
              {latestImage ? (
                <Card className="shadow-sm mt-3">
                  <Card.Img variant="top" src={latestImage.url} alt="Latest Gallery Image" className="img-fluid rounded" />
                </Card>
              ) : (
                <p>No images available at the moment.</p>
              )}
              <Link to="/gallery">
                <Button variant="dark" className="mt-3">View Full Gallery</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </Container>

      <Container className="text-center">
        <Container className="my-5 bg-dark text-white p-4 rounded shadow">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h3 className="fw-bold">Contact Us</h3>
              <p><FaEnvelope className="me-2" /> Email: <a href="mailto:info@almadabeiraalta.com">info@almadabeiraalta.com</a></p>
              <p><FaPhone className="me-2" /> Phone: +352 123 456 789</p>
              <p>Follow us on social media:</p>
              <div className="d-flex justify-content-center gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={30} className="text-secondary" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={30} className="text-secondary" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <FaYoutube size={30} className="text-secondary" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <FaTiktok size={30} className="text-secondary" />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default Home;
