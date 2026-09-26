/**
 * MonthFilter allows users to select
 * which month and year they want to view.
 *
 * It sends the selected month/year
 * back to Dashboard.jsx.
 */
function MonthFilter({
  selectedMonth,
  setSelectedMonth,
}) {

  /**
   * Generates available years.
   *
   * Current year and previous years
   * are displayed.
   */
  const currentYear = new Date().getFullYear();

  const years = [
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
  ];


  /**
   * List of all months.
   */
  const months = [
    {
      value: 0,
      name: "January",
    },
    {
      value: 1,
      name: "February",
    },
    {
      value: 2,
      name: "March",
    },
    {
      value: 3,
      name: "April",
    },
    {
      value: 4,
      name: "May",
    },
    {
      value: 5,
      name: "June",
    },
    {
      value: 6,
      name: "July",
    },
    {
      value: 7,
      name: "August",
    },
    {
      value: 8,
      name: "September",
    },
    {
      value: 9,
      name: "October",
    },
    {
      value: 10,
      name: "November",
    },
    {
      value: 11,
      name: "December",
    },
  ];


  /**
   * Updates selected month.
   */
  const handleMonthChange = (event) => {

    setSelectedMonth({
      ...selectedMonth,
      month:
        Number(event.target.value),
    });

  };


  /**
   * Updates selected year.
   */
  const handleYearChange = (event) => {

    setSelectedMonth({
      ...selectedMonth,
      year:
        Number(event.target.value),
    });

  };


  return (
    <div className="flex flex-wrap gap-3">

      {/* Month Selection */}
      <select
        value={selectedMonth.month}
        onChange={handleMonthChange}
        className="
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        text-sm
        outline-none
        "
      >

        {months.map((month)=>(
          <option
            key={month.value}
            value={month.value}
          >
            {month.name}
          </option>
        ))}

      </select>


      {/* Year Selection */}
      <select
        value={selectedMonth.year}
        onChange={handleYearChange}
        className="
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        text-sm
        outline-none
        "
      >

        {
          years.map((year)=>(
            <option
              key={year}
              value={year}
            >
              {year}
            </option>
          ))
        }

      </select>


    </div>
  );
}


export default MonthFilter;