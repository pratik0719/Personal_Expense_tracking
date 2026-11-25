import { useEffect, useRef, useState } from "react";

import { createId, EMPTY_DATA, loadDeviceData, requestPersistentStorage, saveDeviceData } from "./shared";

/**
 * On-device storage (no account, no server): everything lives in this
 * browser's IndexedDB, so the app works fully offline.
 */
export function useLocalData() {
  const [data, setData] = useState(EMPTY_DATA);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const backend = useRef("indexeddb");

  // Latest data, so a change can be saved immediately (see commit below).
  const dataRef = useRef(EMPTY_DATA);

  useEffect(() => {
    let cancelled = false;
    loadDeviceData().then((result) => {
      if (cancelled) return;
      backend.current = result.backend;
      dataRef.current = result.data;
      setData(result.data);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Applies a change and starts saving it right away — in the same tap,
   * before React re-renders — so the write is already under way even if
   * the user closes the app immediately afterwards.
   */
  const commit = (next) => {
    dataRef.current = next;
    setData(next);
    requestPersistentStorage();
    saveDeviceData(next, backend.current).catch((saveError) => {
      console.error("Could not save data on this device:", saveError);
      setError("Your latest change couldn't be saved on this device. Free up storage space and try again.");
    });
  };

  const setList = (name, update) => commit({ ...dataRef.current, [name]: update(dataRef.current[name]) });

  const crud = (name) => ({
    add: (item) => setList(name, (list) => [{ ...item, id: createId() }, ...list]),
    update: (updated) => setList(name, (list) => list.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))),
    remove: (id) => setList(name, (list) => list.filter((item) => item.id !== id)),
  });

  const mapLoan = (loanId, change) =>
    setList("loans", (list) => list.map((loan) => (loan.id === loanId ? change(loan) : loan)));

  return {
    ...data,
    ready,
    error,
    clearError: () => setError(null),
    tx: crud("transactions"),
    budget: crud("budgets"),
    loan: {
      ...crud("loans"),
      addPayment: (loanId, payment) =>
        mapLoan(loanId, (loan) => ({ ...loan, payments: [...loan.payments, { ...payment, id: createId() }] })),
      deletePayment: (loanId, paymentId) =>
        mapLoan(loanId, (loan) => ({ ...loan, payments: loan.payments.filter((payment) => payment.id !== paymentId) })),
    },
    replaceAllData: commit,
  };
}
