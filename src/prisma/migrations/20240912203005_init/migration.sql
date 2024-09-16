-- CreateTable
CREATE TABLE "Exercises" (
    "exerciseId" SERIAL NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "targetMuscleGroup" TEXT NOT NULL,
    "setup" TEXT NOT NULL,
    "execution" TEXT NOT NULL,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("exerciseId")
);

-- CreateTable
CREATE TABLE "Users" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Routines" (
    "routineId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "routineName" TEXT NOT NULL,
    "lengthInDays" INTEGER NOT NULL,

    CONSTRAINT "Routines_pkey" PRIMARY KEY ("routineId")
);

-- CreateTable
CREATE TABLE "Periods" (
    "periodId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "routineId" INTEGER NOT NULL,
    "periodName" TEXT NOT NULL,
    "dateStarted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lengthInWeeks" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "nextWorkoutId" INTEGER NOT NULL,

    CONSTRAINT "Periods_pkey" PRIMARY KEY ("periodId")
);

-- CreateTable
CREATE TABLE "Workouts" (
    "workoutId" SERIAL NOT NULL,
    "routineId" INTEGER NOT NULL,
    "workoutName" TEXT NOT NULL,
    "positionInRoutine" INTEGER NOT NULL,

    CONSTRAINT "Workouts_pkey" PRIMARY KEY ("workoutId")
);

-- CreateTable
CREATE TABLE "WorkoutExercises" (
    "workoutExerciseId" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,

    CONSTRAINT "WorkoutExercises_pkey" PRIMARY KEY ("workoutExerciseId")
);

-- CreateTable
CREATE TABLE "PeriodWorkouts" (
    "periodWorkoutId" SERIAL NOT NULL,
    "periodId" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "periodWorkoutName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PeriodWorkouts_pkey" PRIMARY KEY ("periodWorkoutId")
);

-- CreateTable
CREATE TABLE "PeriodExercises" (
    "periodExerciseId" SERIAL NOT NULL,
    "periodWorkoutId" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "targetReps" DECIMAL(65,30) NOT NULL,
    "actualReps" DECIMAL(65,30) NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "PeriodExercises_pkey" PRIMARY KEY ("periodExerciseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Routines" ADD CONSTRAINT "Routines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routines"("routineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periods" ADD CONSTRAINT "Periods_nextWorkoutId_fkey" FOREIGN KEY ("nextWorkoutId") REFERENCES "Workouts"("workoutId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workouts" ADD CONSTRAINT "Workouts_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routines"("routineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercises" ADD CONSTRAINT "WorkoutExercises_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workouts"("workoutId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercises" ADD CONSTRAINT "WorkoutExercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises"("exerciseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodWorkouts" ADD CONSTRAINT "PeriodWorkouts_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Periods"("periodId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodWorkouts" ADD CONSTRAINT "PeriodWorkouts_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workouts"("workoutId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodExercises" ADD CONSTRAINT "PeriodExercises_periodWorkoutId_fkey" FOREIGN KEY ("periodWorkoutId") REFERENCES "PeriodWorkouts"("periodWorkoutId") ON DELETE RESTRICT ON UPDATE CASCADE;
