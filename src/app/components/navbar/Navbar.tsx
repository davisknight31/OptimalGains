"use client";
import React from "react";
import "./Navbar.css";
import Link from "next/link";

// interface NavbarProps {
//   children: React.ReactNode;
// }

const Navbar: React.FC = () => {
  return (
    <div className="navigation-wrapper">
      <nav className="navigation">
        <h1 className="logo">Optimal Gains</h1>
        <div className="navigation-link-wrapper">
          <Link className="navigation-link" href="/pages/home">
            Dashboard
          </Link>
        </div>

        <div className="navigation-link-wrapper">
          <Link className="navigation-link" href="/pages/login">
            Current Period
          </Link>
        </div>
        <div className="navigation-link-wrapper">
          <Link className="navigation-link" href="/pages/login">
            Routines
          </Link>
        </div>
        <div className="navigation-link-wrapper profile">
          <Link className="navigation-link" href="/pages/login">
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
