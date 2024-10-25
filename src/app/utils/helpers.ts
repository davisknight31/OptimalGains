"use client";

import { Exercise } from "../types/exercise";
import { PeriodSet } from "../types/periodSet";

export function getCurrentDate(): string {
  const date = new Date();
  const dayOfTheWeek = date.toLocaleString("en-us", { weekday: "long" });
  const month = date.toLocaleString("en-us", { month: "long" });
  const dayOfTheMonth = date.getDate();

  const lastDigitOfDay = dayOfTheMonth % 10;
  const suffix =
    ~~((dayOfTheMonth % 100) / 10) === 1
      ? "th"
      : lastDigitOfDay === 1
      ? "st"
      : lastDigitOfDay === 2
      ? "nd"
      : lastDigitOfDay === 3
      ? "rd"
      : "th";

  return dayOfTheWeek + ", " + month + " " + dayOfTheMonth + suffix;
}

// export function calculateProgression(
//   exercise: Exercise,
//   periodSet: PeriodSet
// ): void {
//   console.log(exercise);
//   console.log(periodSet);

//   if (
//     exercise.progressionStyle === "Weight Priority" ||
//     (exercise.progressionStyle === "Repetition Priority" &&
//       periodSet.actualReps >= 18)
//   ) {
//     return determineNewWeight();
//     //increase by weight
//   } else {
//     //increase by reps
//   }
//   //in the future should probably have the exercise type on the exercises in the database
//   //that way it is known how to progress
//   //For example, dumbbells are harder to progress by an entire 5 pounds, especially for
//   //exercises that use lower weights like lateral raises. In this case, the reps should be
//   //progressed for a longer period of time FIRST.
//   //basic progression for now
// }

export function determineNewWeight(
  exercise: Exercise,
  periodSet: PeriodSet
): number {
  if (exercise.exerciseType === "Barbell") {
    return periodSet.weight + 5;
  }

  if (exercise.exerciseType === "Dumbbell") {
    return periodSet.weight + 5;
  }

  if (exercise.exerciseType === "Body Weight") {
    return periodSet.weight + 2.5;
  }

  if (exercise.exerciseType === "Stack") {
    return periodSet.weight + 5;
  }

  if (exercise.exerciseType === "Plate Loaded") {
    return periodSet.weight + 2.5;
  }

  if (exercise.exerciseType === "Plate") {
    return periodSet.weight + 5;
  }
  return periodSet.weight + 5;
}

export function determineNewReps(periodSet: PeriodSet) {
  return periodSet.actualReps + 1;
}
