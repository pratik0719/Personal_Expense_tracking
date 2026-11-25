import { createStore, getMany, setMany } from "idb-keyval";

import { isValidBudget, isValidLoan, isValidTransaction } from "../utils/finance";

/** The three lists that make up a user's finances. */
export const COLLECTIONS = [
  { name: "transactions", isValid: isValidTransaction },
  { name: "budgets", isValid: isValidBudget },
  { name: "loans", isValid: isValidLoan },
];

export const EMPTY_DATA = { transactions: [], budgets: [], loans: [] };

/* ---------- On-device storage (IndexedDB) ---------- */

/**
 * Data is kept in IndexedDB: far more space than
 * localStorage (hundreds of MB vs ~5 MB), stored asynchronously so the
 * UI never blocks, and kept across restarts and offline use.
 *
 * Database "expenseflow", object store "finance", keys:
 * "transactions", "budgets", "loans".
 */
let idbStore = null;
const getStore = () => {
  if (!idbStore && typeof indexedDB !== "undefined") idbStore = createStore("expenseflow", "finance");
  return idbStore;
};

/** Keys used by older versions of the app (before IndexedDB). */
export const LEGACY_KEYS = {
  transactions: "expenseTrackerTransactions",
  budgets: "expenseTrackerBudgets",
  loans: "expenseTrackerLoans",
};

const sanitize = (raw) =>
  Object.fromEntries(
    COLLECTIONS.map(({ name, isValid }) => [name, Array.isArray(raw?.[name]) ? raw[name].filter(isValid) : []])
  );

const readLegacy = () => {
  const raw = {};
  for (const { name } of COLLECTIONS) {
    try {
      raw[name] = JSON.parse(localStorage.getItem(LEGACY_KEYS[name]) || "[]");
    } catch {
      raw[name] = [];
    }
  }
  return sanitize(raw);
};

const clearLegacy = () => Object.values(LEGACY_KEYS).forEach((key) => localStorage.removeItem(key));

/**
 * Safety copy for in-flight saves.
 *
 * Browsers cancel IndexedDB writes that are still running when a page is
 * closed or reloaded, so a change made just before closing the app could
 * be lost. Each change is therefore also written synchronously to
 * localStorage (which can't be interrupted) and removed once the
 * IndexedDB write has finished. If the copy is still there on the next
 * start, the last save didn't complete, and the copy is used.
 */
const PENDING_KEY = "expenseflowPendingSave";
let saveSequence = 0;

const readPendingSave = () => {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
    return pending?.data ? sanitize(pending.data) : null;
  } catch {
    return null;
  }
};

/**
 * Loads on-device data. On the first run after upgrading, data from
 * localStorage is moved into IndexedDB automatically.
 * Falls back to localStorage if IndexedDB is unavailable.
 */
export async function loadDeviceData() {
  const store = getStore();
  if (!store) return { data: readLegacy(), backend: "localStorage" };

  try {
    // A save that was interrupted by closing the app: finish it now.
    const pending = readPendingSave();
    if (pending) {
      await saveDeviceData(pending, "indexeddb");
      return { data: pending, backend: "indexeddb" };
    }

    const values = await getMany(COLLECTIONS.map(({ name }) => name), store);
    const neverSaved = values.every((value) => value === undefined);

    if (neverSaved) {
      const legacy = readLegacy();
      await saveDeviceData(legacy, "indexeddb");
      clearLegacy();
      return { data: legacy, backend: "indexeddb" };
    }

    return {
      data: sanitize(Object.fromEntries(COLLECTIONS.map(({ name }, index) => [name, values[index]]))),
      backend: "indexeddb",
    };
  } catch (error) {
    console.warn("IndexedDB unavailable, using localStorage instead:", error);
    return { data: readLegacy(), backend: "localStorage" };
  }
}

export async function saveDeviceData(data, backend) {
  if (backend !== "indexeddb") {
    COLLECTIONS.forEach(({ name }) => localStorage.setItem(LEGACY_KEYS[name], JSON.stringify(data[name])));
    return;
  }

  saveSequence += 1;
  const sequence = saveSequence;
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ sequence, data }));
  } catch {
    // Very large data may not fit in localStorage; the IndexedDB save below still runs.
  }

  await setMany(COLLECTIONS.map(({ name }) => [name, data[name]]), getStore());

  // Only clear the safety copy if no newer save has started meanwhile.
  if (sequence === saveSequence) localStorage.removeItem(PENDING_KEY);
}

/**
 * Asks the browser not to evict this site's storage under disk pressure.
 * Called on the first change a user makes, so browsers that show a
 * prompt (Firefox) do so in context rather than on page load.
 */
let persistRequested = false;
export const requestPersistentStorage = () => {
  if (persistRequested) return;
  persistRequested = true;
  navigator.storage
    ?.persisted?.()
    .then((already) => already || navigator.storage.persist())
    .catch(() => {});
};

/** Unique, sortable numeric id (Date.now() alone can collide on fast taps). */
let lastId = 0;
export const createId = () => {
  lastId = Math.max(Date.now(), lastId + 1);
  return lastId;
};
