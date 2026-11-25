import { useRef, useState } from "react";

import fallbackLogo from "../assets/app-logo.png";
import PageHeader from "../components/PageHeader";
import { DEFAULT_SETTINGS, useBrand, useCurrencyFormatter } from "../context/BrandContext";
import { downloadFile, downloadTransactionsCsv } from "../utils/download";
import { isValidBudget, isValidLoan, isValidTransaction, todayISO } from "../utils/finance";

const CURRENCIES = [
  ["NPR", "Nepalese Rupee"], ["USD", "US Dollar"], ["EUR", "Euro"],
  ["GBP", "British Pound"], ["INR", "Indian Rupee"], ["CAD", "Canadian Dollar"],
  ["AUD", "Australian Dollar"], ["JPY", "Japanese Yen"],
];
const COLORS = ["#6c5ce7", "#3b82f6", "#14b8a6", "#f97316", "#ec4899", "#8b5cf6"];

/** App identity, display preferences and data backup tools. */
function SettingsPage({ transactions, budgets, loans, replaceAllData }) {
  const { settings, setSettings } = useBrand();
  const formatCurrency = useCurrencyFormatter();
  const [notice, setNotice] = useState({ text: "", tone: "ok" });
  const logoInput = useRef(null);
  const backupInput = useRef(null);

  const say = (text, tone = "ok") => setNotice({ text, tone });

  const update = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    say("Saved on this device.");
  };

  // Keep uploaded logos small so the browser can reliably persist them locally.
  const handleLogo = (event) => {
    const [file] = event.target.files || [];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return say("Choose an image file for the logo.", "error");
    if (file.size > 500 * 1024) return say("Logo must be 500 KB or smaller.", "error");

    const reader = new FileReader();
    reader.onload = () => update("logo", reader.result);
    reader.onerror = () => say("The selected image could not be read.", "error");
    reader.readAsDataURL(file);
  };

  const exportCsv = () => {
    downloadTransactionsCsv(transactions, `transactions-${todayISO()}.csv`);
    say(`Exported ${transactions.length} transactions.`);
  };

  const exportBackup = () => {
    const backup = { app: "ExpenseFlow", version: 2, exportedAt: new Date().toISOString(), transactions, budgets, loans };
    downloadFile(JSON.stringify(backup, null, 2), `expenseflow-backup-${todayISO()}.json`, "application/json");
    say("Backup downloaded. Keep it somewhere safe.");
  };

  const restoreBackup = async (event) => {
    const [file] = event.target.files || [];
    event.target.value = "";
    if (!file) return;

    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data?.transactions) || !Array.isArray(data?.budgets)) throw new Error("Wrong format");

      const restored = {
        transactions: data.transactions.filter(isValidTransaction),
        budgets: data.budgets.filter(isValidBudget),
        // Older backups (version 1) have no loans.
        loans: Array.isArray(data.loans) ? data.loans.filter(isValidLoan) : [],
      };

      const message = `Replace your current data with ${restored.transactions.length} transactions, ${restored.budgets.length} budgets and ${restored.loans.length} loans from this backup?`;
      if (!window.confirm(message)) return;

      replaceAllData(restored);
      say("Backup restored.");
    } catch {
      say("That file is not a valid backup.", "error");
    }
  };

  const clearAll = () => {
    if (!window.confirm("Delete ALL transactions, budgets and loans from this device? Download a backup first if you may need them.")) return;
    replaceAllData({ transactions: [], budgets: [], loans: [] });
    say("All data deleted.");
  };

  const hasData = transactions.length + budgets.length + loans.length > 0;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Settings" subtitle="Saved on this device" action={<span />} />

      <div className="space-y-5 px-4 pt-4 sm:px-6 lg:px-8">
        {notice.text && (
          <p aria-live="polite" className={`rounded-2xl px-4 py-3 text-sm font-medium ${notice.tone === "error" ? "bg-down/10 text-down" : "bg-up/10 text-up"}`}>
            {notice.text}
          </p>
        )}

        {/* Storage */}
        <section className="panel p-5">
          <h2 className="text-lg font-bold">Your data stays on this device</h2>
          <p className="mt-1 text-sm text-muted">
            No account or internet needed — everything is saved privately in this browser and works offline. It isn&apos;t
            shared between devices, and clearing this site&apos;s browser data deletes it, so download a backup now and then.
          </p>
        </section>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_0.85fr]">
          {/* Appearance */}
          <section className="panel space-y-5 p-5">
            <h2 className="text-lg font-bold">Appearance</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="brand-name" className="mb-2 block text-sm font-semibold text-muted">App name</label>
                <input id="brand-name" maxLength="32" value={settings.appName} onChange={(event) => update("appName", event.target.value)} className="field" />
              </div>
              <div>
                <label htmlFor="brand-tagline" className="mb-2 block text-sm font-semibold text-muted">Tagline</label>
                <input id="brand-tagline" maxLength="48" value={settings.tagline} onChange={(event) => update("tagline", event.target.value)} className="field" />
              </div>
            </div>

            <div>
              <label htmlFor="brand-currency" className="mb-2 block text-sm font-semibold text-muted">Currency</label>
              <select id="brand-currency" value={settings.currency} onChange={(event) => update("currency", event.target.value)} className="field">
                {CURRENCIES.map(([code, name]) => (
                  <option key={code} value={code}>{code} — {name}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-faint">Changes how amounts are shown; stored values are not converted.</p>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-muted">Accent colour</legend>
              <div className="flex flex-wrap items-center gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Use ${color} accent`}
                    aria-pressed={settings.accent === color}
                    onClick={() => update("accent", color)}
                    style={{ backgroundColor: color }}
                    className={`h-10 w-10 rounded-full ring-offset-2 ring-offset-[#121230] transition ${settings.accent === color ? "ring-2 ring-white" : ""}`}
                  />
                ))}
                <label className="flex items-center gap-2 text-sm text-muted">
                  Custom
                  <input aria-label="Choose custom accent colour" type="color" value={settings.accent} onChange={(event) => update("accent", event.target.value)} className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent" />
                </label>
              </div>
            </fieldset>

            <div>
              <span className="mb-2 block text-sm font-semibold text-muted">Logo</span>
              <div className="flex items-center gap-3">
                <img src={settings.logo || fallbackLogo} alt="" className="h-12 w-12 rounded-full border border-line bg-black object-cover" />
                <button type="button" onClick={() => logoInput.current?.click()} className="pill">Upload</button>
                {settings.logo && (
                  <button type="button" onClick={() => update("logo", "")} className="rounded-full px-3 py-2 text-sm font-semibold text-down hover:bg-down/10">Remove</button>
                )}
                <input ref={logoInput} type="file" accept="image/*" onChange={handleLogo} className="sr-only" tabIndex={-1} />
              </div>
              <p className="mt-2 text-xs text-faint">Image up to 500 KB.</p>
            </div>

            <div className="tile flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="text-xs text-muted">Preview</p>
                <p className="money truncate text-xl font-bold">{formatCurrency(1234.5)}</p>
              </div>
              <span className="pill pill-active shrink-0">Selected</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSettings(DEFAULT_SETTINGS);
                say("Appearance restored to defaults.");
              }}
              className="text-sm font-semibold text-muted underline underline-offset-4 hover:text-white"
            >
              Restore defaults
            </button>
          </section>

          {/* Data */}
          <section className="panel space-y-5 p-5">
            <div>
              <h2 className="text-lg font-bold">Your data</h2>
              <p className="mt-1 text-sm text-muted">
                {transactions.length} transactions · {budgets.length} budgets · {loans.length} loans saved on this device.
              </p>
            </div>

            <div className="grid gap-3">
              <button type="button" onClick={exportCsv} disabled={transactions.length === 0} className="pill py-3 disabled:opacity-40">
                Export transactions (CSV)
              </button>
              <button type="button" onClick={exportBackup} className="pill py-3">
                Download full backup
              </button>
              <button type="button" onClick={() => backupInput.current?.click()} className="pill py-3">
                Restore from backup…
              </button>
              <input ref={backupInput} type="file" accept="application/json,.json" onChange={restoreBackup} className="sr-only" tabIndex={-1} />
            </div>

            <div className="border-t border-line pt-5">
              <button
                type="button"
                onClick={clearAll}
                disabled={!hasData}
                className="w-full rounded-full px-4 py-3 text-sm font-semibold text-down transition hover:bg-down/10 disabled:opacity-40"
              >
                Delete all data
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
