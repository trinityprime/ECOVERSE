import React from "react";
import './footer.css';
import fb from './assets/facebook.png';
import twitter from './assets/twitter.png';
import insta from './assets/instagram.png';
const Footer = () => {
    return (
        <div className="footer">
            <div className="sb__footer section__padding">
                <div className="sb__footer-links">
                    <div className="sb__footer-links_div">
                        <h4>For Business</h4>
                        <a href="/healthplan">
                            <p>Contact us</p>
                        </a>
                        <a href="/individual">
                            <p>Individual</p>
                        </a>
                    </div>
                    {/* <div className="sb__footer-links_div">
                        <h4>Resources</h4>
                        <a href="/resource">
                            <p>Rescource center</p>
                        </a>
                        <a href="/resource">
                            <p>Testimonials</p>
                        </a>
                        <a href="/resource">
                            <p>STV</p>
                        </a>
                    </div> */}
                    <div className="sb__footer-links_div">
                        <h4>Partners</h4>
                        <a href="https://www.onepa.gov.sg/" target="_blank" rel="noopener noreferrer">
                            <p>onePA</p>
                        </a>
                        <a href="https://www.nea.gov.sg/" target="_blank" rel="noopener noreferrer">
                            <p>National Environment Agency</p>
                        </a>
                        <a href="https://www.nationalgeographic.com/environment/article/green-urban-landscape-cities-Singapore" target="_blank" rel="noopener noreferrer">
                            <p>National Geographic</p>
                        </a>
                    </div>

                    <div className="sb__footer-links_div">
                        <h4>Company</h4>
                        <a href="/aboutus">
                            <p>About us</p>
                        </a>
                    </div>
                    <div className="sb__footer-links_div">
                        <h4>Coming soon on</h4>
                        <div className="socialmedia">
                            <p><img src={fb} alt="" /></p>
                            <p><img src={twitter} alt="" /></p>
                            <p><img src={insta} alt="" /></p>
                        </div>
                    </div>
                </div>
                <hr></hr>

                <div className="sb__footer-below">
                    <div className="sb__footer-copyright">
                        <p>
                            @{new Date().getFullYear()} Ecoverse. All right reserved.
                        </p>
                    </div>
                    <div className="sb__footer-below-links">
                        <a href="/terms"><div><p>Terms & Conditions</p></div></a>
                        <a href="/privacy"><div><p>Privacy</p></div></a>
                        <a href="/security"><div><p>Security</p></div></a>
                        <a href="/cookie"><div><p>Cookie Declaration</p></div></a>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Footer;