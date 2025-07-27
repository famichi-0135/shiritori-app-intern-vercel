// import { NextRequest, NextResponse } from "next/server";

export async function fetchIsNown(word: string) {
  const res = await fetch("/api/isNown", {
    method: "POST",
    body: JSON.stringify({
      text: word,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return res;
}
