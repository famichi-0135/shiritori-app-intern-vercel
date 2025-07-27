const smallToLeargeKana = [
  [
    "ァ",
    "ィ",
    "ゥ",
    "ェ",
    "ォ",
    "ャ",
    "ュ",
    "ョ",
    "ガ",
    "ギ",
    "グ",
    "ゲ",
    "ゴ",
    "ザ",
    "ジ",
    "ズ",
    "ゼ",
    "ゾ",
    "ダ",
    "ヂ",
    "ヅ",
    "デ",
    "ド",
    "バ",
    "ビ",
    "ブ",
    "ベ",
    "ボ",
    "パ",
    "ピ",
    "プ",
    "ペ",
    "ポ",
  ],
  [
    "ア",
    "イ",
    "ウ",
    "エ",
    "オ",
    "ヤ",
    "ユ",
    "ヨ",
    "カ",
    "キ",
    "ク",
    "ケ",
    "コ",
    "サ",
    "シ",
    "ス",
    "セ",
    "ソ",
    "タ",
    "チ",
    "ツ",
    "テ",
    "ト",
    "ハ",
    "ヒ",
    "フ",
    "ヘ",
    "ホ",
    "ハ",
    "ヒ",
    "フ",
    "ヘ",
    "ホ",
  ],
];

export function sToB(word: string): string {
  if (!word) {
    return "";
  }
  let lastchar;
  if (word.at(-1) === "ー") {
    lastchar = word.at(word.length -  2);
  } else {
    lastchar = word.at(-1);
  }

  for (let i = 0; i < smallToLeargeKana[0].length; i++) {
    if (lastchar === smallToLeargeKana.at(0)?.at(i)) {
      return smallToLeargeKana.at(1)?.at(i) ?? "";
    }
  }
  return lastchar ?? "";
}
