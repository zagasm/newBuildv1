import React from "react";
import { App } from "./app.jsx";
import { render } from "preact";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "preact/compat/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";
import { AuthProvider, useAuth } from "./pages/auth/AuthContext/index.jsx";
import { PostProvider } from "./component/Posts/PostContext/index.jsx";
import { HelmetProvider } from "react-helmet-async";
import { ProfileProvider } from "./pages/Profile/profileContext/index.jsx";
import { ModalProvider } from "./component/assets/ModalContext/index.jsx";
import SearchPostProvider from "./component/Posts/PostContext/seachPost.jsx";

const RootWrapper = () => {
  const { user, token } = useAuth();
  return (
    <PostProvider user={user} token={token}>
      <SearchPostProvider user={user} token={token}>
        <ProfileProvider user={user} token={token}>
          <App />
        </ProfileProvider>
      </SearchPostProvider>
    </PostProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider> {/* ✅ Provides context for useAuth */}
      <HelmetProvider>
        <ModalProvider>
          <RootWrapper /> {/* ✅ useAuth inside component */}
        </ModalProvider>
      </HelmetProvider>
    </AuthProvider>
  </BrowserRouter>
);
