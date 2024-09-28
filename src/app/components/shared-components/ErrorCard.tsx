// "use client";
import React from "react";

interface ErrorCardProps {
  message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  return (
    <div className="bg-red-100 text-red-500 rounded-2xl p-4 w-full border-2 border-red-500">
      {message}
    </div>
  );
};

export default ErrorCard;
