function extractCitationKeysFromMarkdown(markdown) {
  return new Set(extractCitationKeysInOrder(markdown));
}

function extractCitationKeysInOrder(markdown) {
  const ordered = [];
  const seen = new Set();
  if (!markdown) return ordered;

  const add = (key) => {
    if (!key) return;
    if (!seen.has(key)) {
      seen.add(key);
      ordered.push(key);
    }
  };

  const addRange = (prefix, startNum, endNum) => {
    const a = Number(startNum);
    const b = Number(endNum);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return;

    const step = a <= b ? 1 : -1;
    for (let n = a; step > 0 ? n <= b : n >= b; n += step) {
      add(`${prefix}${n}`);
    }
  };

  const parseInner = (inner) => {
    if (!inner) return;

    // Supports:
    // - "L2, L5, L6; W1"
    // - "L1-L7" / "L1–L7"
    // - "L1-7"  (implied same prefix)
    const innerRe =
      /([LAW])\s*(\d+)(?:\s*[-\u2013\u2014]\s*([LAW])?\s*(\d+))?/g;

    let m;
    while ((m = innerRe.exec(inner)) !== null) {
      const prefix = m[1];
      const start = m[2];
      const endPrefix = m[3] || prefix;
      const end = m[4];

      if (end && endPrefix === prefix) {
        addRange(prefix, start, end);
      } else {
        add(`${prefix}${start}`);
        if (end) add(`${endPrefix}${end}`);
      }
    }
  };

  // Matches either:
  // 1) Range across two bracket blocks: [L1]-[L7]
  // 2) Any single bracket block: [ ... ]
  const re = /\[([LAW])(\d+)\]\s*[-\u2013\u2014]\s*\[\1(\d+)\]|\[([^\]]+)\]/g;

  let match;
  while ((match = re.exec(markdown)) !== null) {
    // Case 1: [L1]-[L7]
    if (match[1] && match[2] && match[3]) {
      addRange(match[1], match[2], match[3]);
      continue;
    }

    // Case 2: [ ... ]
    const inner = match[4];
    parseInner(inner);
  }

  return ordered;
}

export { extractCitationKeysFromMarkdown, extractCitationKeysInOrder };
