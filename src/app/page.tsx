"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { randomWord } from "@/lib/randamNewWord";
import { fetchIsNown } from "@/lib/fetchIsnown";
// import { token } from "@/types/type";
import { hTok } from "@/lib/hiraganaToKatakana";
import { sToB } from "@/lib/smallToBig";
import { token } from "@/types/type";
// import { fetchTokens } from "@/lib/fetchIsnown";

// ルール違反の種類を表す enum
enum RuleViolation {
  None,
  NotConnected,
  EndsWithN,
}

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [kwords, setKwords] = useState<string[]>([]);

  useEffect(() => {
    resetGame();
  }, []);

  //ゲームのリセット
  const resetGame = async () => {
    let randamword = randomWord();
    if (!randamword) {
      randamword = "しりとり";
    }
    const isNounResponse = await fetchIsNown(randamword);
    const isNoun: token = await isNounResponse.json();

    console.log(isNoun);
    setWords([randamword]);
    setKwords([
      isNoun[isNoun.length - 1].reading ||
        isNoun[isNoun.length - 1].surface_form,
    ]);
  };

  //文字列が入力されているか、未入力ではないか
  const validateInput = (input: FormDataEntryValue | null): string | null => {
    if (typeof input !== "string" || input.trim() === "") {
      return null;
    }
    return input.trim();
  };

  //しりとりのルールに則っているか
  const checkShiritoriRules = (
    previous: string,
    current: string
  ): RuleViolation => {
    // console.log(previous.at(-1));
    // console.log(current[0]);
    if (sToB(previous || "").at(-1) !== current[0])
      return RuleViolation.NotConnected;
    if (current.at(-1) === "ン") return RuleViolation.EndsWithN;
    return RuleViolation.None;
  };

  //単語が重複していないか
  const isDuplicate = (word: string): boolean => {
    return words.includes(word);
  };

  const handleClick = async (formData: FormData) => {
    const action = formData.get("action");
    const input = validateInput(formData.get("shiritori"));

    if (action === "submit") {
      if (!input) {
        alert("未入力です");
        return;
      }

      const isNounResponse = await fetchIsNown(input);
      const isNoun: token = await isNounResponse.json();
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
      if (cnt < 1) {
        alert("入力された文字列は名詞ではありません。\nやり直してください");
        return;
      }

      if (isDuplicate(input)) {
        alert("過去に使用した単語です。\nあなたの負け");
        resetGame();
        return;
      }

      const prevWord = kwords.at(-1) || "";
      const violation = checkShiritoriRules(
        hTok(prevWord),
        isNoun[0].reading || isNoun[0].surface_form || ""
      );

      if (violation === RuleViolation.NotConnected) {
        alert("しりとりの条件を満たしていません。\nやり直してください");
        return;
      } else if (violation === RuleViolation.EndsWithN) {
        alert("最後の文字が「ん」です。\nあなたの負け");
        resetGame();
        return;
      }

      // const isNounResponse = await fetchIsNown(input);
      // const isNoun: token = await isNounResponse.json();
      // console.log(isNoun);
      // let cnt = 0;
      // isNoun.map((token) => {
      //   if (token.pos === "名詞") {
      //     cnt++;
      //   }
      // });
      // if (cnt < 1) {
      //   alert("入力された文字列は名詞ではありません。\nやり直してください");
      //   return;
      // }

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
      resetGame();
    }
  };

  return (
    <div className="mt-6 mx-8 space-y-6 lg:grid lg:grid-cols-2  md:grid md:grid-cols-1 md:space-x-8">
      <div className="flex-col space-y-4 max-w-3xl">
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
      <div className="mb-6 p-4 border-1 rounded-xl max-w-3xl bg-white space-y-4">
        <h1>しりとりアプリのルール</h1>

        <ul className="space-y-2">
          <li>
            <strong>1. 単語のつながり:</strong>{" "}
            前の単語の最後の文字と、次の単語の最初の文字が一致している必要があります。
          </li>

          <li>
            <strong>2. 小文字の正規化:</strong>{" "}
            語尾が小文字（例：ゃ、ゅ、ょ、っ、ぁ
            等）の場合は、対応する大文字（例：や、ゆ、よ、つ、あ）に変換して扱います。
          </li>

          <li>
            <strong>3. 濁音・半濁音の正規化:</strong>{" "}
            語尾が濁音・半濁音（例：が、ぱ、ぷ、べ
            等）の場合は、対応する清音（か、は、ふ、へ 等）に変換して扱います。
          </li>

          <li>
            <strong>4. 無効な文字の除外:</strong>{" "}
            長音符（ー）や記号、空白、句読点などは無視または除去して処理します。
          </li>

          <li>
            <strong>5. 名詞判定（予定または実装済み）:</strong> Kuromoji.js
            などの形態素解析ツールを使って、入力された単語が「名詞」であるかを確認し、名詞以外の単語は無効とします。
          </li>

          <li>
            <strong>6. 終了条件:</strong>{" "}
            「ん」または「ン」で終わる単語を入力するとゲームオーバーになります。
          </li>

          <li>
            <strong>7. 単語の重複は禁止:</strong>{" "}
            すでに使われた単語は再使用できません。
          </li>

          <li>
            <strong>8. ひらがな・カタカナの区別:</strong>{" "}
            入力はすべて「ひらがな」または「カタカナ」に変換して比較されます（例：「サル」→「さる」）。
          </li>
        </ul>
      </div>
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
