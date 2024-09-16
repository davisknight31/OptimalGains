// "use client";
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="w-3/5 m-auto">
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
