import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = querySnapshot.docs.map((doc) => doc.data());

      // Get current date
      const today = new Date();

      // Split events into Upcoming and Past
      const upcoming = eventList.filter(event => new Date(event.date) >= today);
      const past = eventList.filter(event => new Date(event.date) < today);

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    };

    fetchEvents();
  }, []);

  return (
    <Container className="py-5">
      {/* Upcoming Events Section */}
      <h2 className="fw-bold text-center mb-4">Upcoming Events</h2>
      {upcomingEvents.length === 0 ? (
        <p className="text-center">No upcoming events at the moment.</p>
      ) : (
        <Row className="justify-content-center">
          {upcomingEvents.map((event, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-bold">{event.title}</Card.Title>
                  <Card.Text>
                    <strong>Date:</strong> {event.date}<br />
                    <strong>Location:</strong> {event.location}
                  </Card.Text>
                  <Card.Text>{event.description}</Card.Text>

                  {/* ✅ PDF Brochure Button (Only if available) */}
                  {event.pdfUrl && (
                    <Button 
                      variant="info" 
                      href={event.pdfUrl} 
                      target="_blank" 
                      className="mt-2"
                    >
                      📄 View Brochure
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
  
      {/* Past Events Section */}
      <h2 className="fw-bold text-center mt-5">Past Events</h2>
      {pastEvents.length === 0 ? (
        <p className="text-center">No past events available.</p>
      ) : (
        <Row className="justify-content-center">
          {pastEvents.map((event, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm bg-light">
                <Card.Body>
                  <Card.Title className="fw-bold text-muted">{event.title}</Card.Title>
                  <Card.Text>
                    <strong>Date:</strong> {event.date}<br />
                    <strong>Location:</strong> {event.location}
                  </Card.Text>
                  <Card.Text>{event.description}</Card.Text>

                  {/* ✅ PDF Brochure Button (Only if available) */}
                  {event.pdfUrl && (
                    <Button 
                      variant="info" 
                      href={event.pdfUrl} 
                      target="_blank" 
                      className="mt-2"
                    >
                      📄 Download Brochure
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Events;
