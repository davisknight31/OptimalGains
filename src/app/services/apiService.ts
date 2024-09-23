import { Exercise } from "../types/exercise";
import { Routine } from "../types/routine";

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

  // responseData.routines.forEach((routine) => {

  // })

  const routinesData: Routine[] = responseData.routines || [];

  if (routinesData.length > 0) {
    routinesData.forEach((routine) => {
      getWorkouts(routine.routineId).then(async (response) => {
        const workoutResponseData = await response.json();
        routine.workouts = workoutResponseData.workouts;
        routine.workouts.forEach((workout) => {
          getWorkoutExercises(workout.workoutId).then(async (response) => {
            const workoutExerciseResponseData = await response.json();
            workout.workoutExercises =
              workoutExerciseResponseData.workoutExercises;
          });
        });
      });
    });
  }

  // if (routinesData) {
  //   return routinesData;
  // } else {
  //   return [];
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
  const response = await fetch(`/api/users?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
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
