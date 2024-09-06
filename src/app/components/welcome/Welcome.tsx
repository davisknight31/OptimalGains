import React from "react";
import "./Welcome.css";

interface WelcomeProps {
  name: string;
  //   date: Date;
}

const Welcome: React.FC<WelcomeProps> = ({ name }) => {
  return (
    <>
      <div className="welcome-wrapper">
        <h1 className="welcome-name">Welcome {name}</h1>
        <div className="welcome-date">Friday, September 6th</div>
      </div>
    </>
  );
};

export default Welcome;
