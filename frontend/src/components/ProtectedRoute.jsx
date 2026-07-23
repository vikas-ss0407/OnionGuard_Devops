import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const user = Cookies.get("user"); // check if user is logged in

  if (!user) {
    return <Navigate to="/login" replace />; // redirect if not logged in
  }

  return children; // render the protected page if logged in
}
