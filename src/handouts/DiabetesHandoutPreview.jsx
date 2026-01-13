import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DateTime } from "luxon";
import {
  FiArrowLeft,
  FiPrinter,
  FiUploadCloud,
  FiFileText,
} from "react-icons/fi";

import { firestore, storage } from "../lib/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  buildDiabetesHandoutMarkdown,
  buildActionScheduleRows,
  stripMarkdownToGreeting,
} from "./diabetesTextBuilders";
import { buildFormFromDoc, EMPTY_DIABETES_FORM } from "./diabetesFormModel";

/* Helpers */

function getPxPerInchSafe() {
  if (typeof document === "undefined") return 96;
  const el = document.createElement("div");
  el.style.width = "1in";
  el.style.position = "absolute";
  el.style.left = "-9999px";
  el.style.top = "-9999px";
  document.body.appendChild(el);
  const px = el.getBoundingClientRect().width;
  document.body.removeChild(el);
  return px || 96;
}

function normalizeHex(hex) {
  const h = (hex || "").replace("#", "").trim();
  if (h.length === 3) return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  if (h.length === 6) return `#${h}`;
  return "#b91c1c";
}

function pickTextColorForBg(hex) {
  const h = normalizeHex(hex).replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const toLin = (c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);

  return L > 0.6 ? "#111827" : "#ffffff";
}

function splitMarkdownH2(md, headingText) {
  const lines = (md || "").split(/\r?\n/);
  const headingLine = `## ${headingText}`.toLowerCase();
  const start = lines.findIndex((l) => l.trim().toLowerCase() === headingLine);
  if (start === -1) return { preMd: md, sectionMd: "", restMd: "" };

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      end = i;
      break;
    }
  }

  return {
    preMd: lines.slice(0, start).join("\n"),
    sectionMd: lines.slice(start, end).join("\n"),
    restMd: lines.slice(end).join("\n"),
  };
}

function getExt(fileName) {
  const part = (fileName || "").split(".").pop();
  const ext = (part || "").toLowerCase();
  return ext ? ext.replace(/[^a-z0-9]/g, "") : "bin";
}

function ColorPicker({ value, onChange }) {
  return (
    <input
      type="color"
      value={value || "#b91c1c"}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: 42,
        height: 36,
        border: "none",
        background: "transparent",
      }}
    />
  );
}

async function uploadFileToStorage({ path, file, onProgress }) {
  const sref = storageRef(storage, path);
  const task = uploadBytesResumable(sref, file, { contentType: file.type });

  return await new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (!onProgress) return;
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, path });
      }
    );
  });
}

function Uploader({ accept, buttonText, progress, onPick }) {
  const inputRef = useRef(null);

  return (
    <UploadWrap>
      <HiddenInput
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          onPick(f);
          e.target.value = "";
        }}
      />
      <UploadBtn type="button" onClick={() => inputRef.current?.click()}>
        <FiUploadCloud size={14} />
        <span>{buttonText}</span>
      </UploadBtn>
      {typeof progress === "number" ? (
        <ProgressText>{progress}%</ProgressText>
      ) : null}
    </UploadWrap>
  );
}

