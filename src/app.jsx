import { Fragment, useState, useEffect } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route, useLocation, useNavigate, Outlet } from "react-router-dom";
import AuthLayout from "./pages/auth/layout";
import { SignUp } from "./pages/auth/signup";
import { Signin } from "./pages/auth/signin";
import { CodeVerification } from "./pages/auth/CodeVerification";
import { ForgetPassword } from "./pages/auth/Forgetpassword";
import { Error404 } from "./pages/errors/pagenotfound";
import { ToastContainer } from "react-toastify";
import { ChangePassword } from "./pages/auth/ChangePassword";
import "react-toastify/dist/ReactToastify.css";
import NetworkStatus from "./component/assets/NetworkStatus";
import Home from "./pages/Home/index.jsx";
import FullpagePreloader from "./component/assets/FullPagePreloader/index.jsx";
import Navbar from "./pages/pageAssets/Navbar.jsx";
import Chat from "./pages/chatRoom/index.jsx";
import ProfileOutlet from "./pages/Profile/ProfileOutlet.jsx";
import UserPost from "./pages/Profile/AlluserPosts.jsx";
import Sessionpage from "./pages/auth/SessionPage/index.jsx";
import CreatePost from "./pages/post/createPost/index.jsx";
import Post from "./component/Posts/ReadPost/index.jsx";
import ExplorePage from "./pages/Explore/index.jsx";
import Notifications from "./pages/Notification/index.jsx";
import Settings from "./pages/Profile/Settings/header.jsx";
import Help from "./pages/Profile/Settings/HelpCenterSettings/HelpOutlet.jsx";
import Faqs from "./pages/Profile/Settings/HelpCenterSettings/Faqs/index.jsx";
import Templates from "./pages/Template/AllTemplate/index.jsx";
import PrivacyPolicy from "./pages/auth/Privacy-policy/index.jsx";
import TemplateLayout from "./pages/Template/TemplateLayout.jsx";
import VewTemplates from "./pages/Template/viewTemplate/index.jsx";
import { ModalProvider } from "./component/assets/ModalContext/index.jsx";
import PostSignupForm from "./component/assets/ModalContext/signupForm/PostSignUpForm.jsx";
import { useAuth } from "./pages/auth/AuthContext/index.jsx";
import AuthModal from "./pages/auth/AuthModal/index.jsx";
import ProfilePage from "./pages/Profile/index.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, showAuthModal } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      showAuthModal('login');
    }
  }, [isAuthenticated, showAuthModal]);

  if (!isAuthenticated) {
    return null; // Don't render protected content
  }

  return children;
};

const MainLayout = () => (
  <>
    <PostSignupForm />
    <Navbar />
    <Outlet />
  </>
);

export function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <ModalProvider>
      <Fragment>
        {loading && <FullpagePreloader loading={loading} />}
        <ToastContainer />
        <NetworkStatus />
        
        <AuthModal />
        
        <Routes>
          {/* Public Auth Routes (still accessible directly if needed) */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Signin />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<Signin />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="code-verification" element={<CodeVerification />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* Main App Routes */}
          <Route element={<Sessionpage />}>
            <Route element={<MainLayout />}>
              {/* Public Routes */}
              <Route index exact path="/" element={<Home />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="/posts/:postId" element={<Post />} />
              <Route path="template" element={<TemplateLayout />}>
                <Route index exact element={<Templates />} />
                <Route path=":templateId" element={<VewTemplates />} />
              </Route>
              <Route path="/help" element={<Help />}>
                <Route path="faqs" element={<Faqs />} />
              </Route>
              <Route path=":profileId" element={<ProfileOutlet />}>
                <Route index element={<ProfilePage />} />
              </Route>

              {/* Protected Routes (show modal if unauthenticated) */}
              <Route path="notification" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="chat/:recipient_id" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="create-post" element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } />
              <Route index path="settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
            </Route>
          </Route>

          {/* Additional Public Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/page-not-found" element={<Error404 />} />
          <Route path="*" element={<Error404 />} />
        </Routes>

        {state?.backgroundLocation && (
          <Routes>
            <Route
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
    </ModalProvider>
  );
}