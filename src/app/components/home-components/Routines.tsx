import React, { useEffect, useState } from "react";
import { Routine } from "@/app/types/routine";
import Spinner from "../shared-components/Spinner";
import ButtonComponent from "../shared-components/Button";
import { navigateRoutines } from "@/app/utils/navigationActions";

interface RoutinesProps {
  routines: Routine[];
}

const Routines: React.FC<RoutinesProps> = ({ routines }) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-orange-500">Routines</h1>
      {routines.length === 0 && <Spinner />}

      {routines.length > 0 && (
        <>
          {routines.map((routine) => (
            <div key={routine.routineId}>{routine.routineName}</div>
          ))}
          <ButtonComponent
            label="Create New Routine"
            handleClick={navigateRoutines}
          ></ButtonComponent>
        </>
      )}
    </>
  );
};

export default Routines;
