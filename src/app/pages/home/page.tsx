"use client";
import React, { useEffect, useState } from "react";
import PageContainer from "@/app/components/shared-components/PageContainer";
import Card from "@/app/components/shared-components/Card";
import Welcome from "@/app/components/home-components/Welcome";
import ActivePeriod from "@/app/components/home-components/ActivePeriod";
import RoutineList from "@/app/components/shared-components/RoutineList";
import { Routine } from "@/app/types/routine";
import Navbar from "@/app/components/shared-components/Navbar";
import { useUser } from "@/app/contexts/UserContext";
import { navigateLogin } from "@/app/utils/navigationActions";
import {
  getAllExercises,
  getPeriods,
  getRoutines,
} from "@/app/services/apiService";
import { Exercise } from "@/app/types/exercise";
import { User } from "@/app/types/user";
import { Period } from "@/app/types/period";

const HomePage: React.FC = () => {
  const { isLoggedIn, user, setUser, exercises, setExercises } = useUser();
  const [isFetching, setIsFetching] = useState(true);
  const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
  const [activePeriod, setActivePeriod] = useState<Period>();
  // const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
  });

  useEffect(() => {
    if (user && !user.routines && !user.periods) {
      const promises = [getRoutines(user.userId), getPeriods(user.userId)];
      Promise.all(promises).then(([routines, periods]) => {
        setUser({
          ...user,
          routines: routines,
          periods: periods,
        } as User); // as User is needed because in UserContext, the user is initially undefined
      });

      getAllExercises().then((fetchedExercises) => {
        setExercises(fetchedExercises);
      });
    }
  }, []);

  useEffect(() => {
    console.log(user?.routines, user?.periods, exercises, activePeriod);
    console.log(
      exercises.filter((exercise) => exercise.exerciseType === "Plate")
    );
    if (user?.periods && !activePeriod) {
      const foundActivePeriod: Period = user.periods.find(
        (period) => period.active
      ) || {
        periodId: 0,
        userId: 0,
        routineId: 0,
        periodName: "No Active Period",
        dateStarted: new Date(),
        dateStopped: new Date(),
        lengthInWeeks: 0,
        active: false,
        completed: false,
        periodWorkouts: [],
      };
      console.log(foundActivePeriod);
      if (foundActivePeriod) {
        setActivePeriod(foundActivePeriod);
      }
    }
    if (user?.routines && user.periods && exercises && activePeriod) {
      //could alter this so that there are separate isFetching bools for periods and routines
      setIsFetching(false);
    }
  }, [user, exercises, activePeriod]);

  useEffect(() => {
    console.log(isFetching);
  }, [isFetching]);

  async function refreshRoutines() {
    if (user) {
      await getRoutines(user.userId).then((fetchedRoutines) => {
        setUser({ ...user, routines: fetchedRoutines });
      });
    }
  }

  return (
    <main>
      <Navbar></Navbar>
      <PageContainer>
        <div className="flex flex-col gap-7">
          <Card>
            <Welcome name={user?.firstName}></Welcome>
          </Card>
          <Card>
            <ActivePeriod
              period={activePeriod}
              associatedRoutine={user?.routines?.find(
                (routine) => routine.routineId === activePeriod?.routineId
              )}
              loading={isFetching}
            ></ActivePeriod>
          </Card>
          <Card>
            <RoutineList
              routines={user?.routines || []}
              loading={isFetching}
              refreshRoutines={refreshRoutines}
            />
          </Card>
        </div>
      </PageContainer>
    </main>
  );
};

export default HomePage;
