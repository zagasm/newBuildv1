import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";
import LoadingOverlay from "../../../component/assets/projectOverlay.jsx";
import { useEffect } from "react";
import { useModal } from "../../../component/assets/ModalContext/index.jsx";
// import { useModal } from "../../../component/assets/ModalContext"; // ✅ use useModal hook

function Sessionpage() {
  const { user, isLoading } = useAuth();
  // const { showModal } = useModal(); // ✅

  // useEffect(() => {
  //   const condition = true; // ✅ Always true, adjust if needed

  //   if (condition) {
  //     showModal({
  //       title: "Global Session Modal",
  //       content: "This modal appears for all pages within SessionPage based on a condition.",
  //       confirmText: "Okay",
  //       cancelText: null,
  //       onConfirm: () => {
  //         console.log("User acknowledged modal");
  //       }
  //     });
  //   }
  // }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <Outlet />;
}

export default Sessionpage;
