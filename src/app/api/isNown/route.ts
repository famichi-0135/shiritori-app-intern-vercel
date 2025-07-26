// import type { NextApiRequest, NextApiResponse } from "next";
import kuromoji from "kuromoji";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
// import { hTok } from "@/lib/hiraganaToKatakana";

export async function POST(req: NextRequest) {
  const dicPath = path.join(process.cwd(), "node_modules/kuromoji/dict");

  // Wrap the tokenizer build and usage in a Promise
  const tokens = await new Promise<kuromoji.IpadicFeatures[]>(
    (resolve, reject) => {
      kuromoji.builder({ dicPath }).build(async (err, tokenizer) => {
        if (err || !tokenizer) {
          reject(new Error("Tokenizer build failed"));
          return;
        }

        const body = (await req.json()) as { text: string };
        const { text } = body;
        console.log(text);
        const tokens = tokenizer.tokenize(text);
        resolve(tokens);
      });
    }
  );

  console.log(tokens);
  // let cnt = 0;
  // tokens.map((token) => {
  //   if (token.pos === "名詞") {
  //     cnt++;
  //   }
  // });
  // if (cnt > tokens.length - 3) {
    
  // }

  return NextResponse.json(tokens, { status: 200 });
}
