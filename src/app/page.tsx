"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { randomWord } from "@/lib/randamNewWord";
import { fetchIsNown } from "@/lib/fetchIsnown";
import { hTok } from "@/lib/hiraganaToKatakana";
import { sToB } from "@/lib/smallToBig";
import { TokenArray } from "@/types/type";
import { Progress } from "@/components/ui/progress";
import { RuleCard } from "@/components/rule";

// ルール違反の種類を表す enum
enum RuleViolation {
  None,
  NotConnected,
  EndsWithN,
}

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [kwords, setKwords] = useState<string[]>([]);
  const [load, setLoad] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);

  //ゲームのリセット
  const startGame = async () => {
    setLoad(true);
    setIsStart(true);
    let randamword = randomWord();
    if (!randamword) {
      randamword = "しりとり";
    }
    // const isNounResponse = await fetchIsNown(randamword);
    // const isNoun: TokenArray = await isNounResponse.json();
    const isNoun: TokenArray = await fetchIsNownArray(randamword);

    console.log(isNoun);
    setWords([randamword]);
    setKwords([
      isNoun[isNoun.length - 1].reading ||
        isNoun[isNoun.length - 1].surface_form,
    ]);
    setLoad(false);
  };

  const resetGame = async () => {
    alert("リセットします");
    setKwords([]);
    setWords([]);
    setIsStart(false);
  };

  //文字列が入力されているか、未入力ではないか
  const validateInput = (input: FormDataEntryValue | null): string | null => {
    if (typeof input !== "string" || input.trim() === "") {
      return null;
    }
    return input.trim();
  };

  const fetchIsNownArray = async (input: string) => {
    const isNounResponse = await fetchIsNown(input);
    const isNoun: TokenArray = await isNounResponse.json();

    return isNoun;
  };

  //しりとりのルールに則っているか
  const checkShiritoriRules = (
    previous: string,
    current: TokenArray
  ): RuleViolation => {
    // console.log(previous.at(-1));
    // console.log(current[0]);

    if (sToB(previous || "").at(-1) !== current.at(0)?.reading.at(0))
      return RuleViolation.NotConnected;
    if (current.at(-1)?.reading.at(-1) === "ン") return RuleViolation.EndsWithN;

    return RuleViolation.None;
  };

  //単語が重複していないか
  const isDuplicate = (word: string): boolean => {
    return words.includes(word);
  };

  const handleClick = async (formData: FormData) => {
    const action = formData.get("action");
    const input = validateInput(formData.get("shiritori"));
    if (action === "start") {
      startGame();
    }

    if (action === "submit") {
      if (!input) {
        alert("未入力です");
        return;
      }

      if (input.at(-1) === "！" || input.at(-1) === "？") {
        alert("語尾に感嘆符を使うのは禁止です。\nやり直してください");
        return;
      }

      const isNoun: TokenArray = await fetchIsNownArray(input);
      if (!isNoun[isNoun.length - 1].reading) {
        alert("品詞を認識できません。\nほかの言葉を入力してください。");
        return;
      }
      console.log(isNoun);
      let cnt = 0;
      isNoun.map((token) => {
        if (token.pos === "名詞") {
          cnt++;
        }
      });
      if (cnt !== isNoun.length) {
        console.log(cnt);
        console.log(isNoun.length);
        alert("入力された文字列は名詞ではありません。\nやり直してください");
        return;
      }

      if (isDuplicate(input)) {
        alert("過去に使用した単語です。\nあなたの負け");
        resetGame();
        return;
      }

      const prevWord = kwords.at(-1) || "";
      const violation = checkShiritoriRules(hTok(prevWord), isNoun);

      if (violation === RuleViolation.NotConnected) {
        alert("しりとりの条件を満たしていません。\nやり直してください");
        return;
      } else if (violation === RuleViolation.EndsWithN) {
        alert("最後の文字が「ん」です。\nあなたの負け");
        resetGame();
        return;
      }

      setWords([...words, input]);
      setKwords([
        ...kwords,
        isNoun[isNoun.length - 1].reading ||
          isNoun[isNoun.length - 1].surface_form,
      ]);
      console.log(words);
      console.log(kwords);
    }

    if (action === "reset") {
      alert("リセットします");
      setKwords([]);
      setWords([]);
      setIsStart(false);
      return;
      // resetGame();
    }
  };

  return (
    <div className="mt-6 mx-8 space-y-6 lg:grid lg:grid-cols-2  md:grid md:grid-cols-1 md:space-x-6">
      {load === true ? (
        <>
          <div>解析中...</div>
          <Progress value={70} className="max-w-md" />
        </>
      ) : (
        <>
          {" "}
          <div className="flex-col space-y-4 max-w-3xl">
            <div className="p-4 border rounded-xl bg-white ">
              {/* <div className="text-gray-500">前回の言葉</div> */}
              {isStart === true ? (
                <>
                  <div className="text-gray-500">前回の言葉</div>
                  <p className="text-indigo-600 text-xl font-bold">
                    {words.at(-1)}
                  </p>
                  <p className="text-indigo-600 font-bold">
                    次の言葉：({sToB(kwords.at(-1) || "")})
                  </p>
                </>
              ) : (
                <>
                  <p className="text-indigo-600 text-xl font-bold">
                    スタートを押してください。
                  </p>
                </>
              )}
            </div>

            <form action={handleClick}>
              <div className="flex">
                <Input
                  className="mr-12 rounded-lg bg-white "
                  type="text"
                  name="shiritori"
                  placeholder="しりとりを入力"
                />
                <div className="flex">
                  {isStart === true ? (
                    <>
                      <Button
                        className="mr-4 bg-indigo-500 hover:bg-indigo-600"
                        name="action"
                        value="submit"
                      >
                        <p className="font-bold">送信</p>
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white transition"
                        name="action"
                        value="reset"
                      >
                        <p className="font-bold">リセット</p>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="mr-4 bg-indigo-500 hover:bg-indigo-600 w-32"
                        name="action"
                        value="start"
                      >
                        <p className="font-bold">スタート</p>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </form>

            <div className="max-w-3xl border-1 rounded-xl p-6 bg-white ">
              <div className="text-gray-500 mb-2">得点</div>
              <p className="font-bold text-2xl text-gray-800">
                {isStart ? `${words.length - 1}${"  "}ポイント` : ""}
              </p>
            </div>
            <div className="max-w-3xl border-1 rounded-xl p-6 bg-white ">
              <div className="text-gray-500 mb-2">履歴</div>
              {words.slice(1).map((word, idx) => (
                <p key={word} className="text-sm">
                  {idx + 1}. {word}（{kwords[idx + 1]}）
                </p>
              ))}
            </div>
          </div>
          <div className=" mb-6 px-4 py-8 border-1 rounded-xl max-w-3xl bg-white space-y-6 md:max-h-200 lg:max-h-130">
            <RuleCard />
          </div>
        </>
      )}
      {/* <div className="flex-col space-y-4 max-w-3xl">
        <div className="p-4 border rounded-xl bg-white ">
          <div className="text-gray-500">前回の言葉</div>
          <p className="text-indigo-600 text-xl font-bold">{words.at(-1)}</p>
          <p className="text-indigo-600 font-bold">
            次の言葉：({sToB(kwords.at(-1) || "")})
          </p>
        </div>

        <form action={handleClick}>
          <div className="flex">
            <Input
              className="mr-12 rounded-lg bg-white "
              type="text"
              name="shiritori"
              placeholder="しりとりを入力"
            />
            <div className="flex">
              <Button
                className="mr-4 bg-indigo-500 hover:bg-indigo-600"
                name="action"
                value="submit"
              >
                送信
              </Button>
              <Button
                className="bg-indigo-500 hover:bg-red-600 text-white transition"
                name="action"
                value="reset"
              >
                リセット
              </Button>
            </div>
          </div>
        </form>

        <div className="max-w-3xl border-1 rounded-xl p-6 bg-white ">
          <div className="text-gray-500 mb-2">履歴</div>
          {words.slice(1).map((word, idx) => (
            <p key={word} className="text-sm">
              {idx + 1}. {word}（{kwords[idx + 1]}）
            </p>
          ))}
        </div>
      </div>
      <div className=" mb-6 px-4 py-8 border-1 rounded-xl max-w-3xl bg-white space-y-6">
        <h1 className="font-bold text-xl">しりとりのルール</h1>

        <ul className="space-y-4">
          <li>
            <strong>1. 単語のつながり:</strong>{" "}
            前の単語の最後の文字と、次の単語の最初の文字が一致している必要があります。
          </li>

          <li>
            <strong>2. 名詞判定:</strong>{" "}
            形態素解析ツールを使って、入力された単語が「名詞」であるかを確認し、名詞以外の単語は無効とします。
          </li>

          <li>
            <strong>3. ひらがな、カタカナ、漢字の使用が可能:</strong>
            名詞の判定が滞りなく行われるよう、ひらがな、カタカナ、漢字をそれぞれの単語にふさわしい形で利用しましょう。
          </li>

          <li>
            <strong>4. 小文字の正規化:</strong> 語尾が小文字（例：ャ、ュ、ョ
            等）の場合は、対応する大文字（例：ヤ、ユ、ヨ）に変換して扱います。
          </li>

          <li>
            <strong>5. 濁音・半濁音の正規化:</strong>{" "}
            語尾が濁音・半濁音（例：ガ、パ、プ、べ
            等）の場合は、対応する清音（カ、ハ、フ、ヘ 等）に変換して扱います。
          </li>

          <li>
            <strong>6. 長音符（ー）の除外:</strong>{" "}
            長音符（ー）は無視または除去して処理します。
          </li>

          <li>
            <strong>7. 終了条件:</strong>{" "}
            読みが「ン」で終わる単語を入力するとゲームオーバーになります。
          </li>

          <li>
            <strong>8. 単語の重複は禁止:</strong>{" "}
            すでに使われた単語は再使用できません。ゲームオーバーとなります。
          </li>
        </ul>
      </div> */}
    </div>
  );
}

// import kuromoji from "kuromoji";
// // import { NextRequest, NextResponse } from "next/server";
// import path from "path";

// export async function POST(req: string) {
//   // const dicPath = path.join(process.cwd(), "public/dict");
//   //   const tokens = await new Promise<kuromoji.IpadicFeatures[]>(
//   //     async (resolve, reject) => {
//   //       kuromoji.builder({ dicPath: "/dict" }).build((err, tokenizer) => {
//   //   if(err){
//   //     console.log(err)
//   //   } else {
//   //     const tokens = tokenizer.tokenize(text)
//   //   }
//   // })
//   //         // const text = req;
//   //         // // const { text } = body;
//   //         // console.log(text);
//   //         // const result = tokenizer.tokenize(text);
//   //         // console.log(result);
//   //       // resolve(result);
//   //       resolve(tokens);
//   //       });
//   //   //   }
//   //   // );
//   const tokens = await kuromoji
//     .builder({ dicPath: "/dict" })
//     .build((err, tokenizer) => {
//       if (err) {
//         console.log(err);
//       } else {
//         const tokens = tokenizer.tokenize(req);
//         console.log(tokens);
//         return tokens;
//       }
//     });

//   console.log(tokens);

//   return tokens;
// }

// import { NextResponse } from "next/server";
