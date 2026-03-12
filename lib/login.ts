"use server";

export async function confermaLogin() {
  let bool = false;
  try {
    const response = fetch(`${process.env.BACKEND_URL}/retrieve-data`);
  } catch (err) {
    console.log(bool);
    return console.error(err);
  }
  !bool;
  return bool;
}
