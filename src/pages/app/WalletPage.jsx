// src/pages/app/WalletPage.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import {
  FiPlus,
  FiCreditCard,
  FiRefreshCw,
  FiX,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
import { DateTime } from "luxon";

import GlobalContext from "../../context/GlobalContext";
import { auth, firestore } from "../../lib/firebase";

// Cloud Run endpoints (same as RN)
const ENDPOINTS = {
  retrievePaymentMethods:
    "https://retrievepaymentmethods-dr6lirynsq-uc.a.run.app",
  updateDefaultPaymentMethod:
    "https://updatedefaultpaymentmethod-dr6lirynsq-uc.a.run.app",
  chargeCustomer: "https://chargecustomer-dr6lirynsq-uc.a.run.app",
};

const AMOUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

function toCents(amountDollars) {
  const n = Number(amountDollars || 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n * 100));
}

function fromCents(cents) {
  const n = Number(cents || 0);
  if (!Number.isFinite(n)) return 0;
  return n / 100;
}

function readCents(obj, centsField, legacyField) {
  const cents = obj?.[centsField];
  if (typeof cents === "number" && Number.isFinite(cents))
    return Math.round(cents);

  const legacy = obj?.[legacyField];
  if (typeof legacy === "number" && Number.isFinite(legacy)) {
    return toCents(legacy);
  }
  return 0;
}

function formatMoney(cents, currency = "USD") {
  const dollars = fromCents(cents);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars);
  } catch {
    return `$${dollars.toFixed(2)}`;
  }
}

function labelForPaymentMethod(method) {
  if (!method) return "Select…";
  if (method.id === "add_payment") return "Add a payment method";

  const walletType = method.card?.wallet?.type;
  const brand = method.card?.brand;
  const last4 = method.card?.last4 ?? "";

  const isApplePay = walletType === "apple_pay" || brand === "apple_pay";
  const isGooglePay = walletType === "google_pay" || brand === "google_pay";

  if (isApplePay) return `Apple Pay •••• ${last4}`;
  if (isGooglePay) return `Google Pay •••• ${last4}`;

  const brandLabel = brand ? brand.toUpperCase() : "CARD";
  return `${brandLabel} •••• ${last4}`;
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // some endpoints may return plain text
  }

  if (!res.ok) {
    const msg = json?.error || json?.message || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json ?? { ok: true, text };
}

function BalanceHistoryList({ uid }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    setErrMsg("");

    const ref = collection(firestore, "customers", uid, "balance_history");
    const q = query(ref, orderBy("createdAt", "desc"), limit(30));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRows(items);
        setLoading(false);
      },
      (err) => {
        console.error("balance_history snapshot error:", err);
        setErrMsg("Unable to load balance history.");
        setRows([]);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [uid]);

  return (
    <Card>
      <CardHeaderRow>
        <CardTitle>Balance history</CardTitle>
      </CardHeaderRow>

      {loading ? (
        <Muted>Loading…</Muted>
      ) : errMsg ? (
        <Muted>{errMsg}</Muted>
      ) : rows.length === 0 ? (
        <Muted>No history yet.</Muted>
      ) : (
        <HistoryList>
          {rows.map((r) => {
            const amountCents = readCents(r, "amount_cents", "amount");
            const direction = (r.direction || r.type || "")
              .toString()
              .toLowerCase();
            const signed =
              direction.includes("debit") ||
              direction.includes("out") ||
              direction.includes("charge")
                ? -Math.abs(amountCents)
                : Math.abs(amountCents);

            const ts =
              r.createdAt?.toDate?.() ||
              r.created_at?.toDate?.() ||
              r.timestamp?.toDate?.() ||
              null;

            const when = ts
              ? DateTime.fromJSDate(ts).toLocaleString(DateTime.DATETIME_MED)
              : "";

            const title =
              r.title ||
              r.reason ||
              r.note ||
              r.description ||
              r.kind ||
              "Transaction";

            return (
              <HistoryRow key={r.id}>
                <HistoryLeft>
                  <HistoryTitle title={title}>{title}</HistoryTitle>
                  {!!when && <HistorySub>{when}</HistorySub>}
                </HistoryLeft>

                <HistoryAmt $neg={signed < 0}>
                  {signed < 0 ? "-" : "+"}
                  {formatMoney(Math.abs(signed))}
                </HistoryAmt>
              </HistoryRow>
            );
          })}
        </HistoryList>
      )}
    </Card>
  );
}

