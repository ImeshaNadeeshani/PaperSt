import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { Button } from "./UI";
export function AdminHeading({
  eyebrow = "YOUR STORE, AT A GLANCE",
  title,
  description,
  action,
  to,
  onClick,
}) {
  return (
    <div className="admin-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <Button to={to} onClick={onClick}>
          {action} <ArrowUpRight size={16} />
        </Button>
      )}
    </div>
  );
}
export function SalesChart({ days = 7, metric = "Revenue" }) {
  const points =
    days === 1
      ? [20, 35, 22, 40, 60, 45, 70, 68, 90, 75, 100, 92]
      : days === 30
        ? [35, 42, 30, 65, 52, 75, 64, 98, 72, 83, 107, 100]
        : [30, 45, 35, 80, 62, 110, 94];
  const max = 120;
  return (
    <div className="sales-chart">
      <div className="chart-y">
        <span>Rs. 120k</span>
        <span>Rs. 80k</span>
        <span>Rs. 40k</span>
        <span>0</span>
      </div>
      <div className="chart-plot">
        <svg
          viewBox="0 0 600 180"
          role="img"
          aria-label={`${metric} mock trend over ${days} days`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#283b52" stopOpacity=".18" />
              <stop offset="100%" stopColor="#283b52" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 60, 120, 179].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke="#e9edf0"
              strokeDasharray="4 4"
            />
          ))}
          <polygon
            points={`0,180 ${points.map((v, i) => `${(i * 600) / (points.length - 1)},${180 - (v / max) * 170}`).join(" ")} 600,180`}
            fill="url(#chartGradient)"
          />
          <polyline
            points={points
              .map(
                (v, i) =>
                  `${(i * 600) / (points.length - 1)},${180 - (v / max) * 170}`,
              )
              .join(" ")}
            stroke="#283b52"
            fill="none"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
        <div className="chart-x">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
export function Table({ columns, rows, render }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((x, index) => (
              <th key={x + index}>{x}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i}>{render(row, i)}</tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p className="empty">No matching records.</p>}
    </div>
  );
}
export function MoreButton({ onClick }) {
  return (
    <button className="icon-button" aria-label="More actions" onClick={onClick}>
      <MoreHorizontal size={18} />
    </button>
  );
}