export default function DiabetesHandoutPreview({ currentUser }) {
  const { handoutId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState(EMPTY_DIABETES_FORM);

  const [branding, setBranding] = useState({});
  const [petPhotoUrl, setPetPhotoUrl] = useState("");
  const [uploadPct, setUploadPct] = useState({});

  const [pdfStatus, setPdfStatus] = useState("idle"); // "idle" | "generating" | "ready" | "error"
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  const measureRef = useRef(null);
  const [pxPerInch, setPxPerInch] = useState(96);
  const [pageCount, setPageCount] = useState(1);

  // Match whatever your PDF renderer uses
  const PDF_PAGE_MARGIN_IN = 0.4; // matches @page margin: 0.4in
  const PAGE_HEIGHT_IN = 11;
  const PAGE_WIDTH_IN = 8.5;

  const contentHeightIn = useMemo(
    () => PAGE_HEIGHT_IN - PDF_PAGE_MARGIN_IN * 2,
    [PAGE_HEIGHT_IN, PDF_PAGE_MARGIN_IN]
  );

  const contentWidthIn = useMemo(
    () => PAGE_WIDTH_IN - PDF_PAGE_MARGIN_IN * 2,
    [PAGE_WIDTH_IN, PDF_PAGE_MARGIN_IN]
  );

  const pageStepPx = useMemo(() => {
    return contentHeightIn * pxPerInch;
  }, [contentHeightIn, pxPerInch]);

  useEffect(() => {
    document.body.classList.add("print-handout");
    return () => document.body.classList.remove("print-handout");
  }, []);

  useEffect(() => {
    setPxPerInch(getPxPerInchSafe());
  }, []);

  useEffect(() => {
    if (!handoutId) return;

    const ref = doc(firestore, "vetHandouts", handoutId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const data = snap.data();
        setForm(buildFormFromDoc(data));
        setPetPhotoUrl(data.petPhotoUrl || "");
        setNotFound(false);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading preview:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [handoutId]);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const cref = doc(firestore, "customers", currentUser.uid);
    return onSnapshot(cref, (snap) => {
      const data = snap.data() || {};
      setBranding(data.handoutBranding || {});
    });
  }, [currentUser?.uid]);

  /* Derived values (must be defined BEFORE any hook references them) */

  const scheduleRows = useMemo(() => buildActionScheduleRows(form), [form]);

  const fullMd = useMemo(() => buildDiabetesHandoutMarkdown(form), [form]);
  const bodyMd = useMemo(() => stripMarkdownToGreeting(fullMd), [fullMd]);

  const {
    preMd,
    sectionMd: insulinMd,
    restMd,
  } = useMemo(() => splitMarkdownH2(bodyMd, "Insulin directions"), [bodyMd]);

  const bannerColor = normalizeHex(branding.bannerColor || "#b91c1c");
  const bannerTextColor = pickTextColorForBg(bannerColor);

  const docBadge =
    form.species === "feline"
      ? "FELINE DIABETES MELLITUS"
      : "CANINE DIABETES MELLITUS";

  const clinicName = (form.hospitalName || "").trim();
  const clinicAddr = (form.hospitalAddress || "").trim();
  const clinicPhone = (form.hospitalPhone || "").trim();
  const todayStr = DateTime.now().toFormat("MM/dd/yyyy");

  /* Measure total height, then compute pageCount */
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const recompute = () => {
      const h = el.getBoundingClientRect().height || 0;
      const pages = Math.max(1, Math.ceil(h / pageStepPx));
      setPageCount(pages);
    };

    recompute();

    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => recompute());
    ro.observe(el);
    return () => ro.disconnect();
  }, [
    pageStepPx,
    bodyMd,
    petPhotoUrl,
    branding.logoUrl,
    bannerColor,
    bannerTextColor,
    scheduleRows.length,
    clinicName,
    clinicAddr,
    clinicPhone,
    todayStr,
  ]);

  function renderDocument({ attachMeasureRef = false } = {}) {
    return (
      <DocRoot
        $contentWidthIn={contentWidthIn}
        ref={attachMeasureRef ? measureRef : null}
      >
        <HeaderBand $bannerColor={bannerColor} $textColor={bannerTextColor}>
          <HeaderLeft>
            {branding.logoUrl ? (
              <LogoFrame>
                <LogoImg src={branding.logoUrl} alt="Logo" />
              </LogoFrame>
            ) : (
              <LogoText>{clinicName || "Veterinary Clinic"}</LogoText>
            )}
          </HeaderLeft>
          <HeaderRight>
            <Badge $textColor={bannerTextColor}>{docBadge}</Badge>
          </HeaderRight>
        </HeaderBand>

        <ClinicBlock>
          {clinicName ? (
            <ClinicLineStrong>{clinicName}</ClinicLineStrong>
          ) : null}
          {clinicAddr ? <ClinicLine>{clinicAddr}</ClinicLine> : null}
          {clinicPhone ? <ClinicLine>{clinicPhone}</ClinicLine> : null}
          <ClinicMetaRow>
            <ClinicMeta>Date: {todayStr}</ClinicMeta>
          </ClinicMetaRow>
        </ClinicBlock>

        {scheduleRows.length > 0 ? (
          <ScheduleBlock>
            <ScheduleHeading>Daily schedule at a glance</ScheduleHeading>
            <ScheduleTable>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>How often</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.task}</td>
                    <td>{row.frequency}</td>
                    <td>{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </ScheduleTable>
          </ScheduleBlock>
        ) : null}

        <Body>
          <StyledMarkdown>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{preMd}</ReactMarkdown>
          </StyledMarkdown>

          {insulinMd ? (
            <InsulinRow>
              <InsulinText>
                <StyledMarkdown>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {insulinMd}
                  </ReactMarkdown>
                </StyledMarkdown>
              </InsulinText>
              {petPhotoUrl ? (
                <SidePhoto src={petPhotoUrl} alt="Pet photo" />
              ) : null}
            </InsulinRow>
          ) : null}

          <StyledMarkdown>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{restMd}</ReactMarkdown>
          </StyledMarkdown>
        </Body>
      </DocRoot>
    );
  }

  async function handleGeneratePdf() {
    if (!handoutId) return;

    setPdfStatus("generating");
    setPdfError(null);

    try {
      await updateDoc(doc(firestore, "vetHandouts", handoutId), {
        renderedBodyMd: bodyMd,
        scheduleRows,
        pdf: {
          status: "queued",
          requestedAt: serverTimestamp(),
          errorMessage: null,
        },
        updatedAt: serverTimestamp(),
      });

      const resp = await fetch(
        "https://us-central1-vetcationapp.cloudfunctions.net/generateDiabetesHandoutPdf",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handoutId, vetUid: currentUser?.uid || null }),
        }
      );

      const json = await resp.json();
      if (!resp.ok || !json.ok)
        throw new Error(json.error || "Failed to generate PDF");

      const pdfPath = json.storagePath;
      const url = await getDownloadURL(storageRef(storage, pdfPath));

      setPdfUrl(url);
      setPdfStatus("ready");
      window.open(url, "_blank");
    } catch (e) {
      setPdfStatus("error");
      setPdfError(e.message || String(e));
    }
  }

  const handlePrint = () => window.print();

  async function handleUploadLogo(file) {
    if (!currentUser?.uid || !file) return;
    const ext = getExt(file.name) || "png";
    const path = `handouts/branding/${currentUser.uid}/logo.${ext}`;

    const { url, path: savedPath } = await uploadFileToStorage({
      path,
      file,
      onProgress: (pct) => setUploadPct((p) => ({ ...p, logo: pct })),
    });

    await updateDoc(doc(firestore, "customers", currentUser.uid), {
      "handoutBranding.logoUrl": url,
      "handoutBranding.logoPath": savedPath,
      "handoutBranding.updatedAt": serverTimestamp(),
    });
  }

  async function handleBannerColorChange(nextColor) {
    if (!currentUser?.uid) return;

    setBranding((b) => ({ ...b, bannerColor: nextColor }));
    const cref = doc(firestore, "customers", currentUser.uid);

    try {
      await updateDoc(cref, {
        "handoutBranding.bannerColor": nextColor,
        "handoutBranding.updatedAt": serverTimestamp(),
      });
    } catch {
      await setDoc(cref, {}, { merge: true });
      await updateDoc(cref, {
        "handoutBranding.bannerColor": nextColor,
        "handoutBranding.updatedAt": serverTimestamp(),
      });
    }
  }

  async function handleUploadPetPhoto(file) {
    if (!handoutId || !file) return;
    const ext = getExt(file.name) || "jpg";
    const path = `handouts/vetHandouts/${handoutId}/pet_photo.${ext}`;

    const { url } = await uploadFileToStorage({
      path,
      file,
      onProgress: (pct) => setUploadPct((p) => ({ ...p, petPhoto: pct })),
    });

    await updateDoc(doc(firestore, "vetHandouts", handoutId), {
      petPhotoUrl: url,
      updatedAt: serverTimestamp(),
    });

    setPetPhotoUrl(url);
  }

  if (loading) {
    return (
      <Shell data-handout-shell>
        <TopRow className="no-print">
          <Title>Preview</Title>
        </TopRow>
        <Hint>Loading preview...</Hint>
      </Shell>
    );
  }

  if (notFound) {
    return (
      <Shell data-handout-shell>
        <TopRow className="no-print">
          <Title>Handout not found</Title>
        </TopRow>
        <Hint>
          This handout does not exist or you do not have access to it.
        </Hint>
      </Shell>
    );
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <Shell data-handout-shell>
      <TopBar className="no-print">
        <BackBtn
          type="button"
          onClick={() => navigate(`/ai/handouts/${handoutId}`)}
        >
          <FiArrowLeft size={14} />
          <span>Back to editor</span>
        </BackBtn>

        <TopActions>
          <TopBtn type="button" onClick={handlePrint}>
            <FiPrinter size={14} />
            <span>Print</span>
          </TopBtn>

          <TopBtn
            type="button"
            onClick={handleGeneratePdf}
            disabled={pdfStatus === "generating"}
          >
            <FiFileText size={14} />
            <span>
              {pdfStatus === "generating" ? "Generating..." : "Generate PDF"}
            </span>
          </TopBtn>
        </TopActions>
      </TopBar>

      {pdfStatus === "error" && (
        <ErrorText className="no-print">
          Error generating PDF: {pdfError || "Unknown error"}
        </ErrorText>
      )}

      {pdfStatus === "ready" && pdfUrl && (
        <SuccessText className="no-print">
          PDF generated.{" "}
          <a href={pdfUrl} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        </SuccessText>
      )}

      <AssetsCard className="no-print">
        <AssetsTitle>Branding and photo</AssetsTitle>

        <AssetRow>
          <AssetLabel>Clinic logo</AssetLabel>
          <AssetControls>
            {branding.logoUrl ? (
              <Thumb src={branding.logoUrl} alt="Clinic logo" />
            ) : (
              <ThumbPlaceholder />
            )}
            <Uploader
              accept="image/*"
              buttonText="Upload logo"
              progress={uploadPct.logo}
              onPick={handleUploadLogo}
            />
          </AssetControls>
        </AssetRow>

        <AssetRow>
          <AssetLabel>
            Client pet photo (shows beside Insulin directions)
          </AssetLabel>
          <AssetControls>
            {petPhotoUrl ? (
              <Thumb src={petPhotoUrl} alt="Pet" />
            ) : (
              <ThumbPlaceholder />
            )}
            <Uploader
              accept="image/*"
              buttonText="Upload pet photo"
              progress={uploadPct.petPhoto}
              onPick={handleUploadPetPhoto}
            />
          </AssetControls>
        </AssetRow>

        <AssetRow>
          <AssetLabel>Banner color</AssetLabel>
          <AssetControls>
            <ColorPicker
              value={branding.bannerColor}
              onChange={handleBannerColorChange}
            />
          </AssetControls>
        </AssetRow>
      </AssetsCard>

      {/* Hidden measurement copy */}
      <MeasureStage aria-hidden="true">
        {renderDocument({ attachMeasureRef: true })}
      </MeasureStage>

      <PreviewFrame data-handout-preview-frame>
        <PagesStack>
          {pages.map((pageIdx) => (
            <PageWrap key={pageIdx}>
              {pageCount > 1 ? (
                <PagePill className="no-print">
                  Page {pageIdx + 1} of {pageCount}
                </PagePill>
              ) : null}

              <PageSheet data-handout-paper>
                <PageClip $pageMarginIn={PDF_PAGE_MARGIN_IN}>
                  <PageTranslate
                    $contentWidthIn={contentWidthIn}
                    style={{
                      transform: `translateY(-${Math.round(
                        pageIdx * pageStepPx
                      )}px)`,
                    }}
                  >
                    {renderDocument()}
                  </PageTranslate>
                </PageClip>
              </PageSheet>
            </PageWrap>
          ))}
        </PagesStack>
      </PreviewFrame>
    </Shell>
  );
}

