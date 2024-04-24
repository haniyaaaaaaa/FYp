import React from "react";
import Gallery from "./Gallery";
import NavbarNormalvictim from "../NavbarNormalvictim";
import Footer from "../Footer";

export default function index() {
  return (
    <div>
      <NavbarNormalvictim />
      {/* black div */}

      <div
        style={{

          background: 'linear-gradient(to right, #000000, #333333)',
          color: 'white',
          padding: '75px 88px',
          height: '40vh',
        }}
      >
        {/* Heading */}
        <h1 style={{ color: 'rgba(59, 177, 155, 1)', marginLeft: '30px', marginTop: '10px', fontSize: '55px' }}>FLOOD RESILIENT HOME: VIDEO LIBRARY</h1>

        {/* Description */}
        <div style={{ marginLeft: '30px', marginTop: '20px' }}>
          <p style={{ fontSize: '20px' }}>
            Explore virtual simulations showcasing resilient infrastructure
            designs and adaptive urban planning strategies,
          </p>
          <p style={{ fontSize: '20px', lineHeight: '0' }}>
            offering insights into how communities can thrive amidst flood
            challenges.</p>
        </div>

      </div>

      <Gallery />
      <Footer />
    </div>
  );
}
