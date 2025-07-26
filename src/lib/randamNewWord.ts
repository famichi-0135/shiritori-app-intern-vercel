export function randomWord() {
  const randomWords = [
    "りんご",
    "じぐ",
    "しばいぬ",
    "ちわわ",
    "ちいかわ",
    "いちご",
    "あんこ",
    "うみ",
    "えんじにあ",
    "おおかみ",
    "にぶんき",
    "くいっくそーと",
    "びっと",
  ];
  return randomWords.at(Math.random() * randomWords.length);
}