/* Styles */

const TopActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ErrorText = styled.div`
  color: #fca5a5;
  margin-bottom: 8px;
  font-size: 13px;
`;

const SuccessText = styled.div`
  color: #a7f3d0;
  margin-bottom: 8px;
  font-size: 13px;

  a {
    color: #6ee7b7;
    text-decoration: underline;
  }
`;

const Shell = styled.div`
  padding: 24px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const TopRow = styled.div`
  margin-bottom: 12px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const Hint = styled.div`
  color: #9ca3af;
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #303030;
  background: #151515;
  color: #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
`;

const TopBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #303030;
  background: #151515;
  color: #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AssetsCard = styled.div`
  border: 1px solid #303030;
  background: #101010;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 16px;
`;

const AssetsTitle = styled.div`
  font-weight: 700;
  margin-bottom: 10px;
`;

const AssetRow = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 12px;
  padding: 10px 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const AssetLabel = styled.div`
  color: #cbd5e1;
  font-size: 14px;
`;

const AssetControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const UploadWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #303030;
  background: #151515;
  color: #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const Thumb = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #2b2b2b;
`;

const ThumbPlaceholder = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #2b2b2b;
  background: #0b0b0b;
`;

const PreviewFrame = styled.div`
  display: flex;
  justify-content: center;
