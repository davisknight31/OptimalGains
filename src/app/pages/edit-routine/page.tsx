"use client";
import EditRoutine from "@/app/components/edit-routine-components/EditRoutine";
import Card from "@/app/components/shared-components/Card";
import Navbar from "@/app/components/shared-components/Navbar";
import PageContainer from "@/app/components/shared-components/PageContainer";
import { useUser } from "@/app/contexts/UserContext";
import { getRoutines } from "@/app/services/apiService";
import { Routine } from "@/app/types/routine";
import { navigateLogin, navigateRoutines } from "@/app/utils/navigationActions";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditRoutinePage: React.FC = () => {
  const { isLoggedIn, user, setUser } = useUser();
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
  }, [routineId]);

  function refreshRoutines(): void {
    if (user) {
      getRoutines(user.userId).then((fetchedRoutines) => {
        setUser({ ...user, routines: fetchedRoutines });
        console.log(fetchedRoutines);
      });
    }
  }

  return (
    <>
      <Navbar></Navbar>
      <PageContainer>
        <Card>
          <EditRoutine
            routine={routineToEdit}
            refreshRoutines={refreshRoutines}
          ></EditRoutine>
        </Card>
      </PageContainer>
    </>
  );
};
export default EditRoutinePage;
