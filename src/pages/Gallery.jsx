import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function Gallery() {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const imageList = querySnapshot.docs.map((doc) => doc.data());
      setImages(imageList);
    };
    fetchImages();
  }, []);

  return (
    <Container className="py-5 text-center">
      <h2 className="fw-bold mb-4">{t("gallery")}</h2>
      {images.length === 0 ? (
        <p>{t("no_images_available")}</p>
      ) : (
        <Row className="justify-content-center">
          {images.map((img, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="shadow-sm">
                <Card.Img
                  variant="top"
                  src={img.url}
                  alt={t("gallery_image_alt")}
                  className="img-fluid rounded"
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Gallery;
