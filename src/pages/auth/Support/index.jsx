import React, { useState } from "react";
import "./Support.css";

function Support() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "I can’t log in to my account. What should I do?",
      answer: [
        "Make sure your internet connection is stable.",
        "Try updating the app to the latest version.",
        "If the problem persists, contact us at support@zagasm.com."
      ]
    },
    {
      question: "Why am I not seeing new memes?",
      answer: [
        "Check if you’re connected to the internet.",
        "Pull down to refresh your feed.",
        "If still not working, reinstall the app."
      ]
    },
    {
      question: "How do I report inappropriate content?",
      answer: [
        "Tap the three dots (⋮) on the meme.",
        "Select Report Meme and tell us what’s wrong."
      ]
    },
    {
      question: "Can I upload my own memes?",
      answer: [
        "Yes! Tap the Upload button and follow the prompts.",
        "Make sure your memes follow our Community Guidelines."
      ]
    },
    {
      question: "The app keeps crashing. What do I do?",
      answer: [
        "Update to the latest version.",
        "Clear app cache (Settings > Apps > Zagasm > Storage > Clear Cache).",
        "Restart your phone."
      ]
    }
  ];

  return (
    <div className="support-container">
      <div className="support-header">
        <h1>Zagasm Support</h1>
        <p>
          🎉 Welcome to the Zagasm Support Center 🎉 <br />
          We’re here to make sure your laughter never stops!
        </p>
      </div>

      <section className="faq-section">
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openFAQ === index ? "open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className="arrow">
                  {openFAQ === index ? "−" : "+"}
                </span>
              </button>
              {openFAQ === index && (
                <div className="faq-answer">
                  <ul>
                    {faq.answer.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>Still need help? We’d love to hear from you 💌</p>
        <ul>
          <li>📧 Email: <a href="mailto:support@zagasm.com">support@zagasm.com</a></li>
          <li>🌐 Website: <a href="https://www.zagasm.com" target="_blank" rel="noreferrer">www.zagasm.com</a></li>
          <li>📱 Twitter / Instagram / TikTok: <b>@zagasmapp</b></li>
        </ul>
      </section>

      <section className="guidelines-section">
        <h2>Community Guidelines</h2>
        <p>To keep Zagasm fun for everyone, please avoid:</p>
        <ul>
          <li>Posting hateful or harmful content.</li>
          <li>Sharing copyrighted memes without permission.</li>
          <li>Spamming or harassing other users.</li>
        </ul>
      </section>

      <section className="feedback-section">
        <h2>Feedback</h2>
        <p>
          Your feedback helps us improve! If you have suggestions for new
          features, memes, or improvements, reach us anytime via the app under{" "}
          <b>Settings &gt; Feedback</b>.
        </p>
        <p className="footer">✨ Keep laughing, keep zagging! ✨</p>
      </section>
    </div>
  );
}

export default Support;
