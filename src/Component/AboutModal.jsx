import React from 'react';
import './Login.css'; // reuse the same modal styles
import img from '../assets/image.png';

const AboutModal = ({ onClose }) => {
  return (
    <div className="login-modal-backdrop">
      <div
        className="login-modal-container shadow-lg position-relative p-4 d-flex"
        style={{ maxWidth: '1200px', margin: '0 auto', justifyContent: 'space-between' }} // To increase width and align content
      >
        <button className="btn btn-sm btn-light position-absolute top-0 start-0 m-2" onClick={onClose}>
          ← Back
        </button>

        {/* Left side: About Company with Image */}
        <div className="w-50 pe-4" style={{ fontSize: '14px' }}> {/* Reduced font size */}
          <h4 className="fw-bold" style={{ fontSize: '20px', marginLeft:"100px"}}>About Good Will Lining</h4>
          <img
            src={img}
            alt="Good Will Lining"
            style={{
              width: '360px',
              
              height: '400px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: Adds shadow around the image
            }}
            className="img-fluid my-3"
          />
          <p className="mt-3">
            Good Will Lining (GWL) is a leading name in bespoke sofa manufacturing and interior works, with over a decade of expertise. We bring to you crumached quality furniture, individually crafted using hand-picked materials.
          </p>
        
          <ul>
            <li>Customer First</li>
            <li>Craftsmanship Excellence</li>
            <li>Transparency & Trust</li>
            <li>Continuous Innovation</li>
          </ul>
        </div>

        {/* Right side: Contact & Founder Message */}
        <div className="w-50 ps-4" style={{ fontSize: '14px' }}> {/* Reduced font size */}
          <h5 style={{ fontSize: '18px' }}>Contact Us</h5>
          <p>
            📧 <strong>Email:</strong> suryasurya20092005@gmail.com
            <br />
            📞 <strong>Phone:</strong> 9025657078
            <br />
            📍 <strong>Location:</strong> Tirunelveli, Tamil Nadu
          </p>

          <h5 style={{ fontSize: '18px' }}>Why Choose Us?</h5>
          <ul>
            <li>10+ Years of Experience</li>
            <li>5000+ Sofas Delivered</li>
            <li>98% Customer Satisfaction</li>
            <li>100% Quality Inspection</li>
          </ul>

          <h5 style={{ fontSize: '18px' }}>Founder’s Message</h5>
          <p>
            "As a passionate craftsman, I started Good Will Lining with one goal: creating sofas that speak comfort and elegance."
            <br />
            — J Karthik P., Founder
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
