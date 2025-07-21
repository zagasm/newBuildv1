import React, { useRef, useState } from "react";
import PostSignupFormModal from "./ModalContainer";
import PhoneEmailPostSignup from "./PhoneEmailPostSignup";
import "./postSignupStyle.css";
import axios from "axios";
import { useAuth } from "../../../../pages/auth/AuthContext";
import Alert from 'react-bootstrap/Alert';

const SignUpCodecomponent = ({ token, userupdate, type }) => {
    const inputRefs = useRef([]);
    const [code, setCode] = useState(["", "", "", "", ""]);
    const [switchToForm, setSwitchToForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { login } = useAuth();

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 4) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleFinish = async () => {
        const verificationCode = code.join("");
        const verificationType =
            type === "email" || type === "email_verification"
                ? "email_verification"
                : type === "phone" || type === "phone_verification"
                    ? "phone_verification"
                    : "password_reset";

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/users/otp-verification/${userupdate.id}`,
                {
                    otp: verificationCode,
                    type: verificationType,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = response.data;

            if (result.status === true) {
                setSuccessMessage("Verification successful!");
                console.log("✅ OTP verified:", result.message);
                const user = userupdate;
                login({ token, user });
            } else {
                setErrorMessage(result.message || "Verification failed. Please try again.");
                console.error("❌ Verification failed:", result.message);
            }
        } catch (error) {
            // Handle validation errors and other API errors
            if (error.response?.status === 422) {
                // Handle validation errors
                const errorData = error.response.data;
                if (errorData.errors?.otp) {
                    setErrorMessage(errorData.errors.otp.join(' '));
                } else {
                    setErrorMessage(errorData.message || "Validation failed. Please check your input.");
                }
            } else {
                // Handle other errors
                const message = error.response?.data?.message || "Something went wrong. Please try again.";
                setErrorMessage(message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isComplete = code.every((digit) => digit !== "");

    const user = userupdate;
    function skipProcess() {
        login({ token, user });
    }

    if (switchToForm) {
        const altType = type === "email" || type === "email_verification" ? "phone" : "email";
        return (
            <PhoneEmailPostSignup
                token={token}
                userupdate={userupdate}
                type={altType}
            />
        );
    }

    return (
        <PostSignupFormModal>
            <div className="container overflow-hidden">
                <h2>We sent a code to your {type.includes("email") ? "email" : "phone"}</h2>
                <p>Enter the 5-digit verification code</p>

                {/* Error Message Alert */}
                {errorMessage && (
                    <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                        {errorMessage}
                    </Alert>
                )}

                <div className="code-inputs">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="code-box"
                        />
                    ))}
                </div>

                <div className="instead_button">
                    <button onClick={() => setSwitchToForm(true)}>
                        Use {type.includes("email") ? "phone number" : "email"} instead
                    </button>
                </div>

                <div className="d-flex">
                    <button
                        onClick={skipProcess}
                        className="skip-btn"
                        style={{
                            background: "none",
                            border: "none",
                            color: "rgba(143, 7, 231, 1)",
                            marginTop: "15px",
                            fontSize: "16px",
                            textDecoration: "underline",
                            width: "100%",
                        }}
                    >
                        Skip for now
                    </button>
                    <button
                        className="submit-btn mt-3"
                        onClick={handleFinish}
                        disabled={!isComplete || isLoading}
                        style={{
                            backgroundColor: isComplete ? "rgba(143, 7, 231, 1)" : "#e6e6e6",
                            color: isComplete ? "#fff" : "#999",
                            marginTop: "20px",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "6px",
                            width: "100%",
                            cursor: isComplete && !isLoading ? "pointer" : "not-allowed",
                        }}
                    >
                        {isLoading ? (
                            <div className="loader">
                                <div className="loader-spinner"></div>
                            </div>
                        ) : (
                            "Finish"
                        )}
                    </button>
                </div>
            </div>
        </PostSignupFormModal>
    );
};

export default SignUpCodecomponent;