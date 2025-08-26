import React, { useEffect } from 'react';
import './Marketing.css';
import googleLogo from "../../../assets/google-logo.png";
function Marketing() {
  // Floating emojis animation
  useEffect(() => {
    const hero = document.querySelector(".hero");
    const emojis = ["😂", "😎", "🔥", "🙌", "🐸", "🐶", "😹"];

    for (let i = 0; i < 12; i++) {
      const span = document.createElement("span");
      span.className = "floating-emoji";
      span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      span.style.left = Math.random() * 100 + "vw";
      span.style.animationDuration = 5 + Math.random() * 5 + "s";
      hero.appendChild(span);
    }
  }, []);

  return (
    <div className="marketing-container">
      {/* Hero Section */}
      <section className="hero fade-in">
        <div className="hero-content">
          <h1>Zagasm: Where Memes Meet Mayhem!</h1>
          <p className="subheadline text-light">Swipe, Share, and LOL with the Funniest Meme App on the Planet!</p>
          <span href="#download" style={{ cursor: 'pointer' }} className="cta">Download Zagasm Now – Free to Laugh!</span>
          <div className="trust">
            <span>📱 Available on iOS & Android</span>
            <span>🔥 Join 500K+ Meme Creators!</span>
          </div>
        </div>
      </section>

      {/* Section 1 */}
      <section className="section slide-up">
        <h2>Why Zagasm is Your Meme Paradise</h2>
        <ul>
          <li>Endless Meme Feed: Scroll through a never-ending stream of hilarious memes curated by our community and AI-driven humor algorithm.</li>
          <li>Create & Share: Use our easy meme maker to craft your own viral masterpieces in seconds and share them with the world.</li>
          <li>Community Vibes: Join a global squad of meme lovers, upvote your favorites, and see your memes climb the leaderboard.</li>
          <li>Daily Laughs: Fresh memes delivered daily to keep your feed as spicy as a trending TikTok.</li>
        </ul>
        <span href="#download" className="cta">Start Laughing Now – Download Free!</span>
      </section>

      {/* Section 2 */}
      <section className="section alt slide-up">
        <h2>Get Your Meme Game On in 3 Easy Steps</h2>
        <ol>
          <li>Download Zagasm: Grab the app for free on iOS or Android.</li>
          <li>Swipe & Laugh: Browse a curated feed of memes tailored to your humor style.</li>
          <li>Create & Share: Make your own memes with our templates and tools, then share them to go viral.</li>
        </ol>
        <span href="#download" className="cta">Join the Meme Party – Download Now!</span>
      </section>

      {/* Section 3 */}
      <section className="section slide-up">
        <h2>Memes That Slap Harder Than Your Favorite Viral Video</h2>
        <p>Memes are the internet’s love language, and Zagasm speaks it fluently. Our app lets you tap into the viral power of humor to connect, laugh, and maybe even become a meme legend.</p>
        <p>Tired of scrolling through boring feeds? Zagasm’s got the cure for your content blues.</p>
        <p>75% of Gen Z and Millennials share memes online – join the 500K+ users already sharing the laughs on Zagasm!</p>
        <span href="#download" className="cta">Make Memes That Pop – Get Zagasm Now!</span>
      </section>

      {/* Section 4 */}
      <section className="section alt slide-up">
        <h2>Meet the Meme Lords of Zagasm</h2>
        <p>Showcase user-generated content with a rotating gallery of top memes from the app.</p>
        <p>Feature a “Meme of the Week” with a shoutout to the creator (e.g., “@MemeMaster420’s epic take on Monday mornings!”).</p>
        <p>Highlight community engagement: “Upvote, comment, and connect with meme lovers worldwide.”</p>
        <span href="#download" className="cta">Be the Next Meme Legend – Download Zagasm!</span>
      </section>

      {/* Section 5 */}
      <section className="section slide-up">
        <h2>What Makes Zagasm the Ultimate Meme App?</h2>
        <ul>
          <li>AI-Powered Humor: Our algorithm learns your vibe and serves memes you’ll love.</li>
          <li>Meme Maker Tools: 1000+ templates, stickers, and text overlays for instant meme creation.</li>
          <li>Social Sharing: One-tap sharing to Instagram, TikTok, X, and more.</li>
          <li>Voice Mode (App Exclusive): Chat with Grok, our AI meme assistant, for inspiration or laughs (available on iOS/Android apps only).</li>
          <li>Leaderboards & Challenges: Compete in weekly meme contests to earn bragging rights.</li>
        </ul>
        <span href="#download" className="cta">Unleash Your Inner Meme Lord – Download Free!</span>
      </section>

      {/* Section 6 */}
      <section className="section alt slide-up">
        <h2>What Meme Lovers Are Saying</h2>
        <blockquote>“Zagasm is my daily dose of LOLs! The meme maker is so easy to use.” – @LaughingLad</blockquote>
        <p>90K+ memes created weekly! or 15M+ memes swiped in 2025 alone!</p>
        <p>Social media buzz: Embed posts from X (e.g., “Just made my first viral meme on @ZagasmApp! 😂 #MemeLife”).</p>
        <span href="#download" className="cta">Join the Hype – Download Zagasm Now!</span>
      </section>

      {/* Section 7 */}
      <section id="download" className="section download slide-up">
        <h2>Ready to Meme It Up?</h2>
        <p>Direct download links for iOS and Android with QR codes for easy scanning.</p>
        {/* <div className="download-buttons">
          <a href="#">📲 iOS App Store</a>
          <a href="#">📲 Google Play</a>
        </div> */}

        <div className="row">
          <div className="col-lg-6 col-12 offset-xl-3">
            <div className="text-center mt-3 border-botto pb-3 mb-3">
              {/* <p className="small text-muted">Or continue with</p> */}
              <div className="row">
                <div className="col-6">
                  <button type="button" className="btn-sm api_btn btn-block">
                    {/* <img src={googleLogo} alt="Google Logo" className="mr-2" style={{ width: '20px', height: '20px' }} /> */}
                    <i className="fab fa-google-play mr-2"></i>
                    Android
                  </button>
                </div>
                <div className="col-6">
                  <button type="button" className="api_btn dark_apple_api_btn btn-block">
                    <i className="fab fa-apple mr-2"></i> Apple
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

    
    </div>
  );
}

export default Marketing;
