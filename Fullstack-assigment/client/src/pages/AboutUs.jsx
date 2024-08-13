import React from "react";

import HeroSection from '../hero.jsx';
import '../AboutUs.css';
import aboutUsImage from '../assets/Aboutus.jpg'; // Adjust the path as needed

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <HeroSection>
        {/* You can customize the HeroSection for the About Us page if needed */}
      </HeroSection>
      <section className="about-us-content">
        <div className="about-us-header">
          <img src={aboutUsImage} alt="About Us" className="about-us-image" />
          <h1 className="about-us-title">About Us</h1>
        </div>
        <p className="about-us-description">
          Welcome to EcoVerse, where our mission is to offer a centralized digital space designed to empower residents with knowledge and resources to embrace sustainable living practices within their community. Serving as a dynamic platform and information hub, EcoVerse fosters a culture of sustainability by facilitating engagement, participation, and collaboration within the community.
        </p>
        <div className="about-us-section">
          <h2 className="section-title">Our History</h2>
          <p>
            EcoVerse was founded in 2023 as a response to the growing need for sustainable living practices in urban communities. Our journey includes:
          </p>
          <ul className="history-list">
            <li>2023: Launched our digital platform with an initial focus on educational resources</li>
            <li>2024: Introduced community engagement features, allowing users to organize local events</li>
            <li>2025: Partnered with 50+ environmental organizations to expand our resource library</li>
            <li>2026: Reached 100,000 active users across multiple cities</li>
            <li>2027: Implemented AI-driven personalized sustainability recommendations</li>
            <li>Present: Continuing to grow and innovate in promoting sustainable urban living</li>
          </ul>
        </div>
        <div className="about-us-section">
          <h2 className="section-title">Our Values</h2>
          <ul className="values-list">
            <li><strong>Environmental Stewardship:</strong> Promoting responsible use and protection of the natural environment</li>
            <li><strong>Community Empowerment:</strong> Equipping individuals with knowledge and tools for sustainable living</li>
            <li><strong>Innovation:</strong> Continuously seeking new solutions to environmental challenges</li>
            <li><strong>Inclusivity:</strong> Ensuring sustainability is accessible and relevant to all community members</li>
            <li><strong>Collaboration:</strong> Fostering partnerships between residents, organizations, and local governments</li>
            <li><strong>Education:</strong> Prioritizing ongoing learning and awareness about environmental issues</li>
            <li><strong>Transparency:</strong> Maintaining open communication about our goals, progress, and challenges</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;