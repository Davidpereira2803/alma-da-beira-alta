import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function AdminGallery() {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const querySnapshot = await getDocs(collection(db, "gallery"));
    const imageList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setImages(imageList);
  };

  // Convert GitHub URLs to raw URLs
  const convertToRawGitHubUrl = (url) => {
    if (url.includes("github.com") && url.includes("/blob/")) {
      return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }
    return url;
  };

  const handleAddImage = async () => {
    if (!imageUrl) return alert(t("enter_image_url"));

    const rawUrl = convertToRawGitHubUrl(imageUrl);

    await addDoc(collection(db, "gallery"), { url: rawUrl });
    setImageUrl("");
    fetchImages();
  };

  const handleDeleteImage = async (id) => {
    await deleteDoc(doc(db, "gallery", id));
    fetchImages();
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="fw-bold mb-4">{t("manage_gallery")}</h2>

        {/* Image Input Field */}
        <Form.Group className="mb-3">
          <Form.Label>{t("image_url")}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t("enter_image_url")}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </Form.Group>

        {/* Add Image Button */}
        <Button variant="success" className="w-100 mb-3" onClick={handleAddImage}>
          {t("add_image")}
        </Button>

        {/* Gallery Section */}
        <h3 className="mt-4">{t("gallery_images")}</h3>
        <Row className="justify-content-center">
          {images.map((img) => (
            <Col key={img.id} md={4} className="mb-3">
              <Card className="shadow-sm">
                <Card.Img variant="top" src={img.url} alt={t("gallery_image_alt")} />
                <Card.Body className="text-center">
                  <Button variant="danger" size="sm" onClick={() => handleDeleteImage(img.id)}>
                    {t("delete")}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Button variant="secondary" className="w-100 mt-3" href="/admin">
          {t("back_to_admin_panel")}
        </Button>
      </Card>
    </Container>
  );
}

export default AdminGallery;
