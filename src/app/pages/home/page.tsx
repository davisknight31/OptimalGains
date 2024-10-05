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
import { getAllExercises, getRoutines } from "@/app/services/apiService";
import { Exercise } from "@/app/types/exercise";

const HomePage: React.FC = () => {
  const { isLoggedIn, user, setUser, exercises, setExercises } = useUser();
  const [isFetching, setIsFetching] = useState(true);
  const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
  // const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
  });

  useEffect(() => {
    if (user && !user.routines) {
      getRoutines(user.userId).then((fetchedRoutines) => {
        setUser({ ...user, routines: fetchedRoutines });
        console.log(fetchedRoutines);
      });
    }
    getAllExercises().then((fetchedExercises) => {
      console.log(fetchedExercises);
      setExercises(fetchedExercises);
    });
  }, []);

  useEffect(() => {
    if (user?.routines && exercises) {
      setIsFetching(false);
    }
  }, [user, exercises]);

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
              routineName="MyRoutine"
              currentWeek={6}
              totalWeeks={8}
              nextWorkoutName="Chest and triceps"
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
