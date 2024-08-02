// AboutUs.jsx
import React from "react";
import '../home.css'; // Use the same CSS file if styles are shared
import HeroSection from '../hero.jsx'; // If you want to reuse the hero section

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <HeroSection>
        {/* You can customize the HeroSection for the About Us page if needed */}
      </HeroSection>
      <section className="about-us-content">
        <h1>About Us</h1>
        <p>
          Welcome to [Organization's Name], where our mission is to [describe the mission or purpose of the organization]. Our organization was founded in [year] with the goal of [describe goals or objectives].
        </p>
        <h2>Our History</h2>
        <p>
          [Provide a brief history of the organization, including key milestones and achievements.]
        </p>
        <h2>Our Team</h2>
        <p>
          [Introduce the team members, their roles, and any other relevant information.]
        </p>
        <h2>Our Values</h2>
        <p>
          [Describe the core values that guide the organization's work.]
        </p>
        {/* Add more sections as needed */}
      </section>
    </div>
  );
};

export default AboutUs;
