# Personal Expense Tracker

A responsive personal finance tracking application built using React, Tailwind CSS, React Router, and Recharts.

The application allows users to record income and expenses, automatically calculate their financial balance, review transaction history, compare income and expenses visually, and open separate Income and Expense statement pages.

> Current storage: transactions are currently stored in React state only. Refreshing the browser clears the transaction data. localStorage persistence will be implemented in a future update.

---

## Features

### Currently Implemented

## Dashboard

The main dashboard provides a quick overview of the user's financial activity.

The dashboard displays:

- Total Balance
- Total Income
- Total Expenses
- Income vs Expense chart
- Recent transaction history
- Add Entry action

The current balance is calculated using:

```text
Balance = Total Income - Total Expenses
```

The financial summary automatically updates whenever a transaction is added or deleted.

---

## Financial Summary Cards

The dashboard contains three financial summary cards:

### Total Balance

Displays the user's current balance.

```text
Balance = Income - Expenses
```

### Income

Displays total recorded income.

The Income card is clickable and opens the detailed Income Statement page:

```text
/income
```

### Expenses

Displays total recorded expenses.

The Expense card is clickable and opens the detailed Expense Statement page:

```text
/expenses
```

---

## Quick Add Transaction Panel

Transactions are added using a compact Quick Add interface instead of a permanently visible form.

The user clicks:

```text
+ Add entry
```

to open the transaction panel.

### Quick Add Features

- Money Out / Money In transaction selector
- Large amount input
- Different categories for income and expenses
- Selectable category cards
- Description input
- Date selection
- Current date selected automatically
- Positive amount validation
- Required category validation
- Required description validation
- Required date validation
- Record Expense button
- Record Income button
- Cancel button
- Close button
- Automatic form reset after submission

If the panel is closed before submitting, the unfinished entry remains available during the current page session.

---

## Transaction Categories

Expense categories currently include options such as:

- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Education
- Other

Income categories currently include:

- Salary
- Freelance
- Gift
- Other

---

## Transaction History

The application displays recorded transactions in the dashboard.

Each transaction contains:

- Description
- Category
- Date
- Transaction type
- Amount
- Income or Expense indicator
- Delete button

Additional functionality:

- Income transactions use income styling.
- Expense transactions use expense styling.
- Newly created transactions appear at the top of the list.
- Individual transactions can be deleted.
- Transaction totals update automatically after deletion.
- The Finance Chart also updates automatically.
- Transaction count is displayed.
- An empty state appears when no transactions exist.

---

## Income vs Expense Chart

The dashboard contains an interactive donut chart built using **Recharts**.

The chart compares the user's total income and total expenses.

### Chart Colors

```text
Green = Income
Blue  = Expense
```

### Chart Features

- Displays Income and Expense in a donut chart.
- Shows the current balance in the center.
- Updates automatically whenever transactions change.
- Hovering over a chart section displays the related amount.
- No unnecessary click-selection box is displayed.
- Responsive on desktop, tablet, and mobile.
- Shows a visual placeholder before transaction data exists.

Example:

```text
Income:  $2,500.00
Expense: $500.00

Balance: $2,000.00
```

---

## Multi-Page Navigation

The project uses **React Router DOM** to provide client-side navigation.

Available routes:

```text
/
Dashboard
```

```text
/income
Income Statement
```

```text
/expenses
Expense Statement
```

The application changes pages without completely reloading the browser.

---

## Income Statement Page

The Income card on the dashboard opens the Income Statement page.

Route:

```text
/income
```

The Income Statement page displays:

- Total Income
- Number of income transactions
- Transaction date
- Description
- Category
- Amount
- Complete income transaction history
- Back to Dashboard navigation

Only transactions where:

```js
transaction.type === "income"
```

are displayed on this page.

---

## Expense Statement Page

The Expense card on the dashboard opens the Expense Statement page.

Route:

```text
/expenses
```

The Expense Statement page displays:

- Total Expenses
- Number of expense transactions
- Transaction date
- Description
- Category
- Amount
- Complete expense transaction history
- Back to Dashboard navigation

Only transactions where:

```js
transaction.type === "expense"
```

are displayed on this page.

---

## Application Logo

The application header uses a custom Finance Tracker logo stored inside:

```text
src/assets/finance tracker .png
```

The logo is imported into the React header component and displayed beside the application title.

---

## Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile phone

### Desktop Layout

On larger screens:

- Financial summary cards are displayed horizontally.
- Add Entry appears near the dashboard heading.
- Finance chart receives more horizontal space.
- Transaction history uses the available page width.
- Income and Expense statement information is displayed clearly.

### Mobile Layout

On smaller screens:

