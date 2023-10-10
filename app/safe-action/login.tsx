"use client"; // this is a Client Component

import { loginUser } from "./action";

export default function Login() {
  const onClick = async () => {
    console.log("loginUser");
    const res = await loginUser({
      username: "johndoe",
      password: "12345678",
    });

    // Result keys.
    const { data, validationError, serverError } = res;
    console.log({ data, validationError, serverError });
  };
  return <button onClick={onClick}>Login</button>;
}
