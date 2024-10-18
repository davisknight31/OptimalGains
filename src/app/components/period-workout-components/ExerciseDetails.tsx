// "use client";
import { Exercise } from "@/app/types/exercise";
import { PeriodExercise } from "@/app/types/periodExercise";
import { WorkoutExercise } from "@/app/types/workoutExercise";
import React, { useEffect, useState } from "react";

interface ExerciseDetailsProps {
  workoutExercise: WorkoutExercise;
  comparisonExercise: PeriodExercise;
  exercise: Exercise;
}

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({
  workoutExercise,
  comparisonExercise,
  exercise,
}) => {
  useEffect(() => {});
  return (
    <div className="bg-slate-50 rounded-2xl p-6 w-full">
      {exercise.exerciseName}
      {comparisonExercise.periodSets.map((set, setIndex) => (
        <div key={set.periodSetId} className="flex gap-3">
          <div>{set.setNumber}</div>
          <div>{set.targetReps}</div>
          <div>{set.actualReps}</div>
          <div>{set.weight}</div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseDetails;