- Total Balance uses a full-width card.
- Income and Expense cards appear underneath.
- Add Entry is easily accessible.
- Quick Add becomes mobile-friendly.
- Inputs use mobile-safe font sizes.
- Transaction rows adapt to smaller screens.
- Finance chart resizes responsively.
- Buttons are touch-friendly.
- Horizontal page overflow is prevented.

---

## Technologies Used

The project currently uses:

- React
- JavaScript
- JSX
- Tailwind CSS
- Vite
- React Router DOM
- Recharts
- HTML
- CSS
- Git
- GitHub

---

## Project Structure

Expense_tracking/
|
|-- node_modules/
|
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
|
|-- src/
|   |
|   |-- assets/
|   |   |-- finance tracker .png
|   |   |-- hero.png
|   |   |-- react.svg
|   |   `-- vite.svg
|   |
|   |-- Components/
|   |   |-- FinanceChart.jsx
|   |   |-- Header.jsx
|   |   |-- SummaryCards.jsx
|   |   |-- TransactionForm.jsx
|   |   |-- TransactionItem.jsx
|   |   `-- TransactionList.jsx
|   |
|   |-- pages/
|   |   |-- Dashboard.jsx
|   |   |-- ExpensePage.jsx
|   |   `-- IncomePage.jsx
|   |
|   |-- App.css
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|
|-- .gitignore
|-- eslint.config.js
|-- index.html
|-- package-lock.json
|-- package.json
|-- README.md
`-- vite.config.js


> Important: The component directory is named `Components` with a capital `C`. Import paths must use the same capitalization.


## Component Responsibilities

| File | Responsibility |
| --- | --- |
| `App.jsx` | Stores transaction state, adds and deletes transactions, calculates totals, and defines routes. |
| `Header.jsx` | Displays the Finance Tracker logo, application title, and subtitle. |
| `SummaryCards.jsx` | Displays Balance, Income, and Expenses. Income and Expense cards navigate to statement pages. |
| `TransactionForm.jsx` | Provides the Quick Add transaction interface and handles form state and validation. |
| `TransactionList.jsx` | Displays transaction history and transaction count. |
| `TransactionItem.jsx` | Displays an individual transaction and provides the Delete action. |
| `FinanceChart.jsx` | Displays the Income vs Expense interactive donut chart. |


| `Dashboard.jsx` | Combines financial summaries, Quick Add, chart, and transaction history. |
| `IncomePage.jsx` | Displays detailed income statement information. |
| `ExpensePage.jsx` | Displays detailed expense statement information. |
| `main.jsx` | Starts the React application and provides BrowserRouter. |
| `index.css` | Contains Tailwind import and global responsive styling. |


## React Concepts Demonstrated

### Functional Components

The project uses React functional components instead of class components.

Examples:
Header
SummaryCards
FinanceChart
TransactionForm
TransactionList
TransactionItem
Dashboard
IncomePage
ExpensePage

### useState

`useState` is used to manage:

- Transactions
- Transaction type
- Amount
- Category
- Description
- Date
- Validation errors

Example:

```js
const [transactions, setTransactions] = useState([]);


### useRef

`useRef` is used inside the Quick Add component to:

- Control the dialog
- Focus the amount input
- Focus the description input when validation fails

---

### Props

Props are used for parent-to-child communication.

Example:

```jsx
<SummaryCards
  balance={balance}
  income={totalIncome}
  expense={totalExpense}
/>
 


### Callback Functions

Child components call functions passed from parent components.

Example:

```jsx
<TransactionForm
  onAddTransaction={addTransaction}
/>
```

and:

```jsx
<TransactionList
  transactions={transactions}
  onDelete={deleteTransaction}
/>
```

---

### Controlled Inputs

Transaction form fields are controlled using React state.

Example:

```jsx
<input
  value={amount}
  onChange={(event) => setAmount(event.target.value)}
/>
```

---

### Conditional Rendering

Conditional rendering is used for:

- Validation errors
- Empty transaction states
- Income / Expense styles
- Chart placeholder data
- Transaction-specific content

---

### map()

`.map()` is used for:

- Category options
- Transaction items
- Chart data

---

### filter()

`.filter()` is used to separate:

- Income transactions
- Expense transactions

Example:

```js
transactions.filter(
  (transaction) => transaction.type === "income"
);
```

---

### reduce()

`.reduce()` is used to calculate:

- Total Income
- Total Expenses

Example:

```js
transactions.reduce(
  (total, transaction) =>
    total + transaction.amount,
  0
);
```

---

### React Router

React Router is used to navigate between:

```text
Dashboard
Income Statement
Expense Statement
```

without performing a full browser refresh.

