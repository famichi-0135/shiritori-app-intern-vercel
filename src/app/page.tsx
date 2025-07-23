"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { randomWord } from "@/lib/randamNewWord";
import { useEffect, useState } from "react";

// bun run deployで再デプロイ

export default function Home() {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords([randomWord() || "しりとり"]);
  }, []);

  function handleClick(formData: FormData) {
    const action = formData.get("action");
    const shiritori = formData.get("shiritori");
    if (action === "submit") {
      if (typeof shiritori !== "string" || shiritori === "") {
        alert("未入力です");
        return;
      }
      for (let i = 0; i < words.length; i++) {
        if (words.at(i) === shiritori) {
          alert("過去に使用した単語です。\n あなたの負け");
          setWords([randomWord() || "しりとり"]);
          return;
        }
      }
      console.log(words.at(-1)?.at(-1));
      if (words.at(-1)?.at(-1) !== shiritori[0]) {
        alert("しりとりの条件を満たしていません。\n やり直してください");
      } else if (shiritori.at(-1) === "ん") {
        alert("最後の文字が「ん」です。\n あなたの負け");
        setWords([randomWord() || "しりとり"]);
        return;
      } else {
        console.log(shiritori);
        setWords([...words, shiritori]);
      }
    } else if (action === "reset") {
      alert("リセットします");
      setWords([randomWord() || "しりとり"]);
    }
  }
  return (
    <div className="mt-6 mx-8">
      <div className="flex-col space-y-4 max-w-3xl">
        <div className="p-4 border rounded-xl">
          <div className="text-gray-500">前回の言葉</div>
          <p className="text-indigo-600 text-lg font-bold">{words.slice(-1)}</p>
        </div>
        <form action={handleClick}>
          <div className="flex">
            <Input className="mr-12 rounded-lg" type="text" name="shiritori" />
            <div className="flex">
              <Button
                className="mr-4 bg-indigo-500 hover:bg-indigo-600"
                name="action"
                value="submit"
              >
                送信
              </Button>
              <Button
                className="bg-indigo-500 hover:bg-indigo-600"
                name="action"
                value="reset"
              >
                リセット
              </Button>
            </div>
          </div>
        </form>

        <div className="max-w-3xl border-1 rounded-xl p-6">
          <div className="text-gray-500 space-y-4">履歴</div>
          {words.map((word: string, idx) =>
            idx !== 0 ? (
              <div key={word}>
                <p className="text-sm space-y-2">
                  {idx}
                  {". "}
                  {word}
                </p>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
