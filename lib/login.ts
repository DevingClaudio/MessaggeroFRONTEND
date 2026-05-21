"use server";

export async function Login(username: string, password: string) {
  let bool = false;
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/login`, {
      method: "POST",
      body: JSON.stringify([username, password]),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json;
  } catch (err) {
    console.log(bool);
    return console.error(err);
  }
}
