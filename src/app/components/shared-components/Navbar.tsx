"use client";
import React from "react";
import Link from "next/link";

// interface NavbarProps {
//   children: React.ReactNode;
// }

const Navbar: React.FC = () => {
  return (
    <div className="bg-white shadow-md mb-10">
      <nav className="flex sticky w-3/5 bg-white pt-5 pb-5 m-auto gap-5">
        <h1 className="text-2xl font-bold text-orange-500">Optimal Gains</h1>
        <div className="flex items-center">
          <Link className="text-gray-400 font-semibold" href="/">
            Dashboard
          </Link>
        </div>

        <div className="flex items-center">
          <Link className="text-gray-400 font-semibold" href="/pages/login">
            Current Period
          </Link>
        </div>
        <div className="flex items-center">
          <Link className="text-gray-400 font-semibold" href="/pages/routines">
            Routines
          </Link>
        </div>
        <div className="flex items-center ml-auto">
          <Link className="text-gray-400 font-semibold" href="/pages/login">
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
