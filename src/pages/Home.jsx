import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaTiktok } from "react-icons/fa";
import { Container, Button, Col, Row, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
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
              <h2 className="fw-bold">{t("who_we_are")}</h2>
              <p className="lead">{t("who_we_are_text")}</p>
              <div>
                {t("association_leaders")}
                <ul className="list-unstyled text-start mt-3">
                  <li><strong>{t("president")}:</strong> <span className="text-secondary">Daisy F. Pereira</span></li>
                  <li><strong>{t("vice_president")}:</strong> <span className="text-secondary">S. Monteiro Da Silva</span></li>
                  <li><strong>{t("secretary")}:</strong> <span className="text-secondary">Ana I. Esteves</span></li>
                  <li><strong>{t("treasurer")}:</strong> <span className="text-secondary">Jessica Pereira Braz</span></li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

      <Container className="text-center">
        <Container fluid className="my-5 bg-dark text-white p-4 rounded shadow">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h3 className="fw-bold">{t("upcoming_event")}</h3>
              {nearestEvent ? (
                <div className="p-3 border rounded shadow-sm bg-secondary text-white">
                  <h4 className="fw-bold">{nearestEvent.title}</h4>
                  <p><strong>{t("date")}:</strong> {nearestEvent.date}</p>
                  <p><strong>{t("location")}:</strong> {nearestEvent.location}</p>
                  <p>{nearestEvent.description}</p>
                  {nearestEvent.pdfUrl && (
                    <Button
                      variant="success"
                      href={nearestEvent.pdfUrl}
                      target="_blank"
                      className="mt-2"
                    >
                      {t("download_pdf")}
                    </Button>
                  )}
                  <Link to="/events">
                    <Button variant="secondary" className="me-2">{t("view_all_events")}</Button>
                  </Link>
                </div>
              ) : (
                <p>{t("no_upcoming_events")}</p>
              )}
            </Col>
          </Row>
        </Container>
      </Container>

      <Container className="text-center">
        <Container className="my-5 bg-dark text-white p-4 rounded shadow">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h3 className="fw-bold">{t("latest_gallery")}</h3>
              {latestImage ? (
                <Card className="shadow-sm mt-3">
                  <Card.Img variant="top" src={latestImage.url} alt={t("gallery_image_alt")} className="img-fluid rounded" />
                </Card>
              ) : (
                <p>{t("no_images_available")}</p>
              )}
              <Link to="/gallery">
                <Button variant="secondary" className="mt-3">{t("view_full_gallery")}</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* YouTube Video Section */}
      <Container className="text-center">
        <Container className="my-5 bg-dark text-white p-4 rounded shadow">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h3 className="fw-bold">{t("watch_our_video")}</h3>
              <div className="ratio ratio-16x9">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/SjY3asK1Wzk"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>


      <Container className="text-center">
        <Container className="my-5 bg-dark text-white p-4 rounded shadow">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h3 className="fw-bold">{t("join_us")}</h3>
              <p>{t("join_us_text")}</p>
              <Link to="/register">
                <Button variant="secondary" className="mt-3">{t("register_now")}</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </Container>

      <Container className="text-center">
        <Container className="my-5 bg-dark text-white p-4 rounded shadow">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h3 className="fw-bold">{t("contact")}</h3>
              <p><FaEnvelope className="me-2" /> {t("email")}: <a href="mailto:info@almadabeiraalta.com">info@almadabeiraalta.com</a></p>
              <p><FaPhone className="me-2" /> {t("phone")}: +352 123 456 789</p>
              <p>{t("follow_us")}</p>
              <div className="d-flex justify-content-center gap-3">
                <a href="https://www.facebook.com/people/Alma-da-Beira-Alta-asbl/61567258730734/" target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={30} className="text-secondary" />
                </a>
                <a href="https://www.instagram.com/almadabeiraalta/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={30} className="text-secondary" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <FaYoutube size={30} className="text-secondary" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
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
