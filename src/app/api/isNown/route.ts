// import type { NextApiRequest, NextApiResponse } from "next";
import kuromoji from "kuromoji";
import { NextRequest, NextResponse } from "next/server";
// import { hTok } from "@/lib/hiraganaToKatakana";

export async function POST(req: NextRequest) {
  const tokens = await new Promise<kuromoji.IpadicFeatures[]>(
    (resolve, reject) => {
      kuromoji.builder({ dicPath: "/dict" }).build(async (err, tokenizer) => {
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

  // console.log(tokens);

  return NextResponse.json(tokens, { status: 200 });
}
