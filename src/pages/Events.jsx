import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Container, Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function Events() {
  const { t } = useTranslation();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = querySnapshot.docs.map((doc) => doc.data());

      const today = new Date();
      const upcoming = eventList.filter(event => new Date(event.date) >= today);
      const past = eventList.filter(event => new Date(event.date) < today);

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    };

    fetchEvents();
  }, []);

  // ✅ Open PDF in Google Docs Viewer
  const handleViewPdf = (pdfUrl) => {
    setSelectedPdf(`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`);
    setShowModal(true);
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-center mb-4">{t("events")}</h2>
      {upcomingEvents.length === 0 ? (
        <p className="text-center">{t("no_upcoming_events")}</p>
      ) : (
        <Row className="justify-content-center">
          {upcomingEvents.map((event, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-bold">{event.title}</Card.Title>
                  <Card.Text>
                    <strong>{t("event_date")}:</strong> {event.date}<br />
                    <strong>{t("event_location")}:</strong> {event.location}
                  </Card.Text>
                  <Card.Text>{event.description}</Card.Text>

                  {/* ✅ View & Download Buttons */}
                  {event.pdfUrl && (
                    <div className="d-flex gap-2 mt-2">
                      <Button variant="info" onClick={() => handleViewPdf(event.pdfUrl)}>
                        {t("view_brochure")}
                      </Button>
                      <Button variant="success" href={event.pdfUrl} download>
                        {t("download_pdf")}
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <h2 className="fw-bold text-center mt-5">{t("past_events")}</h2>
      {pastEvents.length === 0 ? (
        <p className="text-center">{t("no_past_events")}</p>
      ) : (
        <Row className="justify-content-center">
          {pastEvents.map((event, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm bg-light">
                <Card.Body>
                  <Card.Title className="fw-bold text-muted">{event.title}</Card.Title>
                  <Card.Text>
                    <strong>{t("event_date")}:</strong> {event.date}<br />
                    <strong>{t("event_location")}:</strong> {event.location}
                  </Card.Text>
                  <Card.Text>{event.description}</Card.Text>

                  {/* ✅ View & Download Buttons */}
                  {event.pdfUrl && (
                    <div className="d-flex gap-2 mt-2">
                      <Button variant="info" onClick={() => handleViewPdf(event.pdfUrl)}>
                        {t("view_brochure")}
                      </Button>
                      <Button variant="success" href={event.pdfUrl} download>
                        {t("download_pdf")}
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ✅ Modal for Viewing PDFs using Google Docs */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("event_pdf_brochure")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPdf ? (
            <iframe 
              src={selectedPdf} 
              width="100%" 
              height="500px" 
              style={{ border: "none" }}
              title="PDF Preview"
            ></iframe>
          ) : (
            <p>{t("no_brochure_available")}</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Events;