---

## useEffect Status

`useEffect` has not yet been implemented for transaction persistence.

It will be introduced when localStorage support is added.

The planned flow will be:

```text
React State
    |
    v
useEffect
    |
    v
localStorage
    |
    v
Browser Refresh
    |
    v
Restore Transactions
```

---

## Setup Instructions

### Requirements

Before starting, make sure you have installed:

- Node.js
- npm
- Git

---

### 1. Clone Repository

```bash
git clone  https://github.com/pratik0719/Personal_Expense_tracking.git
```

---

### 2. Open Project Folder

```bash
cd Expense_tracking
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Start Development Server

```bash
npm run dev
```

Vite will provide a local development address similar to:

```text
http://localhost:5173/
```

Open the URL in your browser.

---

## Main Additional Libraries

### React Router DOM

Used for multi-page navigation.

Installation:

```bash
npm install react-router-dom
```

---

### Recharts

Used for financial data visualization.

Installation:

```bash
npm install recharts
```

---

## Current Progress

The application's main financial tracking functionality is operational.

Users can currently:

- Add Income
- Add Expenses
- Choose transaction categories
- Add transaction descriptions
- Select transaction dates
- Delete transactions
- View transaction history
- View transaction count
- Automatically calculate Total Income
- Automatically calculate Total Expenses
- Automatically calculate Current Balance
- View an Income vs Expense chart
- Hover over chart sections to view amounts
- Open the Income Statement
- Open the Expense Statement
- Navigate back to the Dashboard
- Use the application across desktop and mobile screens

---

## Planned Features

### Required / Core Improvements

The next important features are:

- localStorage transaction persistence
- `useEffect` implementation
- Filter transactions by category
- Sort transactions by date

---

### Optional Future Features

Possible future improvements include:

- Monthly summary
- Monthly Income vs Expense graph
- Category-based spending chart
- Budget limits
- Budget warning notifications
- Edit transaction functionality
- Search transactions
- Date range filter
- Export transaction statements
- CSV export
- PDF export
- Currency selector
- Dark mode

---

## Manual Testing Checklist

| Test | Expected Result |
| --- | --- |
| Open Dashboard | Financial summary, chart, and transaction area are visible. |
| Add $2,500 Income | Income updates to $2,500.00. |
| Add $500 Expense | Expense becomes $500.00 and Balance becomes $2,000.00. |
| Add another Income | Income total and chart update automatically. |
| Hover over Income chart | Income amount is displayed. |
| Hover over Expense chart | Expense amount is displayed. |
| Click Income card | `/income` page opens. |
| Click Expense card | `/expenses` page opens. |
| Open Income page | Only income transactions are displayed. |
| Open Expense page | Only expense transactions are displayed. |
| Delete transaction | Totals, chart, and list update. |
| Add amount of 0 | Validation prevents submission. |
| Leave description empty | Validation prevents submission. |
| Leave category empty | Validation prevents submission. |
| Test mobile width | Dashboard remains responsive. |
| Refresh browser | Transactions currently disappear. |

---

## Screenshots

Before the final project submission, add at least 2-3 screenshots of the running application.

Recommended screenshots:

```text
screenshots/
|-- dashboard.png
|-- quick-add.png
|-- finance-chart.png
|-- income-page.png
|-- expense-page.png
`-- mobile-dashboard.png
```

Then display screenshots in README using:

```md
![Dashboard](screenshots/dashboard.png)
```

Example:

```md
## Application Preview

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Quick Add

![Quick Add](screenshots/quick-add.png)

### Income Statement

![Income Statement](screenshots/income-page.png)
```

---

## Known Limitations

The current version has the following limitations:

- Transactions are stored only in React state.
- Transactions disappear after browser refresh.
- localStorage is not implemented yet.
- `useEffect` persistence has not been implemented yet.
- Category filtering is not implemented yet.
- Date sorting is not implemented yet.
- Transactions cannot currently be edited.
- Monthly summaries are not implemented.
- Budget tracking is not implemented.
- The application currently uses dollars.
- No backend database is connected.
- No login or authentication system exists.
- Data does not synchronize between devices.

---

## Next Development Step

The next major feature will be:

```text
localStorage + useEffect
```

This will allow transaction data to remain available after refreshing the browser.

After persistence is complete, the next features will be:

```text
Category Filter
      |
      v
Date Sorting
      |
      v
Monthly Summary
```

---

## Project Goal

The goal of the Personal Expense Tracker is to provide users with a simple and understandable way to:

- Record income and expenses.
- Understand their current financial position.
- Review detailed financial statements.
- Analyze income and expenses visually.
- Track transaction history.
- Better understand personal spending habits.