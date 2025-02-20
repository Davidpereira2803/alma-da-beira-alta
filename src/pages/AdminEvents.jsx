import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { Container, Table, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function AdminEvents() {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "", pdfUrl: "" });

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  // ✅ Convert GitHub URL to Raw Link
  const convertToRawGitHubLink = (url) => {
    const githubPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)/;
    if (githubPattern.test(url)) {
      return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }
    return url;
  };

  // ✅ Add New Event
  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date || !newEvent.description) {
      alert("All fields except PDF URL are required!");
      return;
    }

    const formattedPdfUrl = convertToRawGitHubLink(newEvent.pdfUrl);

    try {
      const docRef = await addDoc(collection(db, "events"), { ...newEvent, pdfUrl: formattedPdfUrl });
      setEvents([...events, { id: docRef.id, ...newEvent, pdfUrl: formattedPdfUrl }]);
      setNewEvent({ title: "", date: "", description: "", pdfUrl: "" });

      alert("Event added successfully!");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event. Try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">{t("manage_events")}</h2>

      {/* ✅ Add Event Form */}
      <Form onSubmit={handleAddEvent} className="mb-4 p-3 bg-light rounded shadow">
        <h4>{t("add_event")}</h4>
        <Form.Group className="mb-2">
          <Form.Label>{t("event_title")}</Form.Label>
          <Form.Control 
            type="text" 
            value={newEvent.title} 
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>{t("event_date")}</Form.Label>
          <Form.Control 
            type="date" 
            value={newEvent.date} 
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>{t("event_description")}</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            value={newEvent.description} 
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
            required 
          />
        </Form.Group>

        {/* ✅ GitHub PDF URL Input */}
        <Form.Group className="mb-2">
          <Form.Label>{t("event_pdf_url")}</Form.Label>
          <Form.Control 
            type="url" 
            value={newEvent.pdfUrl} 
            onChange={(e) => setNewEvent({ ...newEvent, pdfUrl: e.target.value })} 
          />
        </Form.Group>

        <Button variant="primary" type="submit">{t("add_event")}</Button>
      </Form>

      {/* ✅ Events Table */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>{t("event_title")}</th>
            <th>{t("event_date")}</th>
            <th>{t("event_description")}</th>
            <th>{t("event_pdf_brochure")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.date}</td>
              <td>{event.description}</td>
              <td>
                {event.pdfUrl ? (
                  <a href={event.pdfUrl} target="_blank" rel="noopener noreferrer">{t("view_pdf")}</a>
                ) : (
                  "No PDF"
                )}
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => deleteDoc(doc(db, "events", event.id))}>
                {t("delete")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="secondary" className="w-100 mt-3" href="/admin">{t("back_to_admin_panel")}</Button>
    </Container>
  );
}

export default AdminEvents;