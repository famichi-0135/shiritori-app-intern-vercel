export function randomWord() {
  const randomWords = [
    "リンゴ",
    "電卓",
    "柴犬",
    "チワワ",
    "苺",
    "あんこ",
    "海",
    "エンジニア",
    "狼",
    "分析",
    "クイックソート",
    "ビット",
  ];
  return randomWords.at(Math.random() * randomWords.length);
}
