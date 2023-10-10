// このファイルはサーバーサイドとクライアントサイドの両方で用います。

import { z } from "zod";

// フォームで用いる選択肢の値は、このファイルで定義します。
// オブジェクトリテラルではなく、Mapを用いるのは順序が重要だからです。
export const languages = new Map([
  ["ja", "Japanese"],
  ["en", "English"],
  ["zh", "Chinese"],
  ["ko", "Korean"],
] as const);
// 選択肢の型が必要な場合は、選択肢のMapから型を生成します。
export type Language = KeyOf<typeof languages>;
//          ^? "ja" | "en" | "zh" | "ko"

export const cities = new Map([
  ["tokyo", "Tokyo"],
  ["osaka", "Osaka"],
  ["kyoto", "Kyoto"],
] as const);
export type City = KeyOf<typeof cities>;
//          ^? "tokyo" | "osaka" | "kyoto"

export const currencies = new Map([
  ["jpy", "JPY (￥)"],
  ["usd", "USD ($)"],
  ["eur", "EUR (€)"],
] as const);
export type Currency = KeyOf<typeof currencies>;
//          ^? "jpy" | "usd" | "eur"

// フォームのスキーマを定義します。
export const formSchema = z
  .object({
    name: z.string().min(1).max(16),
    email: z.string().email(),
    // languageは選択形式なので、z.union()を用いても良さそうに思えるかもしれませんが、
    // z.union()は型レベルの検査が強すぎるため、refineで実行時にチェックする程度にとどめます。
    // フォームのデフォルト値で空欄文字列を用いたい場合は、このような書き方になります。
    // フォームのデフォルト値が決定できる場合は、z.union()を用いることができます。(currencyの例を参照)
    language: z
      .string()
      .refine((language) => languages.has(language as Language), {
        message: "Select language",
      }),
    // 複数選択形式
    cities: z
      .array(
        z.string().refine((city) => cities.has(city as City), {
          message: "Select city",
        }),
      )
      .min(1), // 選択肢から1つ以上選択する必要があることを意味します。
    // languageと異なり、currencyはデフォルト値が決定できるので、z.enum()を用います。
    currency: z.union(mapToLiterals(currencies)),
    postalCodeFirst: z.string(),
    postalCodeSecond: z.string(),
    note: z.string().max(10),
    // チェックボックスにチェックが入っていることを確認するバリデーションの例です。
    agreed: z.boolean().refine((agreed) => agreed, {
      message: "You must agree with the Term of Service",
    }),
    causeServerError: z.boolean(),
  })
  // 複合バリデーションを定義します。
  .refine(
    ({ postalCodeFirst, postalCodeSecond }) =>
      postalCodeFirst.length === 3 && postalCodeSecond.length === 4,
    {
      message: "Invalid postal code",
      // next-safe-actionのresult.validationErrorでうまく扱うためには、
      // pathに指定するフィールド名はフォームスキーマに存在しているもののどれかにする必要があります。
      path: ["postalCodeFirst"],
    },
  );

// フォームスキーマの型を定義、エクスポートします。
// これは、クライアントサイドでのみ使用します。
export type FormInput = z.infer<typeof formSchema>;

// Mapからキーの型を生成するユーティリティ型です。
type KeyOf<T> = T extends Map<infer K, any> ? K : never;

// Mapからz.literal()の配列を生成するユーティリティ関数です。
function mapToLiterals<T extends z.Primitive>(
  map: Map<T, any>,
): readonly [z.ZodLiteral<T>, z.ZodLiteral<T>] {
  return Array.from(map.keys()).map((key) => z.literal(key)) as any;
}
