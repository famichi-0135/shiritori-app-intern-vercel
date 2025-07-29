import kuromoji from "kuromoji";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
// import path from "path";

export async function POST(req: NextRequest) {
  const dicPath = path.join(process.cwd(), "src/app/api/dict");
  const tokens = await new Promise<kuromoji.IpadicFeatures[]>(
    async (resolve, reject) => {
      kuromoji.builder({ dicPath: dicPath }).build(async (err, tokenizer) => {
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

  console.log(tokens);

  return NextResponse.json(tokens, { status: 200 });
}
