import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Container, Card, Button, Form, Table } from "react-bootstrap";


function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", location: "", description: "" });
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const eventList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEvents(eventList);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return alert("Title and date are required");
    await addDoc(collection(db, "events"), newEvent);
    setNewEvent({ title: "", date: "", location: "", description: "" });
    fetchEvents();
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "600px", width: "100%" }}>

      <h2>Manage Events</h2>
      <div className="event-form">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter event title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" placeholder="Enter event location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Enter event description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
        </Form.Group>

        <Button variant="success" className="w-100" onClick={handleAddEvent}>Add Event</Button>
      </Form>

      </div>

      <h3 className="mt-4">Existing Events</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={event.id}>
              <td>{index + 1}</td>
              <td>{event.title}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
              <td>{event.description}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => setEditingEvent(event)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => deleteDoc(doc(db, "events", event.id))}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="secondary" className="w-100 mt-3" href="/admin">Back to Admin Panel</Button>

    </Card>
    </Container>

  );
}

export default AdminEvents;