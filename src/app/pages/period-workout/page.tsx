"use client";
import Exercise from "@/app/components/period-workout-components/ExerciseDetails";
import Card from "@/app/components/shared-components/Card";
import Navbar from "@/app/components/shared-components/Navbar";
import PageContainer from "@/app/components/shared-components/PageContainer";
import { useUser } from "@/app/contexts/UserContext";
import { Period } from "@/app/types/period";
import { PeriodExercise } from "@/app/types/periodExercise";
import { PeriodSet } from "@/app/types/periodSet";
import { PeriodWorkout } from "@/app/types/periodWorkout";
import { Routine } from "@/app/types/routine";
import { Workout } from "@/app/types/workout";
import { getCurrentDate } from "@/app/utils/helpers";
import { navigateLogin } from "@/app/utils/navigationActions";
import React, { useEffect, useState } from "react";

const PeriodWorkoutPage: React.FC = () => {
  // IF IN THIS PAGE, THEN THERE HAS TO BE AN ACTIVE PERIOD AND AT LEAST ONE ROUTINE
  // SO IT IS OKAY TO ASSUME THIS AND TELL TYPESCRIPT
  const { isLoggedIn, user, exercises } = useUser();
  const [activePeriod, setActivePeriod] = useState<Period>();
  const [activePeriodsAssociatedRoutine, setActivePeriodsAssociatedRoutine] =
    useState<Routine>();

  const [recentPeriodWorkoutExercises, setRecentPeriodWorkoutExercises] =
    useState<PeriodExercise[]>([]);
  const [recentPeriodExerciseSets, setRecentPeriodExerciseSets] = useState<
    PeriodSet[]
  >([]);

  const [presentWorkout, setPresentWorkout] = useState<Workout>();
  const [comparisonWorkout, setComparisonWorkout] = useState<PeriodWorkout>();

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
    //finds and sets what the current active period is
    const activePeriod = findActivePeriod();
    findActivePeriodsAssociatedRoutine(activePeriod);
  });

  useEffect(() => {
    if (activePeriod && activePeriodsAssociatedRoutine) {
      //sorts the PERIOD workouts by date
      const sortedPeriodWorkouts = sortWorkoutsByDate();

      //if the length of the sorted period workouts is greater than 0
      //this check ensures that there has been a previous workout that can be used to determine what this workout should be
      if (sortedPeriodWorkouts.length > 0) {
        //set the most recent period workout
        const recentPeriodWorkout = sortedPeriodWorkouts[0];
        const recentAssociatedWorkoutsPositionInRoutine =
          findAssociatedWorkoutPositionInRoutine(recentPeriodWorkout);

        const foundPresentWorkout = findNextWorkout(
          recentAssociatedWorkoutsPositionInRoutine
        );
        //finds the previous workout of the same day/id, and sets comparisonWorkout
        findComparisonWorkout(sortedPeriodWorkouts, foundPresentWorkout!);
      } else {
        const firstWorkout = findFirstWorkout();
        setPresentWorkout(firstWorkout);
      }
    }
  }, [activePeriod, activePeriodsAssociatedRoutine]);

  useEffect(() => {
    console.log(presentWorkout);
    console.log(comparisonWorkout);
  }, [presentWorkout, comparisonWorkout]);

  function findActivePeriod(): Period {
    const foundActivePeriod = user?.periods.find((period) => period.active);
    if (foundActivePeriod) {
      setActivePeriod(foundActivePeriod);
    }
    return foundActivePeriod!;
  }

  function findActivePeriodsAssociatedRoutine(activePeriod: Period): void {
    const associatedRoutine = user?.routines!.find(
      (routine) => routine.routineId === activePeriod.routineId
    );
    setActivePeriodsAssociatedRoutine(associatedRoutine);
  }

  function findComparisonWorkout(
    workouts: PeriodWorkout[],
    currentWorkout: Workout
  ): void {
    const allSameDayWorkouts = workouts.filter(
      (workout) => workout.workoutId === currentWorkout.workoutId
    );
    console.log(allSameDayWorkouts);

    const sortedSameDayWorkouts = allSameDayWorkouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setComparisonWorkout(sortedSameDayWorkouts[0]);
  }

  function sortWorkoutsByDate(): PeriodWorkout[] {
    const sortedWorkouts = activePeriod?.periodWorkouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sortedWorkouts || [];
  }

  function findAssociatedWorkoutPositionInRoutine(
    recentWorkout: PeriodWorkout
  ): number {
    const associatedWorkout = user!
      .routines!.flatMap((routine) => routine.workouts)
      .find((workout) => workout.workoutId === recentWorkout.workoutId);

    return associatedWorkout?.positionInRoutine!;
  }

  function findNextWorkout(
    previousWorkoutPositionInRoutine: number
  ): Workout | undefined {
    const lastPosition = Math.max(
      ...(activePeriodsAssociatedRoutine?.workouts.map(
        (workout: Workout) => workout.positionInRoutine
      ) || [0])
    );
    console.log(previousWorkoutPositionInRoutine);

    const nextWorkoutPosition =
      previousWorkoutPositionInRoutine === lastPosition
        ? 1
        : previousWorkoutPositionInRoutine + 1;

    const nextPositionWorkout = activePeriodsAssociatedRoutine?.workouts.find(
      (workout) => workout.positionInRoutine === nextWorkoutPosition
    );

    setPresentWorkout(nextPositionWorkout);
    return nextPositionWorkout;
  }

  function findFirstWorkout(): Workout {
    const firstWorkout = activePeriodsAssociatedRoutine?.workouts.find(
      (workout) => workout.positionInRoutine === 1
    );
    console.log(firstWorkout);

    // can ! since there always be a position 1 workout
    return firstWorkout!;
  }

  //   function getCurrentDate(): string {
  //     const date = new Date();
  //     const dayOfTheWeek = date.toLocaleString("en-us", { weekday: "long" });
  //     const month = date.toLocaleString("en-us", { month: "long" });
  //     const dayOfTheMonth = date.getDate();

  //     const lastDigitOfDay = dayOfTheMonth % 10;
  //     const suffix =
  //       ~~((dayOfTheMonth % 100) / 10) === 1
  //         ? "th"
  //         : lastDigitOfDay === 1
  //         ? "st"
  //         : lastDigitOfDay === 2
  //         ? "nd"
  //         : lastDigitOfDay === 3
  //         ? "rd"
  //         : "th";

  //     return dayOfTheWeek + ", " + month + " " + dayOfTheMonth + suffix;
  //   }

  return (
    <>
      <main>
        <Navbar></Navbar>
        <PageContainer>
          <div className="flex flex-col gap-7">
            <Card>
              <h1 className="text-3xl font-bold text-orange-500">
                {presentWorkout?.workoutName}
              </h1>
              {getCurrentDate()}
              {presentWorkout?.workoutExercises.map(
                (workoutExercise, workoutExerciseIndex) => (
                  <div key={workoutExercise.workoutExerciseId}>
                    <Exercise
                      workoutExercise={workoutExercise}
                      comparisonExercise={
                        comparisonWorkout?.periodExercises.find(
                          (exercise) =>
                            exercise.workoutExerciseId ===
                            workoutExercise.workoutExerciseId
                        )!
                      }
                      exercise={
                        exercises.find(
                          (exercise) =>
                            exercise.exerciseId === workoutExercise.exerciseId
                        )!
                      }
                    ></Exercise>
                  </div>
                )
              )}
            </Card>
          </div>
        </PageContainer>
      </main>
    </>
  );
};

export default PeriodWorkoutPage;
