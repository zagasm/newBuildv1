import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";
import LoadingOverlay from "../../../component/assets/projectOverlay.jsx";

function Sessionpage() {
  const { user, isLoading } = useAuth();

  // If authentication state is still loading, show a loading indicator
  if (isLoading) {
    return <LoadingOverlay/>; // Or a spinner component
  }

  // If user is not authenticated, redirect to the sign-in page
  // if (!user) {
  //   return <Navigate to="/auth/signin" replace />;
  // }

  // If user is authenticated, render the child routes
  return <Outlet />;
}

export default Sessionpage;