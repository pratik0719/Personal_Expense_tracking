import {
  useState,
} from "react";


import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import FinanceChart from "../components/FinanceChart";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import MonthFilter from "../components/MonthFilter";


/**
 * Dashboard controls the main financial overview.
 *
 * It:
 * - Stores selected month/year.
 * - Filters transactions.
 * - Sends filtered data to components.
 */
function Dashboard({
  transactions,
  addTransaction,
  deleteTransaction,
}) {


  /**
   * Default selected month.
   *
   * Current month opens automatically.
   */
  const today =
    new Date();


  const [
    selectedMonth,
    setSelectedMonth,
  ] = useState({

    month:
      today.getMonth(),

    year:
      today.getFullYear(),

  });



  /**
   * Filters transactions
   * based on selected month/year.
   */
  const filteredTransactions =
    transactions.filter(
      (transaction)=>{

        const date =
          new Date(
            `${transaction.date}T00:00:00`
          );


        return (

          date.getMonth()
          === selectedMonth.month

          &&

          date.getFullYear()
          === selectedMonth.year

        );

      }
    );



  return (

    <div className="
    min-h-screen
    bg-slate-50
    ">


      <div className="
      mx-auto
      max-w-[1500px]
      p-4
      sm:p-6
      lg:p-8
      ">


        <Header />


        {/* Month Filter */}
        <div className="
        mt-6
        flex
        justify-between
        rounded-3xl
        bg-white
        p-5
        shadow-sm
        border
        border-slate-200
        ">


          <div>

            <h2 className="
            font-bold
            text-slate-900
            ">
              Financial Overview
            </h2>


            <p className="
            text-sm
            text-slate-500
            ">
              View monthly income and expenses
            </p>


          </div>


          <MonthFilter

            selectedMonth={
              selectedMonth
            }

            setSelectedMonth={
              setSelectedMonth
            }

          />


        </div>



        {/* Summary uses filtered data */}
        <SummaryCards

          transactions={
            filteredTransactions
          }

        />



        <div className="
        mt-6
        grid
        gap-6
        xl:grid-cols-[1.35fr_0.65fr]
        ">


          <FinanceChart

            transactions={
              filteredTransactions
            }

          />



          <div id="transaction-form">

            <TransactionForm

              addTransaction={
                addTransaction
              }

            />

          </div>


        </div>



        <div className="mt-6">


          <TransactionList

            transactions={
              filteredTransactions
            }

            deleteTransaction={
              deleteTransaction
            }

          />


        </div>



      </div>


    </div>

  );
}


export default Dashboard;