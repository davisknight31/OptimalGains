"use client";
import Exercise from "@/app/components/period-workout-components/ExerciseDetails";
import ButtonComponent from "@/app/components/shared-components/Button";
import Card from "@/app/components/shared-components/Card";
import CoverSpinner from "@/app/components/shared-components/CoverSpinner";
import Input from "@/app/components/shared-components/Input";
import Navbar from "@/app/components/shared-components/Navbar";
import PageContainer from "@/app/components/shared-components/PageContainer";
import { useUser } from "@/app/contexts/UserContext";
import { inputStyles } from "@/app/docs/PreferencesData";
import { getPeriods, submitPeriodWorkout } from "@/app/services/apiService";
import { Period } from "@/app/types/period";
import { PeriodExercise } from "@/app/types/periodExercise";
import { PeriodSet } from "@/app/types/periodSet";
import { PeriodWorkout } from "@/app/types/periodWorkout";
import { Routine } from "@/app/types/routine";
import { Workout } from "@/app/types/workout";
import { getCurrentDate } from "@/app/utils/helpers";
import { navigateLogin, navigatePeriods } from "@/app/utils/navigationActions";
import React, { useEffect, useState } from "react";

const PeriodWorkoutPage: React.FC = () => {
  // IF IN THIS PAGE, THEN THERE HAS TO BE AN ACTIVE PERIOD AND AT LEAST ONE ROUTINE
  // SO IT IS OKAY TO ASSUME THIS AND TELL TYPESCRIPT
  const { isLoggedIn, user, setUser, exercises } = useUser();
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
  const [newPeriodWorkout, setNewPeriodWorkout] = useState<PeriodWorkout>();
  const [newPeriodExercises, setNewPeriodExercises] = useState<
    PeriodExercise[]
  >([]);
  const [newPeriodWorkoutName, setNewPeriodWorkoutName] = useState<string>();
  const [hasEmptyFields, setHasEmptyFields] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigateLogin();
    }
    //finds and sets what the current active period is
    const activePeriod = findActivePeriod();
    console.log(activePeriod?.periodId);
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
    console.log(newPeriodExercises);
    setNewPeriodWorkout({
      ...newPeriodWorkout,
      periodExercises: newPeriodExercises,
    } as PeriodWorkout);
    const hasAllReps = determineIfRepsFilled(newPeriodExercises);
    const hasAllWeights = determineIfWeightsFilled(newPeriodExercises);
    console.log(hasAllReps, hasAllWeights);
    hasAllReps && hasAllWeights && newPeriodWorkoutName
      ? setHasEmptyFields(false)
      : setHasEmptyFields(true);
  }, [newPeriodExercises]);

  useEffect(() => {
    console.log(newPeriodWorkout);
  }, [newPeriodWorkout]);

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

  function updateNewPeriodWorkout(
    updatedPeriodExercise: PeriodExercise | undefined
  ): void {
    console.log(updatedPeriodExercise);
    if (updatedPeriodExercise !== undefined) {
      if (
        newPeriodExercises.find(
          (exercise) =>
            exercise.workoutExerciseId ===
            updatedPeriodExercise.workoutExerciseId
        )
      ) {
        //if an exercise with the workoutExerciseId already exists
        //aka the exercise has already been added
        //then update it
        const existingExerciseIndex = newPeriodExercises.findIndex(
          (exercise) =>
            exercise.workoutExerciseId ===
            updatedPeriodExercise.workoutExerciseId
        );
        setNewPeriodExercises((prevExercises) => {
          const updatedExercises = [...prevExercises];
          updatedExercises[existingExerciseIndex] = updatedPeriodExercise;
          return updatedExercises;
        });
      } else {
        //otherwise add it to the array
        setNewPeriodExercises((prevExercises) => [
          ...prevExercises,
          updatedPeriodExercise,
        ]);
      }
    }
  }

  function determineIfRepsFilled(
    newPeriodExercises: PeriodExercise[]
  ): boolean {
    const allReps = newPeriodExercises.flatMap((exercise) =>
      exercise.periodSets.map((set) => set.actualReps)
    );
    const unfilledRep = allReps.find((rep) => rep === 0);
    const foundNaN = allReps.find((rep) => Number.isNaN(rep));
    const allRepsFilled =
      unfilledRep === 0 || Number.isNaN(foundNaN) ? false : true;
    return allRepsFilled;
  }

  function determineIfWeightsFilled(
    newPeriodExercises: PeriodExercise[]
  ): boolean {
    const allWeights = newPeriodExercises.flatMap((exercise) =>
      exercise.periodSets.map((set) => set.weight)
    );
    const foundNaN = allWeights.find((weight) => Number.isNaN(weight));
    const allWeightsFilled = Number.isNaN(foundNaN) ? false : true;
    return allWeightsFilled;
  }

  async function handlePeriodWorkoutSubmit(): Promise<void> {
    console.log(activePeriod?.periodId);
    console.log(newPeriodWorkout);
    console.log(newPeriodWorkoutName);

    if (
      activePeriod &&
      newPeriodWorkout &&
      newPeriodWorkoutName &&
      presentWorkout
    ) {
      setIsSubmitting(true);
      await submitPeriodWorkout(
        activePeriod?.periodId,
        presentWorkout.workoutId!,
        newPeriodWorkout,
        newPeriodWorkoutName
      );
      if (user) {
        await getPeriods(user.userId).then((fetchedPeriods) => {
          setUser({ ...user, periods: fetchedPeriods });
        });
      }
      navigatePeriods();
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <main>
        {isSubmitting && <CoverSpinner />}
        <Navbar></Navbar>
        <PageContainer>
          <div className="flex flex-col gap-7">
            <Card>
              <h1 className="text-3xl font-bold text-orange-500">
                {presentWorkout?.workoutName}
              </h1>
              <div className="mb-3 text-slate-500 font-bold">
                {getCurrentDate()}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Workout Name"
                  styles={inputStyles}
                  onChange={(newValue) => setNewPeriodWorkoutName(newValue)}
                ></Input>
              </div>
              {!comparisonWorkout &&
                presentWorkout?.workoutName !== "Rest Day" && (
                  <div>
                    {"This is the first workout for: " +
                      presentWorkout?.workoutName +
                      ". Use your best judgement and choose a starting weight reasonably below your 8 rep max for each exercise."}
                  </div>
                )}
              {presentWorkout?.workoutName === "Rest Day" && (
                <div>
                  {
                    "Confirm that you completed your rest day below. You may immediately move on to the next workout if necessary."
                  }
                </div>
              )}

              {presentWorkout?.workoutExercises.map(
                (workoutExercise, workoutExerciseIndex) => (
                  <div key={workoutExercise.workoutExerciseId}>
                    <Exercise
                      workoutExercise={workoutExercise}
                      comparisonExercise={comparisonWorkout?.periodExercises.find(
                        (exercise) =>
                          exercise.workoutExerciseId ===
                          workoutExercise.workoutExerciseId
                      )}
                      exercise={
                        exercises.find(
                          (exercise) =>
                            exercise.exerciseId === workoutExercise.exerciseId
                        )!
                      }
                      handleExerciseDataChange={updateNewPeriodWorkout}
                    ></Exercise>
                  </div>
                )
              )}
            </Card>
          </div>
        </PageContainer>
        <div className="m-5">
          <ButtonComponent
            label={
              presentWorkout?.workoutName === "Rest Day"
                ? "Confirm Rest Day"
                : "Finish Workout"
            }
            customStyles="bg-orange-500 rounded-xl p-3 text-white mt-4"
            handleClick={() => {
              handlePeriodWorkoutSubmit();
            }}
            isDisabled={hasEmptyFields}
          ></ButtonComponent>
        </div>
      </main>
    </>
  );
};

export default PeriodWorkoutPage;
