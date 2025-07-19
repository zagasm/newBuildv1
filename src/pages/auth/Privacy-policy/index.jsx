import React from 'react';
import './PrivacyPolicy.css'; // Create this CSS file for styling

function PrivacyPolicy() {
  return (
    <div className="privacy-policy-container">
      <div className="privacy-header">
        <h1>🔐 Privacy Policy for Zagasm</h1>
        <p className="effective-date">Effective Date: 17 July 2025</p>
      </div>

      <div className="privacy-intro">
        <p>
          Zagasm ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
          explains how we collect, use, disclose, and safeguard your information when you use our mobile 
          application ("App") or website.
        </p>
        <p className="consent-notice">
          By using Zagasm, you agree to the terms of this Privacy Policy.
        </p>
      </div>

      <div className="policy-section">
        <h2>1. 📋 Information We Collect</h2>
        <h3>1.1. Personal Information</h3>
        <p>
          We may collect personal information that you voluntarily provide to us when you:
        </p>
        <ul>
          <li>Create an account (e.g., name, email, phone number, username)</li>
          <li>Upload content or engage with others</li>
          <li>Request streaming or creator access</li>
          <li>Contact support or participate in promotions</li>
        </ul>

        <h3>1.2. Automatically Collected Information</h3>
        <p>
          We automatically collect certain information through the app or website:
        </p>
        <ul>
          <li>Device type and operating system</li>
          <li>IP address and browser type</li>
          <li>Usage data (e.g. pages visited, actions taken)</li>
          <li>Log and crash data</li>
          <li>Location data (if permitted)</li>
        </ul>

        <h3>1.3. Third-Party Logins</h3>
        <p>
          If you sign in via third-party providers (like Google or Facebook), we may receive your name, 
          email address, profile photo, and other information you authorize them to share with us.
        </p>
      </div>

      <div className="policy-section">
        <h2>2. 🛠️ How We Use Your Information</h2>
        <p>We use your data to:</p>
        <ul>
          <li>Provide and manage the app's functionality</li>
          <li>Personalize content and recommendations</li>
          <li>Monitor and improve user experience</li>
          <li>Send app updates, service notifications, and support responses</li>
          <li>Enforce our Terms of Use</li>
          <li>Prevent fraud, abuse, or illegal activity</li>
          <li>Show relevant advertisements and measure their effectiveness (if applicable)</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>3. 🔄 Sharing Your Information</h2>
        <p>We do not sell your personal information. We may share data:</p>
        <ul>
          <li>With service providers who help us operate (e.g., cloud hosting, analytics)</li>
          <li>With law enforcement if required by law</li>
          <li>If you engage in live events or public profiles, your content may be visible to other users</li>
          <li>In connection with a business transaction (e.g., merger, acquisition)</li>
        </ul>
      </div>

      <div className="policy-section">
        <h2>4. 🔒 Data Security</h2>
        <p>
          We use encryption, secure servers, and access controls to protect your information. 
          However, no system is 100% secure, and we cannot guarantee absolute protection.
        </p>
      </div>

      <div className="policy-section">
        <h2>5. 🍪 Cookies and Tracking Technologies</h2>
        <p>
          We and our partners may use cookies or similar technologies to analyze trends, 
          track usage, and improve the experience.
        </p>
        <p>
          You can manage cookie preferences through your browser settings.
        </p>
      </div>

      <div className="policy-section">
        <h2>6. 👶 Children's Privacy</h2>
        <p>
          Zagasm is not intended for children under 13 (or the age of digital consent in your country). 
          We do not knowingly collect personal information from minors. If we become aware of such data, 
          we will delete it promptly.
        </p>
      </div>

      <div className="policy-section">
        <h2>7. 🌍 International Users</h2>
        <p>
          By using Zagasm from outside Nigeria or your country of residence, you consent to the transfer, 
          storage, and processing of your information in accordance with this Privacy Policy.
        </p>
      </div>

      <div className="policy-section">
        <h2>8. ⚙️ Your Rights and Choices</h2>
        <p>
          Depending on your region, you may have rights such as:
        </p>
        <ul>
          <li>Accessing or updating your personal data</li>
          <li>Requesting data deletion</li>
          <li>Objecting to processing or withdrawing consent</li>
        </ul>
        <p>
          To exercise these rights, contact us at <a href="mailto:support@zagasm.com">support@zagasm.com</a>.
        </p>
      </div>

      <div className="policy-section">
        <h2>9. 📩 Contact Us</h2>
        <p>If you have questions or concerns about this Privacy Policy, please contact:</p>
        <address>
          Zagasm Global Limited<br />
          Email: <a href="mailto:support@zagasm.com">support@zagasm.com</a><br />
          Website: <a href="https://zagasm.com" target="_blank" rel="noopener noreferrer">https://zagasm.com</a>
        </address>
      </div>

      <div className="policy-section">
        <h2>10. 🔁 Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy occasionally. When we do, we will notify you by updating 
          the "Effective Date" above and, where appropriate, through the app or website.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;