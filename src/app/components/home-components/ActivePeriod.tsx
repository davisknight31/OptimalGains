import React from "react";
import Button from "../shared-components/Button";
import { testLog } from "@/app/utils/helpers";
import { navigatePeriods } from "@/app/utils/navigationActions";
import { Period } from "@/app/types/period";
import Spinner from "../shared-components/Spinner";
import { Routine } from "@/app/types/routine";

interface ActivePeriodProps {
  period: Period | undefined;
  associatedRoutine: Routine | undefined;
  loading?: boolean;
  // routineName: string;
  // currentWeek: number;
  // totalWeeks: number;
  // nextWorkoutName: string;
}

const ActivePeriod: React.FC<ActivePeriodProps> = ({
  // routineName,
  // currentWeek,
  // totalWeeks,
  // nextWorkoutName,
  period,
  associatedRoutine,
  loading,
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-orange-500">Current Period</h1>
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <>
          {period && (
            <div className="flex flex-col mt-3 gap-5">
              <div className="text-gray-400 font-semibold text-lg">
                Name:&nbsp;
                <span className="text-black">{period.periodName}</span>
              </div>
              <div className="text-gray-400 font-semibold text-lg">
                Routine:&nbsp;
                <span className="text-black">
                  {associatedRoutine?.routineName}
                </span>
              </div>
              {/* <div className="text-gray-400 font-semibold text-lg">
              Progress:&nbsp;
              <span className="text-black">
                {currentWeek}/{totalWeeks} Weeks
              </span>
            </div> */}
              {/* <div className="text-gray-400 font-semibold text-lg">
              Next Workout:&nbsp;
              <span className="text-black">{nextWorkoutName}</span>
            </div> */}
              <div className="flex gap-5">
                <Button
                  handleClick={navigatePeriods}
                  label="View Periods"
                  customStyles="text-white p-3"
                ></Button>
                <Button
                  handleClick={testLog}
                  label="Start Next Workout"
                  customStyles="text-white p-3"
                ></Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ActivePeriod;
