import React, { useState } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../../../component/ToastAlert";
import AuthContainer from "../assets/auth_container";
import { motion } from "framer-motion";
import { CodeVerification } from "../CodeVerification";
import axios from "axios";
export function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
       const formPayload = new FormData();
      formPayload.append("email", email);
     
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/forgotten-password`,
        formPayload,
      );
      const data = response.data;
       console.log(data);
      if (data.status) {
        showToast.success(data.message ||"Reset code sent successfully!");
        setShowCodeVerification(true);
        setResetCode(data.user.reset_key);
        console.log("Reset code:", data.user.reset_key);
      } else {
        showToast.error(data.message || "Something went wrong.");
      }
    }catch (err) {
 
      if (err.response) {
        // Backend responded with an error
        const status = err.response.status;
        const message =
          err.response.data?.message || "An error occurred. Please try again.";

        if (status === 401) {
          showToast.error(message || "Invalid Email or email is not register on the platform.");
        } else {
          showToast.error(message);
        }
      }

      // setIsVerifying(false);
    }
    
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!showCodeVerification ? (
        <AuthContainer
          title={"Forget password?"}
          description={"Don't worry, enter your email address and we'll send you a reset link."}
        >
          <motion.form
            autoComplete="off"
            className="pr-3 pl-3"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="form-group"
            >
              <div className="position-relative icon-form-control">
                <input
                  type="email"
                  className="form-control input"
                  placeholder="Email Address"
                  style={{ paddingLeft: "60px", outline: "none" }}
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <i className="feather-mail position-absolute input-icon"></i>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="bt submit_button btn-block mb-5"
              type="submit"
              style={{ color: "white" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </motion.button>

            <div className="py-3 text-center auth-foote">
              <span className="text-center">
                <span className="fas fa-arrow-left ml-2"></span>{" "}
                <Link className="font-weight-bold" to="/auth/signin">
                  Back to login
                </Link>
              </span>
            </div>
          </motion.form>
        </AuthContainer>
      ) : (
        <CodeVerification email={email} reset_code={resetCode} />
      )}
    </>
  );
}
