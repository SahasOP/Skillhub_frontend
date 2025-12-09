import React from 'react';
import clglogo from '../assets/sakecLogo.png';
import blueclglogo from '../assets/logoL.png';

function Header() {
    return (
        <header
                className="flex items-center justify-between px-4"
                style={{
                  background: "linear-gradient(270deg, #002f6c, #0d47a1)",
                }}
              >
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Mahavir Education Trust's
                  </h1>
                  <h2 className="text-3xl font-bold text-blue-100">
                    Shah And Anchor Kutchhi Engineering College
                  </h2>
                </div>
                <img src={blueclglogo} alt="College Logo" className="my-4 h-24 w-24" />
              </header>
    );
}

export default Header;