export default function WalletPage() {
  const navigate = useNavigate();
  const { userData } = React.useContext(GlobalContext);

  const uid = auth.currentUser?.uid || userData?.uid || "";
  const stripeId = userData?.stripeId || userData?.stripeID || "";
  const roleLabel = userData?.role?.label || "";
  const isClient = roleLabel === "Client";

  const [loading, setLoading] = useState(false);

  const [balanceCents, setBalanceCents] = useState(0);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultPmId, setDefaultPmId] = useState("");

  // Auto reload values stored in DB
  const [dbAutoReloadEnabled, setDbAutoReloadEnabled] = useState(false);
  const [dbAmountValue, setDbAmountValue] = useState(0);
  const [dbThresholdValue, setDbThresholdValue] = useState(0);
  const [dbPmId, setDbPmId] = useState("");

  // Modals
  const [autoReloadOpen, setAutoReloadOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);

  // Auto reload draft
  const [arEnabled, setArEnabled] = useState(true);
  const [arAmount, setArAmount] = useState(50);
  const [arThreshold, setArThreshold] = useState(30);
  const [arPmId, setArPmId] = useState("");

  // Add funds draft
  const [addAmount, setAddAmount] = useState(50);
  const [addPmId, setAddPmId] = useState("");
  const [addEnableAutoReload, setAddEnableAutoReload] = useState(true);
  const [addThreshold, setAddThreshold] = useState(30);

  const customerRef = useMemo(
    () => (uid ? doc(firestore, "customers", uid) : null),
    [uid],
  );

  // Subscribe to customer doc for balance + autoReload
  useEffect(() => {
    if (!customerRef) return;

    const unsub = onSnapshot(customerRef, async (snap) => {
      if (!snap.exists()) return;

      const d = snap.data() || {};

      // Balance cents-first
      const cents = readCents(d, "balance_cents", "balance");
      setBalanceCents(cents);

      // Backfill balance_cents opportunistically
      if (typeof d.balance_cents !== "number") {
        try {
          await setDoc(customerRef, { balance_cents: cents }, { merge: true });
        } catch (e) {
          console.error("balance_cents backfill error:", e);
        }
      }

      // Auto reload
      const ar = d.autoReload || {};
      if (Object.prototype.hasOwnProperty.call(ar, "isAutoReloadEnabled")) {
        const enabled = !!ar.isAutoReloadEnabled;
        setDbAutoReloadEnabled(enabled);

        const uiAmount =
          typeof ar.amount_cents === "number"
            ? fromCents(ar.amount_cents)
            : Number(ar.amountValue || 0);

        const uiThreshold =
          typeof ar.threshold_cents === "number"
            ? fromCents(ar.threshold_cents)
            : Number(ar.balanceValue || 0);

        setDbAmountValue(uiAmount);
        setDbThresholdValue(uiThreshold);
        setDbPmId(ar.paymentMethodId || "");
      }
    });

    return () => unsub();
  }, [customerRef]);

  const fetchPaymentMethods = useCallback(async () => {
    if (!uid) return;

    try {
      setLoading(true);
      const data = await postJson(ENDPOINTS.retrievePaymentMethods, { uid });

      const list = Array.isArray(data.paymentMethods)
        ? data.paymentMethods
        : [];
      const defaultId = data.defaultPaymentMethodId || "";

      const withAdd = [
        ...list,
        { id: "add_payment", card: { last4: "Add payment" } },
      ];

      setPaymentMethods(withAdd);
      setDefaultPmId(defaultId);

      // Default selection for modals
      setArPmId((prev) => prev || defaultId);
      setAddPmId((prev) => prev || defaultId);

      // If no default PM, force auto reload off in DB like your RN logic
      if (!defaultId && customerRef) {
        await setDoc(
          customerRef,
          { autoReload: { isAutoReloadEnabled: false, paymentMethodId: null } },
          { merge: true },
        );
      }
    } catch (e) {
      console.error("fetchPaymentMethods error:", e);
      alert(e.message || "Failed to fetch payment methods.");
    } finally {
      setLoading(false);
    }
  }, [uid, customerRef]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  // Open modals and seed drafts from DB
  const openAutoReload = useCallback(() => {
    setArEnabled(dbAutoReloadEnabled || false);
    setArAmount(dbAmountValue || 50);
    setArThreshold(dbThresholdValue || 30);
    setArPmId(dbPmId || defaultPmId || "");
    setAutoReloadOpen(true);
  }, [
    dbAutoReloadEnabled,
    dbAmountValue,
    dbThresholdValue,
    dbPmId,
    defaultPmId,
  ]);

  const openAddFunds = useCallback(() => {
    setAddAmount(50);
    setAddPmId(defaultPmId || "");
    setAddEnableAutoReload(!dbAutoReloadEnabled ? true : true);
    setAddThreshold(dbThresholdValue || 30);
    setAddFundsOpen(true);
  }, [defaultPmId, dbAutoReloadEnabled, dbThresholdValue]);

  const handleSelectPm = useCallback((value, mode) => {
    if (value === "add_payment") {
      alert(
        "Add payment method UI for web is next. For now, please add one in the mobile app.",
      );
      // Later: navigate("/app/wallet/payment-methods");
      return;
    }
    if (mode === "autoReload") setArPmId(value);
    if (mode === "addFunds") setAddPmId(value);
  }, []);

  const saveAutoReload = useCallback(async () => {
    if (!customerRef) return;

    if (arEnabled && !arPmId) {
      alert("Please select a payment method.");
      return;
    }

    try {
      setLoading(true);

      await setDoc(
        customerRef,
        {
          autoReload: {
            isAutoReloadEnabled: !!arEnabled,
            amountValue: arAmount,
            balanceValue: arThreshold,
            amount_cents: toCents(arAmount),
            threshold_cents: toCents(arThreshold),
            paymentMethodId: arEnabled ? arPmId : null,
          },
        },
        { merge: true },
      );

      if (arEnabled && stripeId && arPmId) {
        await postJson(ENDPOINTS.updateDefaultPaymentMethod, {
          customerId: stripeId,
          paymentMethodId: arPmId,
        });
      }

      setAutoReloadOpen(false);
    } catch (e) {
      console.error("saveAutoReload error:", e);
      alert(e.message || "Failed to save auto reload.");
    } finally {
      setLoading(false);
    }
  }, [customerRef, arEnabled, arAmount, arThreshold, arPmId, stripeId]);

  const addFunds = useCallback(async () => {
    if (!uid) return;
    if (!stripeId) {
      alert("Missing stripeId on your customer profile.");
      return;
    }
    if (!addPmId) {
      alert("Please select a payment method.");
      return;
    }

    try {
      setLoading(true);

      // If auto reload is not enabled in DB and user wants it enabled now, store it.
      if (!dbAutoReloadEnabled && addEnableAutoReload && customerRef) {
        await setDoc(
          customerRef,
          {
            autoReload: {
              amountValue: addAmount,
              balanceValue: addThreshold,
              amount_cents: toCents(addAmount),
              threshold_cents: toCents(addThreshold),
              isAutoReloadEnabled: true,
              paymentMethodId: addPmId,
            },
          },
          { merge: true },
        );

        await postJson(ENDPOINTS.updateDefaultPaymentMethod, {
          customerId: stripeId,
          paymentMethodId: addPmId,
        });
      }

      // Charge immediately
      await postJson(ENDPOINTS.chargeCustomer, {
        stripeId,
        paymentMethodId: addPmId,
        amount_cents: toCents(addAmount),
        amount: addAmount,
        uid,
      });

      setAddFundsOpen(false);
    } catch (e) {
      console.error("addFunds error:", e);
      alert(e.message || "Failed to add funds.");
    } finally {
      setLoading(false);
    }
  }, [
    uid,
    stripeId,
    addPmId,
    addAmount,
    dbAutoReloadEnabled,
    addEnableAutoReload,
    addThreshold,
    customerRef,
  ]);

  const autoReloadInfo = dbAutoReloadEnabled
    ? `$${dbAmountValue} when balance is below $${dbThresholdValue}`
    : "";

  return (
    <Wrap>
      <TopRow>
        <Title>My Wallet</Title>
        <RightActions>
          <IconAction
            type="button"
            onClick={fetchPaymentMethods}
            title="Refresh"
          >
            <FiRefreshCw />
          </IconAction>
        </RightActions>
      </TopRow>

      <CardsGrid>
        <Card>
          {!isClient && (
            <>
              <Label>Lifetime Reward Earned</Label>
              <BigValueRow>
                <BigValue>{formatMoney(balanceCents)}</BigValue>
                <Unit>USD</Unit>
              </BigValueRow>
              <Spacer />
            </>
          )}

          <Label>Current Balance</Label>
          <ValueRow>
            <Value>{formatMoney(balanceCents)}</Value>
            <Unit>USD</Unit>
          </ValueRow>

          <ButtonsRow>
            <PrimaryButton
              type="button"
              onClick={openAddFunds}
              disabled={loading}
            >
              <FiPlus />
              Add Fund
            </PrimaryButton>

            {!isClient && (
              <SecondaryButton
                type="button"
                onClick={() => {
                  alert(
                    "Transfer UI for web is next. For now, please use the mobile app.",
                  );
                  // Later: navigate("/app/payout");
                }}
                disabled={loading}
              >
                <FiDollarSign />
                Transfer
              </SecondaryButton>
            )}

            <SecondaryButton
              type="button"
              onClick={() => {
                alert(
                  "Payment method management UI for web is next. For now, please use the mobile app.",
                );
                // Later: navigate("/app/wallet/payment-methods");
              }}
              disabled={loading}
            >
              <FiCreditCard />
              Payment Method
            </SecondaryButton>
          </ButtonsRow>
        </Card>

        <Card>
          <CardHeaderRow>
            <CardTitle>Auto reload</CardTitle>
            <SwitchRow>
              <SwitchLabel>{dbAutoReloadEnabled ? "On" : "Off"}</SwitchLabel>
              <SwitchButton
                type="button"
                onClick={openAutoReload}
                aria-label="Edit auto reload"
                title="Edit auto reload"
              >
                <FiSettings />
              </SwitchButton>
            </SwitchRow>
          </CardHeaderRow>

          {!!autoReloadInfo && <SmallInfo>{autoReloadInfo}</SmallInfo>}
          {!dbAutoReloadEnabled && (
            <Muted>
              Turn on auto reload to keep your balance from running low.
            </Muted>
          )}
        </Card>
      </CardsGrid>

      <BalanceHistoryList uid={uid} />

      {(autoReloadOpen || addFundsOpen) && (
        <ModalBackdrop
          onClick={() => {
            if (!loading) {
              setAutoReloadOpen(false);
              setAddFundsOpen(false);
            }
          }}
        >
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {autoReloadOpen
                  ? "Edit Auto reload"
                  : "Add money to my account"}
              </ModalTitle>
              <ModalClose
                type="button"
                onClick={() => {
                  if (!loading) {
                    setAutoReloadOpen(false);
                    setAddFundsOpen(false);
                  }
                }}
              >
                <FiX />
              </ModalClose>
            </ModalHeader>

            <ModalBody>
              {autoReloadOpen ? (
                <>
                  <FieldRow>
                    <FieldLabel>Auto reload</FieldLabel>
                    <Toggle>
                      <input
                        type="checkbox"
                        checked={arEnabled}
                        onChange={(e) => setArEnabled(e.target.checked)}
                      />
                      <span />
                    </Toggle>
                  </FieldRow>

                  {arEnabled && (
                    <>
                      <Field>
                        <FieldLabel2>Amount</FieldLabel2>
                        <Select
                          value={arAmount}
                          onChange={(e) => setArAmount(Number(e.target.value))}
                        >
                          {AMOUNT_OPTIONS.map((v) => (
                            <option key={v} value={v}>{`$${v}`}</option>
                          ))}
                        </Select>
                      </Field>

                      <Field>
                        <FieldLabel2>When balance is below</FieldLabel2>
                        <Select
                          value={arThreshold}
                          onChange={(e) =>
                            setArThreshold(Number(e.target.value))
                          }
                        >
                          {AMOUNT_OPTIONS.map((v) => (
                            <option key={v} value={v}>{`$${v}`}</option>
                          ))}
                        </Select>
                      </Field>

                      <Field>
                        <FieldLabel2>Payment</FieldLabel2>
                        <Select
                          value={arPmId}
                          onChange={(e) =>
                            handleSelectPm(e.target.value, "autoReload")
                          }
                        >
                          <option value="">Select…</option>
                          {paymentMethods.map((m) => (
                            <option key={m.id} value={m.id}>
                              {labelForPaymentMethod(m)}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </>
                  )}

                  <ModalFooter>
                    <PrimaryButton
                      type="button"
                      onClick={saveAutoReload}
                      disabled={loading || (arEnabled && !arPmId)}
                    >
                      Save
                    </PrimaryButton>
                  </ModalFooter>
                </>
              ) : (
                <>
                  <SmallInfo>
                    Balance: <strong>{formatMoney(balanceCents)}</strong>
                  </SmallInfo>

                  <Field>
                    <FieldLabel2>Amount</FieldLabel2>
                    <Select
                      value={addAmount}
                      onChange={(e) => setAddAmount(Number(e.target.value))}
                    >
                      {AMOUNT_OPTIONS.map((v) => (
                        <option key={v} value={v}>{`$${v}`}</option>
                      ))}
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel2>Payment</FieldLabel2>
                    <Select
                      value={addPmId}
                      onChange={(e) =>
                        handleSelectPm(e.target.value, "addFunds")
                      }
                    >
                      <option value="">Select…</option>
                      {paymentMethods.map((m) => (
                        <option key={m.id} value={m.id}>
                          {labelForPaymentMethod(m)}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  {dbAutoReloadEnabled ? (
                    <>
                      <Spacer />
                      <FieldLabel2>Auto reload</FieldLabel2>
                      <SmallInfo>{autoReloadInfo}</SmallInfo>
                    </>
                  ) : (
                    <>
                      <Spacer />
                      <FieldRow>
                        <FieldLabel>Auto reload</FieldLabel>
                        <Toggle>
                          <input
                            type="checkbox"
                            checked={addEnableAutoReload}
                            onChange={(e) =>
                              setAddEnableAutoReload(e.target.checked)
                            }
                          />
                          <span />
                        </Toggle>
                      </FieldRow>

                      {addEnableAutoReload && (
                        <Field>
                          <FieldLabel2>When balance is below</FieldLabel2>
                          <Select
                            value={addThreshold}
                            onChange={(e) =>
                              setAddThreshold(Number(e.target.value))
                            }
                          >
                            {AMOUNT_OPTIONS.map((v) => (
                              <option key={v} value={v}>{`$${v}`}</option>
                            ))}
                          </Select>
                        </Field>
                      )}
                    </>
                  )}

                  <ModalFooter>
                    <PrimaryButton
                      type="button"
                      onClick={addFunds}
                      disabled={loading || !addPmId}
                    >
                      {dbAutoReloadEnabled
                        ? `Add $${addAmount}`
                        : addEnableAutoReload
                          ? `Save and Add $${addAmount}`
                          : `Add $${addAmount}`}
                    </PrimaryButton>
                  </ModalFooter>
                </>
              )}
            </ModalBody>
          </ModalCard>
        </ModalBackdrop>
      )}

      {loading && (
        <LoadingOverlay>
          <LoadingCard>Working…</LoadingCard>
        </LoadingOverlay>
      )}
    </Wrap>
  );
}

/* styled-components */

const Wrap = styled.div`
  max-width: 980px;
  margin: 0 auto;
  padding: 6px 2px 22px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
`;

const RightActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const IconAction = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 10px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;

  &:hover {
    background: #f8fafc;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const Label = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const BigValueRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const BigValue = styled.div`
  font-size: 26px;
  font-weight: 900;
  color: #0f172a;
`;

const ValueRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const Value = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
`;

const Unit = styled.div`
  font-size: 13px;
  color: #64748b;
`;

const ButtonsRow = styled.div`
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SwitchRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const SwitchLabel = styled.div`
  font-size: 13px;
  color: #64748b;
`;

const SwitchButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f8fafc;
  }
`;

const SmallInfo = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
`;

const Muted = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
`;

const Spacer = styled.div`
  height: 12px;
`;

/* history list */

const HistoryList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const HistoryRow = styled.div`
  padding: 10px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  & + & {
    border-top: 1px solid rgba(148, 163, 184, 0.18);
  }
`;

const HistoryLeft = styled.div`
  min-width: 0;
`;

const HistoryTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HistorySub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
`;

const HistoryAmt = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: ${(p) => (p.$neg ? "#b91c1c" : "#0f172a")};
`;

/* modal */

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: auto;
`;

const ModalHeader = styled.div`
  padding: 14px 16px 10px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const ModalClose = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 18px;
  }
`;

const ModalBody = styled.div`
  padding: 14px 16px 16px;
`;

const Field = styled.div`
  margin-top: 12px;
`;

const FieldRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const FieldLabel = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const FieldLabel2 = styled.div`
  font-size: 13px;
  color: #475569;
  margin-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  padding: 10px 10px;
  font-size: 13px;
  background: #ffffff;
  color: #0f172a;
`;

const ModalFooter = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

/* toggle */

const Toggle = styled.label`
  position: relative;
  width: 46px;
  height: 28px;
  display: inline-block;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: #e5e7eb;
    border-radius: 999px;
    transition: 0.2s;
  }

  span:before {
    content: "";
    position: absolute;
    height: 22px;
    width: 22px;
    left: 3px;
    top: 3px;
    background: white;
    border-radius: 999px;
    transition: 0.2s;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
  }

  input:checked + span {
    background: #16a34a;
  }

  input:checked + span:before {
    transform: translateX(18px);
  }
`;

/* loading */

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(255, 255, 255, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const LoadingCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 16px;
  padding: 14px 16px;
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
`;
