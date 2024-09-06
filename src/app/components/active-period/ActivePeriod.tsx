import React from "react";
import "./ActivePeriod.css";
import Button from "../button/Button";

interface ActivePeriodProps {
  routineName: string;
  currentWeek: number;
  totalWeeks: number;
  nextWorkoutName: string;
}

const ActivePeriod: React.FC<ActivePeriodProps> = ({
  routineName,
  currentWeek,
  totalWeeks,
  nextWorkoutName,
}) => {
  const onClick = async () => {
    "use server";
    console.log("we logged");
  };

  return (
    <>
      <div className="active-period-wrapper">
        <h1 className="active-period-header">Current Period</h1>
        <div className="active-period-info">
          <div className="active-period-info-item">
            Routine:&nbsp;
            <span className="active-period-info-data">{routineName}</span>
          </div>
          <div className="active-period-info-item">
            Progress:&nbsp;
            <span className="active-period-info-data">
              {currentWeek}/{totalWeeks} Weeks
            </span>
          </div>
          <div className="active-period-info-item">
            Next Workout:&nbsp;
            <span className="active-period-info-data">{nextWorkoutName}</span>
          </div>
          <div className="active-period-info-item">
            <Button handleClick={onClick} label="Start Next Workout"></Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivePeriod;
