"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { randomWord } from "@/lib/randamNewWord";
import { fetchIsNown } from "@/lib/fetchIsnown";
import { token } from "@/types/type";
import { hTok } from "@/lib/hiraganaToKatakana";
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
  const resetGame = () => {
    const randamword = randomWord();
    setWords([randamword || "しりとり"]);
    setKwords([hTok(randamword || "しりとり")]);
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
    if (previous.at(-1) !== current[0]) return RuleViolation.NotConnected;
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
      // console.log(isNoun);
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
      const violation = checkShiritoriRules(hTok(prevWord), isNoun[0].reading);

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
      setKwords([...kwords, isNoun[isNoun.length - 1].reading]);
      console.log(words);
      console.log(kwords);
    }

    if (action === "reset") {
      alert("リセットします");
      resetGame();
    }
  };

  return (
    <div className="mt-6 mx-8">
      <div className="flex-col space-y-4 max-w-3xl">
        <div className="p-4 border rounded-xl">
          <div className="text-gray-500">前回の言葉</div>
          <p className="text-indigo-600 text-lg font-bold">{words.at(-1)}</p>
        </div>

        <form action={handleClick}>
          <div className="flex">
            <Input
              className="mr-12 rounded-lg"
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

        <div className="max-w-3xl border-1 rounded-xl p-6">
          <div className="text-gray-500 mb-2">履歴</div>
          {words.slice(1).map((word, idx) => (
            <p key={word} className="text-sm">
              {idx + 1}. {word}（{kwords[idx + 1]}）
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
