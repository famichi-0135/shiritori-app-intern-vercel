import kuromoji from "kuromoji";
// ...
export default function Home() {
  const text = "親譲りの無鉄砲で小供の時から損ばかりしている";
  kuromoji.builder({ dicPath: "public/dict" }).build((err, tokenizer) => {
    if (err) {
      console.log(err);
    } else {
      const tokens = tokenizer.tokenize(text);
      console.log(tokens);
    }
  });
}
