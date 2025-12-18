function stripOpenAIUtmParams(text) {
  if (!text || typeof text !== "string") return text;
  return text.replace(/\?utm_source=openai/g, "");
}

function normalizeSourceDescriptor(raw, index) {
  if (!raw) return null;

  // Plain string source (for backward compatibility)
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    const isUrl = /^https?:\/\//i.test(trimmed);

    if (isUrl) {
      let hostname = trimmed;
      try {
        const u = new URL(trimmed);
        hostname = u.hostname.replace(/^www\./, "");
      } catch {
        // ignore parse errors
      }
      return {
        id: `s-${index}`,
        sourceType: "web",
        url: trimmed,
        title: trimmed,
        site: hostname,
        displayLabel: hostname,
        citationKey: null,
      };
    }

    return {
      id: `s-${index}`,
      sourceType: "other",
      title: trimmed,
      displayLabel: trimmed,
      citationKey: null,
    };
  }

  // Object shape
  const base = { ...raw };
  const sourceType =
    raw.sourceType || raw.kind || raw.type || (raw.url ? "web" : "library");

  // This is the thing that must match [L1], [A1], [W1] in the markdown
  const citationKey = raw.citationKey || raw.label || raw.key || null;

  if (!base.id) {
    base.id = raw.id || raw.sourceId || raw.chunkId || raw.key || `s-${index}`;
  }

  if (sourceType === "web") {
    const urlRaw = raw.url || raw.href || null;
    const url = urlRaw ? stripOpenAIUtmParams(urlRaw) : null;

    let site = raw.site || null;
    if (!site && url) {
      try {
        const u = new URL(url);
        site = u.hostname.replace(/^www\./, "");
      } catch {
        // ignore parse errors
      }
    }

    const rawSnippet = raw.snippet || raw.chunkText || raw.text || "";
    const snippet = stripOpenAIUtmParams(rawSnippet);

    return {
      ...base,
      sourceType: "web",
      citationKey,
      url,
      site,
      title: raw.title || raw.key || url || "Web reference",
      snippet,
      // Make sure the modal can show this text
      chunkText: snippet,
      displayLabel: raw.title || site || "Web",
    };
  }

  if (sourceType === "library") {
    const bookTitle =
      raw.bookTitle || raw.sourceTitle || raw.title || "Library source";

    return {
      ...base,
      sourceType: "library",
      citationKey,
      bookTitle,
      pageNumber: raw.pageNumber ?? null,
      chunkText: raw.chunkText || raw.text || raw.snippet || "",
      downloadUrl: raw.downloadUrl || null,
      displayLabel:
        bookTitle + (raw.pageNumber != null ? ` (p. ${raw.pageNumber})` : ""),
    };
  }

  if (sourceType === "attachment") {
    const title = raw.title || "Attachment";
    return {
      ...base,
      sourceType: "attachment",
      citationKey,
      title,
      chunkText: raw.excerpt || raw.text || raw.snippet || "",
      downloadUrl: raw.downloadUrl || null,
      displayLabel: raw.label || raw.key || title,
    };
  }

  // Fallback
  return {
    ...base,
    sourceType,
    citationKey,
    displayLabel: raw.title || raw.key || "Source",
  };
}

export { normalizeSourceDescriptor, stripOpenAIUtmParams };
