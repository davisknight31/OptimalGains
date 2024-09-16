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
  console.log(response.user);
  return response;
}

async function makePostRequest(url: string, data: any) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
}
