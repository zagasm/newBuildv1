import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";
import LoadingOverlay from "../../../component/assets/projectOverlay.jsx";

function Sessionpage() {
  const { user, isLoading, isVisitor } = useAuth();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Allow visitors to view but restrict actions
  return <Outlet />;
}

export default Sessionpage;