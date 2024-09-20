// "use client";
import React from "react";

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="bg-white rounded-2xl p-6 w-full">{children}</div>;
};

export default Card;
