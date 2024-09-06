// "use client";
import React from "react";
import "./PageContainer.css";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="page-container">
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
