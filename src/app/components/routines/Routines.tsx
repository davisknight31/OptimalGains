import React from "react";
import { Routine } from "@/app/types/routine";

interface RoutinesProps {
  routines: Routine[];
}

const Routines: React.FC<RoutinesProps> = ({ routines }) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-orange-500">Routines</h1>
      {routines.map((routine) => (
        <div key={routine.routineId}>{routine.routineName}</div>
      ))}
    </>
  );
};

export default Routines;
