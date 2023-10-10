"use client";
import { Button } from "@nextui-org/button";
import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox";
import { Input, Textarea } from "@nextui-org/input";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { Select, SelectItem } from "@nextui-org/select";
import { useAction } from "next-safe-action/hook";
import { Controller, useForm } from "react-hook-form";
import { createSomething } from "./action";
import type { City, FormInput, Language } from "./form-schema";
import { cities, currencies, formSchema, languages } from "./form-schema";
import { zodResolver } from "@hookform/resolvers/zod";

export function Form({
  clientSideValidationEnabled,
}: {
  clientSideValidationEnabled: boolean;
}) {
  // Next.jsのserver actionは、next-safe-actionのuseActionフックを経由して用いることで
  // server actionの実行状況を簡単に取得できます。
  // - execute: server actionの実行関数
  // - reset: server actionの実行状況をリセットする関数
  // - result: server actionの実行結果
  // - status: server actionの実行状況
  const { execute, reset, result, status } = useAction(createSomething);
  // サーバーサイドの処理結果は、resultオブジェクトに格納されます。
  // - validationError: サーバーサイドでzodを用いて行ったバリデーションの結果
  // - data: サーバーサイドで処理されたデータ
  // - fetchError: サーバーサイドでfetchが失敗した場合のエラー
  // - serverError: サーバーサイドでエラー(例外)が発生した場合のエラー
  const {
    validationError: serverSideValidationErrors,
    data,
    fetchError,
    serverError,
  } = result;

  // react-hook-formのuseFormフックを用いて、クライアントサイドのフォームの状態を管理します。
  const {
    handleSubmit,
    register,
    control,
    // クライアントサイドでのバリデーションエラーがerrorsオブジェクトに格納されます。
    formState: { errors: clientSideValidationErrors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      language: "" satisfies Language | "", // languageはstringなので、satisfies型オペレーターでデフォルト値の型をチェックを働かせます。
      cities: ["tokyo"] satisfies City[], // citiesはstring[]なので、satisfies型オペレーターでデフォルト値の型をチェックを働かせます。
      currency: "jpy", // ここは後述のsatisfies FormInputで型チェックがはたらいいているため、ここでのsatisfiesは省略できます。
      postalCodeFirst: "",
      postalCodeSecond: "",
      note: "",
      agreed: false,
      causeServerError: false,
    } satisfies FormInput, // satisfies型オペレーターで補完や型をチェックを働かせます。
    // @hookform/resolvers/zodを用いて、react-hook-formのバリデーションをzodで行います。
    // このバリデーションはクライアントサイドで行われます。
    resolver: clientSideValidationEnabled ? zodResolver(formSchema) : undefined,
  });

  return (
    <div className="flex flex-row gap-unit-md">
      <div className="basis-1/2">
        {/* server actionの実行関数は、handleSubmitを包んでonSubmitに渡します。 */}
        <form onSubmit={handleSubmit(execute)}>
          <div className="flex flex-col gap-unit-md">
            {/* NextUIのInputコンポーネント */}
            <Input
              type="text"
              label="Name"
              isInvalid={
                !!serverSideValidationErrors?.name ||
                !!clientSideValidationErrors.name
              }
              errorMessage={
                serverSideValidationErrors?.name ??
                clientSideValidationErrors.name?.message
              }
              {...register("name")}
            />

            {/* zodのemailバリデーションのデモ */}
            <Input
              type="email"
              label="Email"
              isInvalid={
                !!serverSideValidationErrors?.email ||
                !!clientSideValidationErrors.email
              }
              errorMessage={
                serverSideValidationErrors?.email ??
                clientSideValidationErrors.email?.message
              }
              {...register("email")}
            />

            {/* NextUIのSelectとzodのバリデーションの組み合わせデモ */}
            <Select
              label="Select language"
              isInvalid={
                !!serverSideValidationErrors?.language ||
                !!clientSideValidationErrors.language
              }
              errorMessage={
                serverSideValidationErrors?.language &&
                clientSideValidationErrors.language?.message
              }
              {...register("language")}
            >
              {/* 選択肢はform-schema.tsで定義したマップを用いて表示します。
                  Unknownはform-schema.tsでは定義していない選択肢です。
                  これを選択して送信すると、サーバーサイドで弾かれることが確認できます。 */}
              {[
                ...languages,
                ["unknown", "Unknown (this causes error)"] as const,
              ].map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </Select>

            {/* 複数選択形式のバリデーションのデモ。
                react-hook-formとNextUIのCheckboxGroupを連携するには、
                react-hook-formのControllerコンポーネントの配下に置く必要があります。 */}
            <Controller
              name="cities" // このプロパティーは省略できません。
              control={control}
              render={({ field: { onChange, value } }) => (
                <CheckboxGroup
                  label="Select cities"
                  defaultValue={value} // デフォルト値を設定します。
                  onChange={onChange} // チェックボックスの状態が変更されたときに、react-hook-formの状態を更新します。
                  isInvalid={
                    !!serverSideValidationErrors?.cities ||
                    !!clientSideValidationErrors.cities
                  }
                  errorMessage={
                    serverSideValidationErrors?.cities ??
                    clientSideValidationErrors.cities?.message
                  }
                >
                  {/* 選択肢はform-schema.tsで定義したマップを用いて表示します。
                      Unknownはform-schema.tsでは定義していない選択肢です。
                      これを選択して送信すると、サーバーサイドで弾かれることが確認できます。 */}
                  {[
                    ...cities,
                    ["unknown", "Unknown (this causes error)"] as const,
                  ].map(([value, label]) => (
                    <Checkbox key={value} value={value}>
                      {label}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
            />

            {/* NextUIのRadioGroupとzodのバリデーションの組み合わせデモ
                react-hook-formとNextUIのRadioGroupを連携するには、
                react-hook-formのControllerコンポーネントの配下に置く必要があります。 */}
            <Controller
              name="currency" // このプロパティーは省略できません。
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  label="Select currency"
                  defaultValue={value} // デフォルト値を設定します。
                  onValueChange={onChange} // ラジオボタンの状態が変更されたときに、react-hook-formの状態を更新します。
                  isInvalid={
                    !!serverSideValidationErrors?.currency ||
                    !!clientSideValidationErrors.currency
                  }
                  errorMessage={
                    serverSideValidationErrors?.currency ??
                    clientSideValidationErrors.currency?.message
                  }
                >
                  {/* 選択肢はform-schema.tsで定義したマップを用いて表示します。
                      Unknownはform-schema.tsでは定義していない選択肢です。
                      これを選択して送信すると、サーバーサイドで弾かれることが確認できます。 */}
                  {[
                    ...currencies,
                    ["unknown", "Unknown (this causes error)"] as const,
                  ].map(([value, label]) => (
                    <Radio key={value} value={value}>
                      {label}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            />

            {/* zodで複合バリデーションを行うデモ */}
            <div>
              <div className="flex flex-row gap-unit-xs items-center">
                <label className="text-sm whitespace-nowrap">Postal code</label>
                <Input
                  type="text"
                  label=""
                  placeholder="123"
                  isInvalid={
                    !!serverSideValidationErrors?.postalCodeFirst ||
                    !!clientSideValidationErrors.postalCodeFirst
                  }
                  {...register("postalCodeFirst")}
                />
                <div>-</div>
                <Input
                  type="text"
                  label=""
                  placeholder="4567"
                  isInvalid={
                    !!serverSideValidationErrors?.postalCodeFirst ||
                    !!clientSideValidationErrors.postalCodeFirst
                  }
                  {...register("postalCodeSecond")}
                />
              </div>
              {serverSideValidationErrors?.postalCodeFirst ? (
                <div className="text-danger-400 text-xs">
                  {serverSideValidationErrors?.postalCodeFirst}
                </div>
              ) : clientSideValidationErrors.postalCodeFirst ? (
                <div className="text-danger-400 text-xs">
                  {clientSideValidationErrors.postalCodeFirst.message}
                </div>
              ) : null}
            </div>

            {/*<div>*/}
            {/*  <div>Coupon codes</div>*/}
            {/*  <Input type="text" label="Code 1" size="sm" />*/}
            {/*  <Input type="text" label="Code 2" size="sm" />*/}
            {/*  <Input type="text" label="Code 3" size="sm" />*/}
            {/*</div>*/}

            {/* NextUIのテキストエリアのデモ */}
            <Textarea
              label="Note"
              labelPlacement="outside"
              placeholder="Write your note here"
              description="HINT: Don't over 10 characters"
              isInvalid={
                !!serverSideValidationErrors?.note ||
                !!clientSideValidationErrors.note
              }
              errorMessage={
                serverSideValidationErrors?.note ??
                clientSideValidationErrors.note?.message
              }
              {...register("note")}
            />

            {/* チェックボックスにチェックを入れることを必須とするデモ */}
            <Controller
              name="agreed" // このプロパティーは省略できません。
              control={control}
              render={({ field: { onChange, value } }) => (
                <div>
                  <Checkbox isSelected={value} onValueChange={onChange}>
                    Agree with the Term of Service.
                  </Checkbox>
                  {serverSideValidationErrors?.agreed && (
                    <div className="text-danger-400 text-xs">
                      {serverSideValidationErrors.agreed}
                    </div>
                  )}
                </div>
              )}
            />

            <Controller
              name="causeServerError"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div>
                  <Checkbox isSelected={value} onValueChange={onChange}>
                    Cause server error on submit
                  </Checkbox>
                  {serverSideValidationErrors?.causeServerError && (
                    <div className="text-danger-400 text-xs">
                      {serverSideValidationErrors.causeServerError}
                    </div>
                  )}
                </div>
              )}
            />

            <div>
              <Button
                type="submit"
                color="primary"
                isLoading={status === "executing"}
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="basis-1/2">
        <div className="font-bold text-lg">
          Server-side validations (next-safe-action)
        </div>
        <pre>{JSON.stringify({ status, result }, null, 2)}</pre>
        <div className="font-bold text-lg">
          Client-side validations (@hookform/resolvers)
        </div>
        <pre>
          {JSON.stringify(
            Object.fromEntries(
              Object.entries(clientSideValidationErrors).map(([key, value]) => [
                key,
                value?.message,
              ]),
            ),
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}
