"use server";

import { safeAction } from "@/lib/safe-action";
import type { FormInput } from "./form-schema";
import { formSchema } from "./form-schema";

// Next.jsのserver actionです。
// next-safe-actionのaction関数にフォームスキーマを渡すことで、
// フォームスキーマに基づいたバリデーションが行われます。
export const createSomething = safeAction(formSchema, _createSomething);

async function _createSomething(
  input: FormInput,
): Promise<CreateSomethingResult> {
  // バリデーション後の処理をここに書きます。
  // 引数のinputはバリデーション後のデータです。
  console.log(createSomething.name, input);
  if (input.causeServerError) {
    throw new Error("This is an example server error.");
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    success: "OK",
  };
}

export type CreateSomethingResult = {
  success: "OK";
};
