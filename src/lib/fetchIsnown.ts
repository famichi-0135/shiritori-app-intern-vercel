"use server";

// import { NextResponse } from "next/server";
import kuromoji from "kuromoji";
export async function fetchIsNown(word: string) {
  // const res = await fetch("/api/isNown", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     text: word,
  //   }),
  //   headers: { "Content-Type": "application/json" },
  // });
  // ...

  // const text = "親譲りの無鉄砲で小供の時から損ばかりしている";
  return new Promise<kuromoji.IpadicFeatures[]>((resolve, reject) => {
    kuromoji.builder({ dicPath: "public/dict" }).build((err, tokenizer) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const tokens = tokenizer.tokenize(word);
        console.log(tokens);
        resolve(tokens);
      }
    });
  });
}
