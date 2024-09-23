"use client";
import EditRoutine from "@/app/components/edit-routine-components/EditRoutine";
import Card from "@/app/components/shared-components/Card";
import Navbar from "@/app/components/shared-components/Navbar";
import PageContainer from "@/app/components/shared-components/PageContainer";
import { useUser } from "@/app/contexts/UserContext";
import { Routine } from "@/app/types/routine";
import { navigateLogin, navigateRoutines } from "@/app/utils/navigationActions";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditRoutinePage: React.FC = () => {
  const { isLoggedIn, user } = useUser();
  const [routineIdExists, setRoutineIdExists] = useState(false);
  const [routineToEdit, setRoutineToEdit] = useState<Routine | undefined>();
  const searchParams = useSearchParams();
  const routineId = searchParams.get("routineId");

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
  });

  useEffect(() => {
    console.log("routine id: ", routineId);
    //if a routine was passed, either through edit click or url editing
    if (routineId) {
      const parsedRoutineId = parseInt(routineId);

      //if in user routines a routine is found that matches the url's routineId, good
      //otherwise set to undefined, as the routineId does not belong to the current user.
      const retrievedRoutine = user?.routines
        ? user?.routines.find(
            (routine) => routine.routineId === parsedRoutineId
          )
        : undefined;
      if (retrievedRoutine === undefined) {
        navigateRoutines();
      } else {
        setRoutineToEdit(retrievedRoutine);
      }
    }
    //find the routine by the params routineId
    //first check if an id was even passed, if none was passed you know to create new
    //if an id was passed, edit that routine
    //first find the routine by the id
    //if found, edit as normal
    //if not, redirect back to the routines page since that means the user probably passed the id themselves in the url
  }, [routineId]);

  return (
    <>
      <Navbar></Navbar>
      <PageContainer>
        <Card>
          <EditRoutine routine={routineToEdit}></EditRoutine>
        </Card>
      </PageContainer>
    </>
  );
};
export default EditRoutinePage;
