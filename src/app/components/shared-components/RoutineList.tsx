"use client";
import React from "react";
import { Routine } from "@/app/types/routine";
import ButtonComponent from "../shared-components/Button";
import { navigateEditRoutines } from "@/app/utils/navigationActions";

interface RoutineListProps {
  routines: Routine[];
}

function handleEditNavigation(routineId: number) {
  navigateEditRoutines(routineId);
}

const RoutlineList: React.FC<RoutineListProps> = ({ routines }) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-orange-500">Routines</h1>
      {routines.length > 0 ? (
        <table className="w-full">
          <tbody className="[&>*:nth-child(even)]:bg-slate-50">
            {routines.map((routine) => (
              <tr key={routine.routineId}>
                <td className="font-bold text-xl p-3 pt-5 pb-5 w-fit">
                  {routine.routineName}
                </td>
                <td className="p-3 pt-5 pb-5">
                  <ButtonComponent
                    label="Edit"
                    handleClick={() => handleEditNavigation(routine.routineId)}
                    customStyles="p-0 pt-1 pb-1 rounded-md "
                  ></ButtonComponent>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="pt-5 font-bold text-xl">You have no routines</div>
      )}
      <div className="pt-5">
        <ButtonComponent
          label="Create New Routine"
          handleClick={navigateEditRoutines}
          customStyles=""
        ></ButtonComponent>
      </div>
    </>
  );
};

export default RoutlineList;
