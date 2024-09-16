export interface Routine {
  routineId: number;
  routineName: string;
  daysPerWeek: number;
  //moredata
  //moredata
  //   days: Day[];
}

interface Day {
  dayName: string;
  exercises: Exercise[];
}

interface Exercise {
  exerciseName: string;
  muscleGroup: string;
}
