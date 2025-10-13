// src/pages/InviteSurvey.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useParams } from "react-router-dom";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";

const Page = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const BgMapWrap = styled.div`
  position: fixed;
  inset: 0;
  filter: blur(8px) brightness(0.7);
  pointer-events: none;
`;

const Card = styled.div`
  position: relative;
  max-width: 560px;
  margin: 12vh auto 4rem;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
`;

const H1 = styled.h1`
  font-size: 20px;
  margin: 0 0 12px;
`;

const P = styled.p`
  color: #555;
  margin: 0 0 16px;
`;

const Choice = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  background: ${(p) => (p.$active ? "#e9f3ff" : "white")};
  cursor: pointer;
`;

const Submit = styled.button`
  margin-top: 16px;
  background: #4d9fec;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
`;

const Muted = styled.p`
  color: #888;
  font-size: 14px;
`;

const FN_VERIFY =
  import.meta.env.VITE_FN_VERIFY ||
  "https://us-central1-vetcationapp.cloudfunctions.net/verifyClinicInvite";
const FN_SUBMIT = import.meta.env.VITE_FN_SUBMIT;

export default function InviteSurvey() {
  const { clinicId, token } = useParams();

  // verify state
  const [verifying, setVerifying] = useState(true);
  const [valid, setValid] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");

  // page state
  const [clinicName, setClinicName] = useState("Your clinic");
  const [center, setCenter] = useState({ lat: 34.0195, lng: -118.4912 });
  const [nonce, setNonce] = useState("");

  // form state
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  // Verify token first. If invalid, do not show the survey.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setVerifying(true);
        const resp = await fetch(FN_VERIFY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clinicId, token }),
        });
        const json = await resp.json();
        if (!alive) return;

        if (!json.ok) {
          setValid(false);
          setInvalidReason(json.error || "invalid link");
        } else {
          setValid(true);
          setClinicName(json.clinicName || "Your clinic");
          if (
            json.center &&
            typeof json.center.lat === "number" &&
            typeof json.center.lng === "number"
          ) {
            setCenter(json.center);
          }
          setNonce(json.nonce);
        }
      } catch (e) {
        if (!alive) return;
        setValid(false);
        setInvalidReason("network error");
      } finally {
        if (alive) setVerifying(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clinicId, token]);

  const choices = useMemo(
    () => [
      { key: "gp", label: "GP" },
      {
        key: "specialists",
        label:
          "Specialists (dermatology for skin, behavior specialist, pathology for cancer consult)",
      },
      { key: "dog_trainers", label: "Certified dog trainers" },
      { key: "none", label: "None of the above" },
    ],
    []
  );

  const toggle = (key) => {
    const next = new Set(selected);
    if (key === "none") {
      next.clear();
      next.add("none");
    } else {
      if (next.has("none")) next.delete("none");
      next.has(key) ? next.delete(key) : next.add(key);
    }
    setSelected(next);
  };

  const submit = async () => {
    if (selected.size === 0 || !nonce) return;
    setSubmitting(true);
    try {
      const resp = await fetch(FN_SUBMIT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId,
          token,
          nonce,
          interests: Array.from(selected),
        }),
      });
      const json = await resp.json();
      if (!json.ok) throw new Error(json.error || "submit failed");
      setDone(true);
    } catch (e) {
      alert(e.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <Page>
        <Card>
          <H1>Loading…</H1>
          <Muted>Verifying your invite link.</Muted>
        </Card>
      </Page>
    );
  }

  if (!valid) {
    return (
      <Page>
        <Card>
          <H1>Link unavailable</H1>
          <P>This invite link is invalid, expired, or already used.</P>
          {invalidReason && <Muted>Reason: {invalidReason}</Muted>}
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <BgMapWrap>
        {isLoaded && (
          <GoogleMap
            center={center}
            zoom={13}
            onLoad={(m) => m.setOptions({ disableDefaultUI: true })}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{ clickableIcons: false }}
          />
        )}
      </BgMapWrap>

      <Card>
        <H1>{clinicName}</H1>
        {!done ? (
          <>
            <P>
              If you want to expand your service under your brand to your
              clients, which of the following are you interested in
              collaborating with? Select all that apply.
            </P>
            {choices.map((c) => {
              const active = selected.has(c.key);
              return (
                <Choice
                  key={c.key}
                  onClick={() => toggle(c.key)}
                  $active={active}
                >
                  {active ? <FaCheckSquare /> : <FaRegSquare />}{" "}
                  <span>{c.label}</span>
                </Choice>
              );
            })}
            <Submit
              onClick={submit}
              disabled={submitting || selected.size === 0}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Submit>
            <Muted style={{ marginTop: 8 }}>
              Your response will be recorded for this clinic.
            </Muted>
          </>
        ) : (
          <P>Thank you. Your preferences have been saved.</P>
        )}
      </Card>
    </Page>
  );
}
