# Personal Expense Tracker

A personal expense tracking application built with React and Tailwind CSS.

The application lets users record income and expenses through a Quick Add panel, view their transaction history, and track total income, total expenses, and the running balance. It uses reusable React components and a responsive dashboard layout.

> Current storage: transactions and unfinished entries are kept in React state only. A full page refresh clears them. localStorage persistence is planned.

## Features

### Currently Implemented

#### Dashboard and Financial Summary

- Responsive dashboard with summary cards for total income, total expenses, and current balance.
- Automatic calculations that update when a transaction is added or deleted.
- Full-width transaction history instead of a permanent sidebar form.
- Status messages confirming when entries are added or removed.

The running balance is calculated from recorded transactions:

```text
Balance = Total Income - Total Expenses
```

Amounts are displayed in dollars. Totals are calculated in cents before being converted back to dollars for display.

#### Quick Add Transaction Panel

- An **Add entry** button opens a compact transaction panel.
- A **Money out / Money in** selector switches between expenses and income.
- A large amount input receives focus when the panel opens.
- Selectable category tiles replace the category dropdown, with different categories for each transaction type.
- A required description and editable date, initially set to the user's local date.
- Validation for positive amounts, required categories and dates, and non-empty descriptions.
- **Record expense** and **Record income** buttons submit the entry and reset the form.
- Closing or cancelling the panel preserves an unfinished entry until it is submitted or the page reloads.

The panel is centered on larger screens and bottom-aligned on smaller screens. It includes labeled controls, keyboard-focus styles, and a Close button.

#### Transaction History

- Displays each transaction's description, category, date, type, and formatted amount.
- Distinguishes income and expenses using labels, signs, and colors.
- Shows a transaction count and an empty state when no entries exist.
- Allows individual transactions to be deleted.
- Places newly added transactions at the top of the list. This is insertion order, not sorting by transaction date.

## Planned Features

### Core Features Still to Implement

- Filter transactions by category.
- Sort transactions by date.
- Save and restore transactions using localStorage, with useEffect for synchronization.

### Optional Enhancements

- Spending chart grouped by category.
- Monthly summary view.
- Budget limit with a warning when exceeded.

## Technologies Used

- React with JavaScript and JSX.
- Tailwind CSS for styling and responsive layouts.
- Vite for the development environment.
- HTML form controls and the native dialog element.
- Git and GitHub for version control.

## Project Structure

Main project files:

```text
Expense_tracking/
|-- public/
|-- src/
|   |-- assets/
|   |-- Components/
|   |   |-- Header.jsx
|   |   |-- SummaryCards.jsx
|   |   |-- TransactionForm.jsx
|   |   |-- TransactionList.jsx
|   |   `-- TransactionItem.jsx
|   |-- App.jsx
|   |-- App.css
|   |-- index.css
|   `-- main.jsx
|-- index.html
|-- package.json
|-- package-lock.json
|-- vite.config.js
`-- README.md
```

The component folder is named `Components` with a capital `C`. Imports must match the actual folder and file names.

## Component Responsibilities

| File | Responsibility |
| --- | --- |
| `App.jsx` | Stores transactions and status messages, handles adding and deleting entries, calculates totals, and assembles the dashboard. |
| `Header.jsx` | Displays the application title and introduction. |
| `SummaryCards.jsx` | Displays balance, income, and expense values received through props. |
| `TransactionForm.jsx` | Renders the Add entry button and Quick Add dialog; manages inputs, validation, focus, and submission. |
| `TransactionList.jsx` | Displays the transaction count, empty state, and list of transaction items. |
| `TransactionItem.jsx` | Displays one transaction and calls the delete callback when requested. |

## Application Flow

1. The dashboard starts with an empty transaction list and zero totals.
2. The user clicks **Add entry**, selects **Money out** or **Money in**, and enters the amount, category, description, and date.
3. The form validates the entry, creates a transaction with a unique ID, and passes it to `App.jsx` through `onAddTransaction`.
4. `App.jsx` updates the transaction state. The list and summary cards update, a confirmation appears, and the panel closes and resets.
5. Deleting an entry calls the callback from `TransactionItem.jsx`, through the prop supplied by `TransactionList.jsx`, to `App.jsx`. The transaction is removed and totals update again.

```text
TransactionForm -> onAddTransaction -> App transaction state
                                            |
                         +------------------+------------------+
                         |                                     |
                   SummaryCards                         TransactionList
                                                               |
                                                        TransactionItem
                                                               |
                                                    onDelete -> App
```

### React Concepts Demonstrated

| Concept | Use in the Application |
| --- | --- |
| Functional components | Organizes the interface into reusable components. |
| `useState` | Manages transactions, status messages, form inputs, and validation errors. |
| `useRef` | Controls the dialog and focuses the amount or description input. |
| Props and callbacks | Passes data to child components and connects add/delete actions to `App.jsx`. |
| Controlled inputs | Keeps input values synchronized with React state. |
| Conditional rendering | Displays empty states, validation errors, and transaction-specific content. |
| `.map()` and unique keys | Renders category choices and transaction rows. |
| `.filter()` and `.reduce()` | Removes transactions and calculates income and expense totals. |

`useEffect` has not been added yet. It is planned for localStorage synchronization.

## Setup Instructions

Node.js and npm must be installed on your computer.

After cloning the repository, open a terminal in the project folder containing `package.json`.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL printed by Vite in the terminal. Keep the server running while using the application locally.

## Current Progress

The application supports adding and deleting transactions, viewing transaction history, and automatically calculating income, expenses, and balance.

The original always-visible form has been replaced with the Quick Add interaction. The next core development steps are localStorage persistence, category filtering, and date sorting.

## Manual Testing Checklist

These checks can be used to verify the current implementation:

| Check | Expected Result |
| --- | --- |
| Add income of $100, then an expense of $25.50. | Income is $100.00, expenses are $25.50, and balance is $74.50. |
| Delete the $25.50 expense. | Expenses return to $0.00 and balance becomes $100.00. |
| Try a zero amount, a missing category, or a whitespace-only description. | The entry is rejected. |
| Close and reopen a partially completed entry. | The unfinished values remain during the current page session. |
| Delete every transaction. | The empty state appears and all totals become zero. |
| Refresh the page. | Transactions and unfinished entries are cleared in the current version. |

## Screenshots

Screenshots have not yet been added to this README. Add 2-3 screenshots of the running application before submission, covering the dashboard with sample transactions, the Quick Add panel, and a mobile-width view.

## Known Limitations

- Transactions and unfinished entries are lost after a page refresh because localStorage persistence is not implemented.
- Category filtering and transaction-date sorting are not yet available.
- Charts, monthly summaries, and budget warnings are planned but not implemented.
- Amounts use dollars; there is no currency selector or currency conversion.
- The current implementation does not include account login, backend storage, or cross-device synchronization.