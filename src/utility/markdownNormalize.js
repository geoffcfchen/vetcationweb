function normalizeLooseLists(input) {
  if (!input) return "";

  let out = input;

  out = out.replace(/\n[ \t]+\n/g, "\n\n");

  // collapse any huge vertical gaps
  out = out.replace(/\n{3,}/g, "\n\n");

  // tighten lists even if there are 2+ blank lines
  out = out.replace(/\n{2,}(?=\d+\.\s)/g, "\n");
  out = out.replace(/\n{2,}(?=-\s)/g, "\n");

  return out;
}

function normalizeMarkdown(input) {
  if (!input) return "";
  let out = normalizeMathDelimiters(input);
  // if you added a <br> normalizer, keep that too
  // out = normalizeHtmlBreaks(out);
  out = normalizeLooseLists(out);
  return out;
}
function normalizeMathDelimiters(input) {
  if (!input) return "";

  const sanitizeMath = (s) => s.replace(/\|/g, "\\vert ");

  let out = input;

  // \[ ... \]  -> $$ ... $$
  out = out.replace(/\\{1,2}\[([\s\S]*?)\\{1,2}\]/g, (_, content) => {
    const inner = sanitizeMath(content.trim());
    return `\n\n$$\n${inner}\n$$\n\n`;
  });

  // \( ... \) -> $ ... $
  out = out.replace(/\\{1,2}\(([\s\S]*?)\\{1,2}\)/g, (_, content) => {
    const inner = sanitizeMath(content.trim());
    return `$${inner}$`;
  });

  return out;
}

export { normalizeMarkdown, normalizeMathDelimiters, normalizeLooseLists };
