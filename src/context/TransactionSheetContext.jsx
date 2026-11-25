import { createContext, useCallback, useContext, useMemo, useState } from "react";

import BottomSheet from "../components/BottomSheet";
import TransactionForm from "../components/TransactionForm";

const TransactionSheetContext = createContext(null);

/**
 * Owns the single add/edit transaction sheet used across the app.
 *
 * Any component can call openAdd() or openEdit(transaction); the
 * floating "+" button, page headers and list rows all share one form.
 */
export function TransactionSheetProvider({
  addTransaction,
  updateTransaction,
  deleteTransaction,
  children,
}) {
  // null = closed, { mode: "add", type } or { mode: "edit", transaction }
  const [sheet, setSheet] = useState(null);

  const openAdd = useCallback(
    (type = "expense") => setSheet({ mode: "add", type }),
    []
  );
  const openEdit = useCallback(
    (transaction) => setSheet({ mode: "edit", transaction }),
    []
  );
  const close = useCallback(() => setSheet(null), []);

  const value = useMemo(() => ({ openAdd, openEdit }), [openAdd, openEdit]);
  const isEditing = sheet?.mode === "edit";

  return (
    <TransactionSheetContext.Provider value={value}>
      {children}

      <BottomSheet
        open={Boolean(sheet)}
        onClose={close}
        title={isEditing ? "Edit transaction" : "New transaction"}
      >
        {sheet && (
          <TransactionForm
            key={isEditing ? sheet.transaction.id : `new-${sheet.type}`}
            initial={isEditing ? sheet.transaction : undefined}
            defaultType={sheet.type}
            onSubmit={(transaction) => {
              if (isEditing) updateTransaction(transaction);
              else addTransaction(transaction);
              close();
            }}
            onDelete={(id) => {
              deleteTransaction(id);
              close();
            }}
          />
        )}
      </BottomSheet>
    </TransactionSheetContext.Provider>
  );
}

export function useTransactionSheet() {
  const context = useContext(TransactionSheetContext);
  if (!context) {
    throw new Error("useTransactionSheet must be used inside TransactionSheetProvider.");
  }
  return context;
}
