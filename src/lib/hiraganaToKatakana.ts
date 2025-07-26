export function hTok(words:string) {
  return words.replace(/[\u3041-\u3096]/g, (char) => {
    const code = char.charCodeAt(0);
    return String.fromCharCode(code + 0x60);
  });
} 