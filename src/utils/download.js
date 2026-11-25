import { sortByDate } from "./finance";

/** Triggers a browser download of text content. */
export const downloadFile = (content, filename, type) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Quotes a CSV cell so commas, quotes and newlines survive. */
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

/** Downloads transactions as a spreadsheet-friendly CSV file. */
export const downloadTransactionsCsv = (transactions, filename) => {
  const header = ["Date", "Type", "Category", "Description", "Amount"];
  const rows = sortByDate(transactions).map((transaction) =>
    [transaction.date, transaction.type, transaction.category, transaction.description, transaction.amount]
      .map(csvCell)
      .join(",")
  );
  // The BOM lets Excel detect UTF-8 so non-English notes display correctly.
  downloadFile(`﻿${[header.join(","), ...rows].join("\n")}`, filename, "text/csv;charset=utf-8");
};
