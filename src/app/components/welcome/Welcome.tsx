import React from "react";

interface WelcomeProps {
  name: string;
  //   date: Date;
}

const Welcome: React.FC<WelcomeProps> = ({ name }) => {
  return (
    <>
      <div className="flex gap-x-4">
        <h1 className="text-3xl font-bold text-orange-500">Welcome {name}</h1>
        <div className="flex font-semibold items-center text-gray-400">
          Friday, September 6th
        </div>
      </div>
    </>
  );
};

export default Welcome;
