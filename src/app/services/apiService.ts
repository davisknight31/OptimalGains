import { Exercise } from "../types/exercise";
import { Period } from "../types/period";
import { Routine } from "../types/routine";
import { Workout } from "../types/workout";

// async function makeGetRequest(url: string, params?: Record<string, any>) {
//   // Construct the query string from params if provided
//   const queryString = params
//     ? "?" + new URLSearchParams(params).toString()
//     : "";

//   // Fetch the data
//   const response = await fetch(url + queryString, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`${response.status}`);
//   }

//   return await response.json();
// }

async function makePostRequest(url: string, data: any) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return await response.json();
}

async function makePutRequest(url: string, data: any) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return await response.json();
}

async function makeDeleteRequest(url: string, data: any) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }

  return await response.json();
}

export async function registerUser(
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  email: string
) {
  const url = "/api/auth/register";
  const userData = {
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  const response = await makePostRequest(url, userData);
  return response;
}

export async function loginUser(username: string, password: string) {
  const url = "/api/auth/login";
  const loginData = {
    username: username,
    password: password,
  };

  const response = await makePostRequest(url, loginData);
  return response;
}

export async function getRoutines(userId: number) {
  const response = await fetch(`/api/routines?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  const routinesData: Routine[] = responseData.routines || [];

  const routineWorkoutsPromises = routinesData.map(async (routine) => {
    const routineWorkout = await getWorkouts(routine.routineId);
    const routineWorkoutResponse = await routineWorkout.json();
    routine.workouts = routineWorkoutResponse.workouts;
    const workoutExercisesPromises = routine.workouts.map(async (workout) => {
      if (workout.workoutId) {
        const workoutExercises = await getWorkoutExercises(workout.workoutId);
        const workoutExercisesResponse = await workoutExercises.json();
        workout.workoutExercises = workoutExercisesResponse.workoutExercises;
      }
    });
    await Promise.all(workoutExercisesPromises);
  });
  await Promise.all(routineWorkoutsPromises);

  // if (routinesData.length > 0) {
  //   routinesData.forEach((routine) => {
  //     getWorkouts(routine.routineId).then(async (response) => {
  //       const workoutResponseData = await response.json();
  //       routine.workouts = workoutResponseData.workouts;
  //       routine.workouts.forEach((workout) => {
  //         if (workout.workoutId) {
  //           getWorkoutExercises(workout.workoutId).then(async (response) => {
  //             const workoutExerciseResponseData = await response.json();
  //             workout.workoutExercises =
  //               workoutExerciseResponseData.workoutExercises;
  //           });
  //         }
  //       });
  //     });
  //   });
  // }

  return routinesData;
}

export async function getWorkouts(routineId: number) {
  const response = await fetch(`/api/workouts?routineId=${routineId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function getWorkoutExercises(workoutId: number) {
  const response = await fetch(
    `/api/workout-exercises?workoutId=${workoutId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}

export async function getPeriods(userId: number) {
  const response = await fetch(`/api/periods?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  const periods: Period[] = responseData.periods;

  console.log(typeof periods[0].dateStarted);

  return periods;
}

export async function getAllExercises() {
  const response = await fetch(`/api/exercises`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  const exercises: Exercise[] = responseData.exercises || [];

  return exercises;
}

export async function createRoutine(
  userId: number,
  routineName: string,
  lengthInDays: string,
  routineWorkouts: Workout[]
) {
  const routinesUrl = "/api/routines";
  const workoutsUrl = "/api/workouts";
  const workoutExercisesUrl = "/api/workout-exercises";

  const routineData = {
    userId: userId,
    routineName: routineName,
    lengthInDays: parseInt(lengthInDays),
  };

  const routineResponse = await makePostRequest(routinesUrl, routineData);
  const newRoutineId: number = routineResponse.routine.routineId;

  const newWorkouts = routineWorkouts.map(async (workout) => {
    const workoutData = {
      routineId: newRoutineId,
      workoutName: workout.workoutName,
      positionInRoutine: workout.positionInRoutine,
    };
    const createdWorkoutResponse = await makePostRequest(
      workoutsUrl,
      workoutData
    );
    const newWorkoutId = createdWorkoutResponse.workout.workoutId;
    const newWorkoutExercises = workout.workoutExercises.map(
      async (exercise) => {
        const workoutExerciseData = {
          workoutId: newWorkoutId,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          positionInWorkout: exercise.positionInWorkout,
        };
        const createWorkoutExerciseResponse = await makePostRequest(
          workoutExercisesUrl,
          workoutExerciseData
        );
      }
    );
    await Promise.all(newWorkoutExercises);
  });
  await Promise.all(newWorkouts);
}

export async function updateRoutine(
  routineId: number,
  routineName: string,
  lengthInDays: string,
  routineWorkouts: Workout[]
) {
  const routinesUrl = "/api/routines";
  const workoutsUrl = "/api/workouts";
  const workoutExercisesUrl = "/api/workout-exercises";

  const routineData = {
    routineId: routineId,
    routineName: routineName,
    lengthInDays: parseInt(lengthInDays),
  };

  const routineResponse = await makePutRequest(routinesUrl, routineData);

  const updatedRoutineWorkouts = await Promise.all(
    routineWorkouts.map(async (workout) => {
      if (workout.workoutId) {
        const updateWorkoutData = {
          workoutId: workout.workoutId,
          workoutName: workout.workoutName,
          positionInRoutine: workout.positionInRoutine,
        };
        const updateWorkoutResponse = await makePutRequest(
          workoutsUrl,
          updateWorkoutData
        );
      } else {
        const createWorkoutData = {
          routineId: routineId,
          workoutName: workout.workoutName,
          positionInRoutine: workout.positionInRoutine,
        };
        const createWorkoutResponse = await makePostRequest(
          workoutsUrl,
          createWorkoutData
        );
        workout.workoutId = createWorkoutResponse.workout.workoutId;
      }
      return workout;
    })
  );
  console.log(updatedRoutineWorkouts);

  const updatedWorkoutsWithUpdatedExercises = updatedRoutineWorkouts.map(
    async (workout) => {
      const exercisePromises = workout.workoutExercises.map(
        async (workoutExercise) => {
          if (workoutExercise.workoutExerciseId) {
            const updateWorkoutExerciseData = {
              workoutExerciseId: workoutExercise.workoutExerciseId,
              exerciseId: workoutExercise.exerciseId,
              sets: workoutExercise.sets,
              positionInWorkout: workoutExercise.positionInWorkout,
            };
            const updateWorkoutExerciseResponse = await makePutRequest(
              workoutExercisesUrl,
              updateWorkoutExerciseData
            );
          } else {
            const createWorkoutExerciseData = {
              workoutId: workout.workoutId,
              exerciseId: workoutExercise.exerciseId,
              sets: workoutExercise.sets,
              positionInWorkout: workoutExercise.positionInWorkout,
            };
            const createWorkoutExerciseResponse = await makePostRequest(
              workoutExercisesUrl,
              createWorkoutExerciseData
            );
          }
        }
      );
      await Promise.all(exercisePromises);
    }
  );
  await Promise.all(updatedWorkoutsWithUpdatedExercises);
}

export async function deleteWorkouts(workoutIds: number[]) {
  const workoutsUrl = "/api/workouts";

  const deletedWorkoutPromises = workoutIds.map(async (id) => {
    const data = {
      workoutId: id,
    };

    await makeDeleteRequest(workoutsUrl, data);
  });

  await Promise.all(deletedWorkoutPromises);
}

export async function deleteWorkoutExercises(workoutExerciseIds: number[]) {
  const workoutExercisesUrl = "/api/workout-exercises";

  const deletedWorkoutPromises = workoutExerciseIds.map(async (id) => {
    const data = {
      workoutExerciseId: id,
    };

    await makeDeleteRequest(workoutExercisesUrl, data);
  });

  await Promise.all(deletedWorkoutPromises);
}

export async function deleteRoutine(routineId: number) {
  const routinesUrl = "/api/routines";

  const routineData = {
    routineId: routineId,
  };

  await makeDeleteRequest(routinesUrl, routineData);
}

// export async function getPeriods(routineId: number) {
//   const routinesUrl = "/api/periods";

//   const routineData = {
//     routineId: routineId,
//   };

//   await makeDeleteRequest(routinesUrl, routineData);
// }
