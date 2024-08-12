import React from "react";
import '../home.css';
import HeroSection from '../hero.jsx';
import '../ContactUs.css';
import ContactUsImage from '../assets/ContactUs.jpeg'; // Adjust the path as needed

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <HeroSection>
        {/* You can customize the HeroSection for the Contact Us page if needed */}
      </HeroSection>
      <section className="contact-us-content">
        <div className="contact-us-header">
          <img src={ContactUsImage} alt="Contact Us" className="contact-us-image" />
          <h1 className="contact-us-title">Contact Us</h1>
        </div>
        <div className="google-map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d498.5955857643846!2d103.84144943491822!3d1.3167871000000229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19e880b02a3b%3A0x244d612ce50b78ae!2s36%20Newton%20Rd%2C%20Singapore%20307964!5e0!3m2!1sen!2ssg!4v1723436194987!5m2!1sen!2ssg" 
            width="100%" 
            height="450" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy">
          </iframe>
        </div>
        <div className="contact-details">
          <div className="contact-column">
            <h2>Office Hours</h2>
            <p>Monday - Friday: 8:00am-9:30pm</p>
            <p>Saturday & Sunday: 8:30am-12:30pm</p>
          </div>
          <div className="contact-column">
            <h2>Location of HQ</h2>
            <p>36 Newton Rd</p>
            <p>Singapore 307964</p>
          </div>
          <div className="contact-column">
            <h2>Contact</h2>
            <p>Office: +65 6755 0330</p>
            <p>Email: services@ecoverse.com.sg</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;