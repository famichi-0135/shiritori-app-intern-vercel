export async function fetchIsNown(word: string) {
  const res = await fetch("/api/isNown", {
    method: "POST",
    body: JSON.stringify({
      text: word,
    }),
    headers: { "Content-Type": "application/json" },
  });

  // const tokens = await res.json();
  // for (let i = 0; i < tokens.length; i++)

  return res;
}
