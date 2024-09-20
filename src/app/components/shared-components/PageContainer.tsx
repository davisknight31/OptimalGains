// "use client";
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="w-11/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 m-auto">
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