`;

const PagesStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;

  /* NEW: extra space after the final page */
  padding-bottom: 24px;

  @media print {
    padding-bottom: 0;
    gap: 0;
  }
`;

const PageWrap = styled.div`
  width: 8.5in;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PagePill = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin: 0 0 8px 2px;
`;

const PageSheet = styled.div`
  width: 8.5in;
  height: 11in;
  background: #fff;
  color: #111827;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  overflow: hidden;

  @media print {
    box-shadow: none;
    border-radius: 0;
  }
`;

const PageClip = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  /* This simulates @page margin: 0.4in in the PDF */
  padding: ${(p) => `${p.$pageMarginIn || 0}in`};
`;

const PageTranslate = styled.div`
  width: ${(p) => `${p.$contentWidthIn || 8.5}in`};
`;

const MeasureStage = styled.div`
  position: absolute;
  left: -9999px;
  top: 0;
  visibility: hidden;
  pointer-events: none;
`;

const DocRoot = styled.div`
  width: ${(p) => `${p.$contentWidthIn || 8.5}in`};
  background: #fff;
  color: #111827;

  /* Helps avoid tiny layout differences from global CSS */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

const HeaderBand = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: ${(p) => p.$bannerColor || "#b91c1c"};
  color: ${(p) => p.$textColor || "#fff"};

  @media print {
    background: ${(p) => p.$bannerColor || "#b91c1c"} !important;
    color: ${(p) => p.$textColor || "#fff"} !important;
    break-after: avoid;
  }
