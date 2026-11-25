import { useLayoutEffect, useRef } from "react";

import { MONTH_NAMES, recentMonths } from "../utils/finance";

/**
 * MonthFilter: a horizontally scrolling row of month pills.
 * The selected month shows its full name and is kept centred.
 */
function MonthFilter({ selectedMonth, setSelectedMonth, count = 12 }) {
  const scrollerRef = useRef(null);
  const hasScrolled = useRef(false);
  const currentYear = new Date().getFullYear();
  const months = recentMonths(count);

  // Centre the selected pill inside the scroller (without scrolling the page).
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const active = scroller?.querySelector('[aria-pressed="true"]');
    if (!scroller || !active) return;
    scroller.scrollTo({
      left: active.offsetLeft - scroller.clientWidth / 2 + active.clientWidth / 2,
      // Jump straight there on first render; animate later changes.
      behavior: hasScrolled.current ? "smooth" : "auto",
    });
    hasScrolled.current = true;
  }, [selectedMonth]);

  return (
    <div
      ref={scrollerRef}
      role="group"
      aria-label="Choose month"
      className="scrollbar-none relative flex gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8"
    >
      {months.map(({ month, year }) => {
        const selected = month === selectedMonth.month && year === selectedMonth.year;
        const name = selected ? MONTH_NAMES[month] : MONTH_NAMES[month].slice(0, 3);
        const label = year === currentYear ? name : `${name} '${String(year).slice(2)}`;

        return (
          <button
            key={`${year}-${month}`}
            type="button"
            aria-pressed={selected}
            aria-label={`${MONTH_NAMES[month]} ${year}`}
            onClick={() => setSelectedMonth({ month, year })}
            className={`pill shrink-0 ${selected ? "pill-active px-5" : "text-muted"}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default MonthFilter;
