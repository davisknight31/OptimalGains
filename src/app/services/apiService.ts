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

// export async function getRoutines(userId: number) {
//   const url = "/api/routines";
//   const routines = await makeGetRequest(url, { userId });
// }
export async function getPeriods(userId: number) {
  const response = await fetch(`/api/users?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
