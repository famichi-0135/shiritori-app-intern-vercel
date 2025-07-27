// import type { NextApiRequest, NextApiResponse } from "next";
import kuromoji from "kuromoji";
import { NextRequest, NextResponse } from "next/server";
// import { hTok } from "@/lib/hiraganaToKatakana";

export async function POST(req: NextRequest) {
  const tokens = await new Promise<kuromoji.IpadicFeatures[]>(
    async (resolve, reject) => {
      kuromoji.builder({ dicPath: "public/dict" }).build(async (err, tokenizer) => {
        if (err || !tokenizer) {
          reject(new Error("Tokenizer build failed"));
          return;
        }
        const body = (await req.json()) as { text: string };
        const { text } = body;
        console.log(text);
        const result = tokenizer.tokenize(text);
        console.log(result);
        resolve(result);
      });
    }
  );

  // console.log(tokens);

  return NextResponse.json(tokens, { status: 200 });
}
