import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiKey } from "react-icons/fi";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../../lib/firebase";

export default function ScanQrOnboardingPage() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const uid = auth.currentUser?.uid || null;

  const cleanedCode = useMemo(
    () => code.replace(/\D/g, "").slice(0, 6),
    [code],
  );
  const canSubmit = cleanedCode.length === 6 && !submitting;

  const verifyReferralCode = async (sixDigitCode) => {
    const ref = doc(firestore, "referralCodes", sixDigitCode);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return { ok: false, reason: "Code does not exist." };
    }

    const data = snap.data() || {};
    const expiresAt = data.expiresAt;

    if (!expiresAt || !expiresAt.toDate) {
      return { ok: false, reason: "Code has no expiry." };
    }

    const isValid = new Date() < expiresAt.toDate();
    if (!isValid) {
      return { ok: false, reason: "Code is expired." };
    }

    return { ok: true, data };
  };

  const handleSubmit = async () => {
    setError("");

    if (!uid) {
      setError("Missing user session. Please sign in again.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await verifyReferralCode(cleanedCode);

      if (!result.ok) {
        setError(result.reason || "Invalid code. Please try again.");
        return;
      }

      // Optional but useful: store what code was used (and when) on the customer doc
      // If your rules block this write, verification can still succeed.
      try {
        await updateDoc(doc(firestore, "customers", uid), {
          referralCode: cleanedCode,
          referralVerifiedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("Could not store referralCode on customer:", e);
      }

      navigate("/onboarding/select-clinic", { replace: true });
    } catch (e) {
      console.error(e);
      setError("Error verifying code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <TopBar>
        <BackBtn
          type="button"
          onClick={() => navigate("/onboarding/role", { replace: true })}
          disabled={submitting}
        >
          <FiArrowLeft />
          Back
        </BackBtn>

        <Brand>MyPet Health</Brand>
        <Spacer />
      </TopBar>

      <Main>
        <Card>
          <Header>
            <H1>Enter shelter code</H1>
            <Sub>
              This step is for shelters, rescues, and organizations. Enter the
              6-digit code to continue.
            </Sub>
          </Header>

          <Field>
            <Label>6-digit code</Label>
            <InputRow>
              <IconWrap>
                <FiKey />
              </IconWrap>

              <CodeInput
                value={cleanedCode}
                onChange={(e) => {
                  setError("");
                  setCode(e.target.value);
                }}
                placeholder="123456"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                autoFocus
                disabled={submitting}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit) handleSubmit();
                }}
              />
            </InputRow>

            <Help>
              If you do not have a code, email{" "}
              <EmailLink href="mailto:gcfchen@vetcation.com">
                gcfchen@vetcation.com
              </EmailLink>{" "}
              and we will provide a 6-digit code.
            </Help>

            {error ? <ErrorBanner>{error}</ErrorBanner> : null}
          </Field>

          <BottomRow>
            <PrimaryBtn
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {submitting ? "Checking…" : "Submit"}
            </PrimaryBtn>
          </BottomRow>
        </Card>
      </Main>
    </Page>
  );
}

/* styled-components */

const Page = styled.div`
  min-height: 100vh;
  background: #f7f7f9;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  padding: 14px 19px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
  backdrop-filter: saturate(140%) blur(8px);

  @media (max-width: 768px) {
    padding: 10px 14px;
  }
`;

const BackBtn = styled.button`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: #111827;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Brand = styled.div`
  justify-self: center;
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const Spacer = styled.div`
  justify-self: end;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26px 16px 30px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const Header = styled.div`
  padding: 2px 2px 10px;
`;

const H1 = styled.div`
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
`;

const Sub = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.45;
`;

const Field = styled.div`
  margin-top: 12px;
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 8px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  padding: 12px 14px;
`;

const IconWrap = styled.div`
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const CodeInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 18px;
  letter-spacing: 0.18em;
  font-weight: 900;
  color: #111827;
`;

const Help = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
`;

const EmailLink = styled.a`
  color: #1d4ed8;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #1e40af;
  }
`;

const ErrorBanner = styled.div`
  margin-top: 10px;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 800;
  color: #991b1b;
  background: #fee2e2;
`;

const BottomRow = styled.div`
  margin-top: 16px;
`;

const PrimaryBtn = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #111827;
  color: #ffffff;
  font-weight: 900;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
