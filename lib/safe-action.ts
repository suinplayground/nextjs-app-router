import { createSafeActionClient } from "next-safe-action";

export const safeAction = createSafeActionClient({
  // Can also be an async function.
  handleServerErrorLog(e) {
    // We can, for example, also send the error to a dedicated logging system.
    // reportToErrorHandlingSystem(e);

    // And also log it to the console.
    console.error("Action error:", e);
  },
});
