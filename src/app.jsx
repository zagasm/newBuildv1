import { Fragment, useState, useEffect } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Enables dropdown and other JS features

import { Routes, Route, useLocation } from "react-router-dom";
import AuthLayout from "./pages/auth/layout";
import { SignUp } from "./pages/auth/signup";
import { Signin } from "./pages/auth/signin";
import { CodeVerification } from "./pages/auth/CodeVerification";
import { ForgetPassword } from "./pages/auth/Forgetpassword";
import { Error404 } from "./pages/errors/pagenotfound";
// import { Onboarding } from "./pages/onboarding";

// import Header from "./component/assets/Header";
import Sidebar from "./component/assets/sidebar/sidebar";
import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { ChangePassword } from "./pages/auth/ChangePassword";
import "react-toastify/dist/ReactToastify.css";
import NetworkStatus from "./component/assets/NetworkStatus";
import Home from "./pages/Home/index.jsx";

import FullpagePreloader from "./component/assets/FullPagePreloader/index.jsx";
import Navbar from "./pages/pageAssets/Navbar.jsx";
import Chat from "./pages/chatRoom/index.jsx";
import MyProfile from "./pages/Profile/Header.jsx";
import ProfileOutlet from "./pages/Profile/ProfileOutlet.jsx";
import UserPost from "./pages/Profile/AlluserPosts.jsx";
import Sessionpage from "./pages/auth/SessionPage/index.jsx";
import CreatePost from "./pages/post/createPost/index.jsx";
import PostDetailsPage from "./pages/post/postDetails/index.jsx";
import PostViewModal from "./component/Posts/PostViewMOdal/index.jsx";
import Post from "./component/Posts/ReadPost/index.jsx";
import ExplorePage from "./pages/Explore/index.jsx";
import Notifications from "./pages/Notification/index.jsx";
import EditProfile from "./pages/Profile/Settings/header.jsx";
import Settings from "./pages/Profile/Settings/header.jsx";
import Help from "./pages/Profile/Settings/HelpCenterSettings/HelpOutlet.jsx";
import Faqs from "./pages/Profile/Settings/HelpCenterSettings/Faqs/index.jsx";
import Templates from "./pages/Template/AllTemplate/index.jsx";


const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);
export function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Detects route changes
  const state = location.state;
  if (typeof global === "undefined") {
    window.global = window;
  }

  useEffect(() => {
    setLoading(true); // Show preloader
    const timer = setTimeout(() => setLoading(false), 100); // Simulate load time

    return () => clearTimeout(timer);
  }, [location.pathname]); // Runs on every route change
  const background = location.state?.background;

  return (
    <Fragment>
      {loading && <FullpagePreloader loading={loading} />}

      <ToastContainer />
      <NetworkStatus />
      <Routes>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Signin />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<Signin />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="code-verification" element={<CodeVerification />} />
          <Route path="change-password" element={<ChangePassword />} />
          {/*
          {/* <Route path="onboarding" element={<Onboarding />} /> */}
        </Route>
        {/* location={state?.backgroundLocation || location} */}
        <Route element={<Sessionpage />} >
          <Route element={<MainLayout />}>
            <Route index exact path="/" element={<Home />} />
            <Route path="notification" element={<Notifications />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:recipient_id" element={<Chat />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="template" element={<Templates />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="/posts/:postId" element={<Post />} />
            <Route  path="/help" element={<Help />} >
              <Route path="faqs" element={<Faqs />} />
            </Route>
            <Route index path="settings" element={<Settings />} ></Route>
            <Route path=":profileId" element={<ProfileOutlet />}>
              <Route index element={<UserPost />} />
            </Route>

          </Route>

        </Route>

        <Route path="/page-not-found" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route
            // path="/posts/:postId" 
            element={
              <PostViewModal
                show={true}
                onHide={() => navigate(-1)}
              />
            }
          />
        </Routes>
      )}
    </Fragment>
  );
}
