// pdfOcrGate.js

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorkerUrl from "pdfjs-dist/legacy/build/pdf.worker.min?url";

let workerConfigured = false;

function ensurePdfWorker() {
  if (workerConfigured) return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  workerConfigured = true;
}

// Read a small text sample from the first N pages
export async function extractSampleTextFromPdfFile(file, maxPagesToScan = 3) {
  ensurePdfWorker();

  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  // You can keep disableWorker true if you want.
  // With workerSrc configured, you can also remove disableWorker for better performance.
  const loadingTask = pdfjsLib.getDocument({
    data: uint8,
    disableWorker: true,
  });

  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;
  const pagesToScan = Math.min(totalPages, maxPagesToScan);

  let combined = "";

  for (let i = 1; i <= pagesToScan; i += 1) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => (item && item.str) || "")
      .join(" ");
    combined += pageText + "\n";
  }

  await pdf.destroy();
  return combined;
}

// Heuristic: detect "scrambled" text like your example
export function looksGarbledText(text) {
  const s = String(text || "").slice(0, 12000);
  if (!s.trim()) return true;

  const letters = (s.match(/[A-Za-z]/g) || []).length;
  const digits = (s.match(/[0-9]/g) || []).length;
  const spaces = (s.match(/\s/g) || []).length;
  const weird = (s.match(/[^\x09\x0A\x0D\x20-\x7E]/g) || []).length;

  const len = Math.max(1, s.length);

  if ((letters + digits) / len < 0.03 && weird / len > 0.05) return true;
  if (spaces / len < 0.02 && weird / len > 0.1) return true;

  return false;
}

export async function pdfNeedsOcr(file, maxPagesToScan = 3) {
  try {
    const sample = await extractSampleTextFromPdfFile(file, maxPagesToScan);
    return looksGarbledText(sample);
  } catch (err) {
    console.error("Failed to inspect PDF text. Treating as needs OCR:", err);
    return true;
  }
}
