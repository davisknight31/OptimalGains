"use client";
import React, { useState } from "react";
import { Routine } from "@/app/types/routine";
import ButtonComponent from "../shared-components/Button";
import { navigateEditRoutines } from "@/app/utils/navigationActions";
import { useUser } from "@/app/contexts/UserContext";
import Spinner from "./Spinner";
import trashIcon from "../../assets/trashIcon_Black.png";
import Modal from "./Modal";
import Button from "../shared-components/Button";
import {
  deleteRoutine,
  deleteWorkoutExercises,
  deleteWorkouts,
  getRoutines,
} from "@/app/services/apiService";

interface RoutineListProps {
  routines: Routine[];
  loading?: boolean;
  refreshRoutines: () => Promise<void>;
}

const placeholderRoutine: Routine = {
  routineId: 0,
  routineName: "",
  lengthInDays: 0,
  workouts: [],
};

const RoutlineList: React.FC<RoutineListProps> = ({
  routines,
  loading,
  refreshRoutines,
}) => {
  const [routineToDelete, setRoutineToDelete] =
    useState<Routine>(placeholderRoutine);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  function handleEditNavigation(routineId: number) {
    navigateEditRoutines(routineId);
  }

  async function removeRoutine(routine: Routine) {
    const workoutExerciseIds = routine?.workouts.flatMap((workout) =>
      workout.workoutExercises.map(
        (workoutExercise) => workoutExercise.workoutExerciseId
      )
    );

    const filteredWorkoutExerciseIds: number[] =
      workoutExerciseIds?.filter((id): id is number => id !== undefined) ?? [];

    const workoutIds = routine?.workouts.flatMap(
      (workout) => workout.workoutId
    );

    const filteredWorkoutIds: number[] =
      workoutIds?.filter((id): id is number => id !== undefined) ?? [];

    console.log(filteredWorkoutExerciseIds);
    console.log(filteredWorkoutIds);
    console.log(routine.routineId);
    await deleteWorkoutExercises(filteredWorkoutExerciseIds);
    await deleteWorkouts(filteredWorkoutIds);
    await deleteRoutine(routine.routineId);
    await refreshRoutines();

    setShowDeleteModal(false);
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-orange-500">Routines</h1>
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <>
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
                        handleClick={() =>
                          handleEditNavigation(routine.routineId)
                        }
                        customStyles="p-0 pt-1 pb-1 rounded-md"
                      ></ButtonComponent>
                    </td>
                    <td>
                      <img
                        className="hover:cursor-pointer min-w-6"
                        src={trashIcon.src}
                        width={24}
                        height={24}
                        alt="delete"
                        onClick={() => {
                          setRoutineToDelete(routine);
                          setShowDeleteModal(true);
                        }}
                      ></img>
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
      )}
      <Modal showModal={showDeleteModal}>
        <p className="font-bold text-2xl text-center pb-5">
          Confirm the deletion of{" "}
          <span className="text-orange-400">
            {routineToDelete?.routineName}
          </span>
          ?
        </p>
        <div className="w-full flex gap-5">
          <Button
            label="Deny"
            handleClick={() => setShowDeleteModal(false)}
            customStyles="text-white"
          ></Button>
          <Button
            label="Confirm"
            handleClick={() => removeRoutine(routineToDelete)}
            customStyles="text-white"
          ></Button>
        </div>
      </Modal>
    </>
  );
};

export default RoutlineList;