`;

const LogoFrame = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 8px 10px;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.35);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoImg = styled.img`
  height: 44px;
  max-width: 240px;
  object-fit: contain;
  display: block;
`;

const LogoText = styled.div`
  color: inherit;
  font-weight: 800;
  letter-spacing: 0.4px;
`;

const HeaderRight = styled.div``;

const Badge = styled.div`
  color: ${(p) => p.$textColor || "#fff"};
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const ClinicBlock = styled.div`
  padding: 18px 22px 6px 22px;
`;

const ClinicLineStrong = styled.div`
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 2px;
`;

const ClinicLine = styled.div`
  font-size: 13px;
  margin-bottom: 2px;
`;

const ClinicMetaRow = styled.div`
  margin-top: 10px;
`;

const ClinicMeta = styled.div`
  font-size: 12px;
  color: #374151;
`;

const ScheduleBlock = styled.div`
  padding: 10px 22px 0 22px;

  @media print {
    break-inside: avoid;
  }
`;

const ScheduleHeading = styled.div`
  font-weight: 800;
  margin: 8px 0 8px 0;
`;

const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 8px;
    vertical-align: top;
  }

  th {
    text-align: left;
    background: #f3f4f6;
    font-weight: 800;
  }

  @media print {
    tr {
      break-inside: avoid;
    }
    thead {
      display: table-header-group;
    }
  }
`;

const Body = styled.div`
  padding: 14px 22px 26px 22px;
`;

const InsulinRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 14px;
  align-items: start;

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media print {
    grid-template-columns: 1fr 180px !important;
    break-inside: avoid;
  }
`;

const InsulinText = styled.div``;

const SidePhoto = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid #e5e7eb;

  @media print {
    width: 150px;
    height: 150px;
  }
`;

const StyledMarkdown = styled.div`
  font-family: Georgia, "Times New Roman", Times, serif;
  line-height: 1.45;

  h1 {
    display: none;
  }

  h2 {
    margin: 16px 0 8px 0;
    color: #b91c1c;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    font-size: 16px;
  }

  h3 {
    margin: 10px 0 6px 0;
    font-size: 14px;
    font-weight: 800;
  }

  p {
    margin: 8px 0;
    font-size: 13.5px;
  }

  ul {
    margin: 8px 0 8px 18px;
  }

  li {
    margin: 4px 0;
    font-size: 13.5px;
  }

  strong {
    font-weight: 800;
  }
`;
