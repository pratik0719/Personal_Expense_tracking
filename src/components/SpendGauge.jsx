/**
 * SpendGauge draws a half-circle of rounded bars, coloured by category,
 * filling up to how much of the limit has been used. Unused capacity
 * stays dim. Children are shown in the middle of the arc.
 *
 * parts:    [{ color, value }] in display order
 * capacity: the amount a full gauge represents (budget, income, ...)
 */
const SEGMENTS = 22;
const CENTER_X = 160;
const CENTER_Y = 154;
const INNER = 108;
const OUTER = 146;

function SpendGauge({ parts, capacity, label, children }) {
  const used = parts.reduce((sum, part) => sum + part.value, 0);
  // If spending exceeds the capacity, scale the gauge to the spending.
  const scale = Math.max(capacity, used, 1);

  // Running totals tell us which category each bar falls into.
  const bounds = [];
  parts.reduce((start, part) => {
    bounds.push({ end: start + part.value, color: part.color });
    return start + part.value;
  }, 0);

  const bars = Array.from({ length: SEGMENTS }, (_, index) => {
    const position = ((index + 0.5) / SEGMENTS) * scale;
    const owner = position <= used ? bounds.find((bound) => position <= bound.end) : null;
    const angle = Math.PI - ((index + 0.5) / SEGMENTS) * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
      x1: CENTER_X + INNER * cos,
      y1: CENTER_Y - INNER * sin,
      x2: CENTER_X + OUTER * cos,
      y2: CENTER_Y - OUTER * sin,
      color: owner?.color ?? "rgb(255 255 255 / 0.07)",
    };
  });

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <svg viewBox="0 0 320 166" className="block w-full" role="img" aria-label={label}>
        {bars.map((bar, index) => (
          <line
            key={index}
            x1={bar.x1}
            y1={bar.y1}
            x2={bar.x2}
            y2={bar.y2}
            stroke={bar.color}
            strokeWidth="13"
            strokeLinecap="round"
          />
        ))}
      </svg>

      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center text-center">{children}</div>
    </div>
  );
}

/** Shrinks long amounts so they fit inside the arc. */
export const gaugeAmountClass = (text) =>
  `money leading-tight font-bold ${text.length > 13 ? "text-xl" : "text-2xl"}`;

export default SpendGauge;
