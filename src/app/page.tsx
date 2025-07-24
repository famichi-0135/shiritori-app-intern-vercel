"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { randomWord } from "@/lib/randamNewWord";

// ルール違反の種類を表す enum
enum RuleViolation {
  None,
  NotConnected,
  EndsWithN,
}

export default function Home() {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    resetGame();
  }, []);

  //ゲームのリセット
  const resetGame = () => {
    setWords([randomWord() || "しりとり"]);
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
    if (previous.at(-1) !== current[0]) return RuleViolation.NotConnected;
    if (current.at(-1) === "ん") return RuleViolation.EndsWithN;
    return RuleViolation.None;
  };

  //単語が重複していないか
  const isDuplicate = (word: string): boolean => {
    return words.includes(word);
  };

  const handleClick = (formData: FormData) => {
    const action = formData.get("action");
    const input = validateInput(formData.get("shiritori"));

    if (action === "submit") {
      if (!input) {
        alert("未入力です");
        return;
      }

      if (isDuplicate(input)) {
        alert("過去に使用した単語です。\nあなたの負け");
        resetGame();
        return;
      }

      const prevWord = words.at(-1) || "";
      const violation = checkShiritoriRules(prevWord, input);

      if (violation === RuleViolation.NotConnected) {
        alert("しりとりの条件を満たしていません。\nやり直してください");
        return;
      } else if (violation === RuleViolation.EndsWithN) {
        alert("最後の文字が「ん」です。\nあなたの負け");
        resetGame();
        return;
      }

      setWords([...words, input]);
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
              {idx + 1}. {word}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
