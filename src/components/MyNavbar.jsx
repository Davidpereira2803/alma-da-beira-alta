import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/logo.jpg";

function MyNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ height: "80px", padding: "10px 20px" }}>
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-3 d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            width="71"
            height="50"
            className="d-inline-block align-top me-2"
          />
          Alma Da Beira Alta
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/gallery" className="fs-5 px-3">Gallery</Nav.Link>
            <Nav.Link href="/events" className="fs-5 px-3">Events</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
