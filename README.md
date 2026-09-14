# Personal Expense Tracker

A personal expense tracking application built using React and Tailwind CSS.

The application allows users to record their income and expenses and will provide a simple overview of their financial activity.

## Features

Currently implemented:

- Responsive expense tracker dashboard
- Summary cards for balance, income, and expenses
- Add income and expense transactions
- Transaction type selection
- Amount input
- Category selection
- Description input
- Date selection
- Controlled React form using useState
- Form validation
- Display transaction history
- Conditional empty transaction state
- Render transaction lists using map()
- Unique React keys for transaction items
- Delete individual transactions
- Reusable React components
- Parent-to-child data flow using props

## Planned features:

- Calculate total income
- Calculate total expenses
- Calculate current balance
- Filter transactions by category
- Sort transactions by date
- Save transactions using localStorage
- Spending chart
- Monthly summary
- Budget limit warning

## Technologies Used

- React
- JavaScript
- Tailwind CSS
- Vite
- HTML

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── Header.jsx
│   ├── SummaryCards.jsx
│   └── TransactionForm.jsx
├── App.jsx
├── index.css
└── main.jsx