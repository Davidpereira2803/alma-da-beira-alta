import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function MyFooter() {
  const { user } = useAuth();
  const adminEmail = "admin@example.com";

  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <Container>
        <p>© {new Date().getFullYear()} Alma Da Beira Alta - Luxembourg</p>
        
        {/* Show Admin Panel button only if admin is logged in */}
        {user && user.email === adminEmail && (
          <Link to="/admin">
            <Button variant="primary" className="mt-2">Admin Panel</Button>
          </Link>
        )}

        {/* Always show "Admin Login" button if the user is NOT logged in */}
          <Link to="/login">
            <Button variant="dark" className="mt-2">Admin Login</Button>
          </Link>
      </Container>
    </footer>
  );
}

export default MyFooter;
