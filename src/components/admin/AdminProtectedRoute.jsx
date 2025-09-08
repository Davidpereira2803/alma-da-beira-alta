import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Move this to a constants file later!
const ADMIN_EMAIL = "test@email.com";

function AdminProtectedRoute({ children }) {
  const { user } = useAuth();
  const isAdmin = user;
  return isAdmin ? children : <Navigate to="/login" />;
}

export default AdminProtectedRoute;