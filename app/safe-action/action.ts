"use server"; // don't forget to add this!

import { z } from "zod";
import { safeAction } from "@/lib/safe-action";

// This schema is used to validate input from client.
const schema = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(8).max(100),
});

export const loginUser = safeAction(schema, async ({ username, password }) => {
  if (username === "johndoe" && password === "123456") {
    return {
      success: "Successfully logged in",
    };
  }
  throw new Error("Something wrong");
  return { failure: "Incorrect credentials" };
});
