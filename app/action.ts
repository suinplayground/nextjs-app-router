"use server";

export async function throwError(): Promise<never> {
  throw new Error("Error thrown from action");
}

export async function increment(number: number): Promise<number> {
  const returns = number + 1;
  console.log(increment.name, { params: [number], returns });
  return returns;
}

export async function submitForm(
  previousState: { success?: boolean },
  formData: FormData,
) {
  console.log(submitForm.name, {
    previousState,
    formData: [...formData.entries()],
  });
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return { success: true };
}

export type SubmitFormWithPropsProps = {};

export type SubmitFormWithPropsResult = {};

export async function submitFormWithProps(
  props: SubmitFormWithPropsProps,
): Promise<SubmitFormWithPropsResult> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {};
}

export async function serverDate(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return new Date().toISOString();
}
