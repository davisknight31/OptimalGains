"use client";
import React from "react";
import "./Button.css";

interface ButtonProps {
  label: string;
  handleClick: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  handleClick = () => {},
}: ButtonProps) => {
  return (
    <>
      <button
        className="button"
        onClick={() => {
          handleClick();
        }}
      >
        {label}
      </button>
    </>
  );
};

export default Button;
