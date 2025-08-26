import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useAuth } from "../../../../pages/auth/AuthContext";
import { showToast } from "../../../ToastAlert";

const ReportPost = ({ memeId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { token } = useAuth();
  const dropdownRef = useRef(null);
  const textareaRef = useRef(null);
  
  const predefinedReasons = [
    "Spam",
    "Inappropriate",
    "Harassment",
    "False Information",
    // "Other",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus textarea when "Other" is selected
  useEffect(() => {
    if (selectedReason === "Other" && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 100);
    }
  }, [selectedReason]);

  const handleReport = async () => {
    const reason =
      selectedReason === "Other" ? customReason.trim() : selectedReason;

    if (!reason) {
      setMessage("Please select a reason.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/meme/${memeId}/report`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    //   setMessage(response.data.message);

      if (response.data.status) {
        setSelectedReason("");
        setCustomReason("");
        setTimeout(() => setShowModal(false), 1500);
      }
      showToast.info(response.data.message);
    } catch (error) {
      showToast.error(error.response.data.message);

    //   console.error("Error reporting meme:", error);
    //   setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClick = (e) => {
    // Only close dropdown if clicking on modal backdrop, not content
    if (e.target === e.currentTarget) {
      setDropdownOpen(false);
    }
  };

  const modalContent = (
    <div
      className="modal fade show report-modal"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999999999999999999999999999999999999999999999999999,
      }}
      onClick={handleModalClick}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div 
          className="modal-content" 
          style={{ borderRadius: "12px" }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Report Meme</h5>
            <button
              type="button"
              className="close"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {message && (
              <div className="alert alert-info py-2">{message}</div>
            )}

            {/* Custom Dropdown */}
            <div className="form-group">
              <label>
                <strong>Select a reason:</strong>
              </label>
              <div className="dropdown mt-2" ref={dropdownRef}>
                <button
                  className="btn btn-light w-100 text-left d-flex justify-content-between align-items-center"
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  disabled={loading}
                >
                  {selectedReason || "-- Choose a reason --"}
                  <i className="fas fa-caret-down"></i>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu show w-100">
                    {predefinedReasons.map((reason, idx) => (
                      <button
                        key={idx}
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          setSelectedReason(reason);
                          setDropdownOpen(false);
                        }}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Show textarea if "Other" selected */}
            {selectedReason === "Other" && (
              <div className="mt-3">
                <label>
                  <strong>Please describe the issue:</strong>
                </label>
                <textarea
                //   ref={textareaRef}
                  className="form-control mt-2"
                  rows="4"
                  placeholder="Provide details about why you're reporting this post"
                //   value={customReason}
                //   onChange={(e) => setCustomReason(e.target.value)}
                //   disabled={loading}
                />
              </div>
            )}
            {/* <input type="text" /> */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn " style={{background:'rgba(143, 7, 231, 1)', color:'white'}}
              onClick={handleReport}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Report Button */}
      <button
        className="w-100 text-left d-flex align-items-center py-3"
        type="button"
        style={{
          background: "none",
          border: "none",
          fontSize: "14px",
          color: "#ed4956",
        }}
        onClick={() => setShowModal(true)}
      >
        <i
          className="far fa-flag mr-3"
          style={{ width: "24px", fontSize: "20px" }}
        ></i>
        <span>Report</span>
      </button>

      {/* Portal for modal */}
      {showModal && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default ReportPost;