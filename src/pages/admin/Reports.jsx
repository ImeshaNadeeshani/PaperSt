import { useState } from "react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import {
  AdminHeading,
  SalesChart,
  Table,
} from "../../components/common/AdminUI";
import { Button, Field } from "../../components/common/UI";
import { exportCSV } from "../../utils/export";
export default function Reports() {
  const { orders, products, notify } = useShop(),
    [report, setReport] = useState("Sales"),
    [range, setRange] = useState("7 Days");
  const rows =
    report === "Product" || report === "Inventory"
      ? products.map((p) => ({
          name: p.name,
          total: p.price,
          quantity: p.stock,
        }))
      : orders.map((o) => ({
          name: o.id,
          total: o.total,
          quantity: o.items.reduce((n, x) => n + x.quantity, 0),
        }));
  return (
    <>
      <AdminHeading
        title="Reports & insights"
        description="A clearer picture of your store’s story."
      />
      <div className="report-toolbar">
        <div className="tabs">
          {["Sales", "Orders", "Product", "Customer", "Inventory"].map((x) => (
            <button
              className={report === x ? "active" : ""}
              key={x}
              onClick={() => setReport(x)}
            >
              {x}
            </button>
          ))}
        </div>
        <select
          aria-label="Date range"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          {["Today", "7 Days", "30 Days", "This Month", "Custom Range"].map(
            (x) => (
              <option key={x}>{x}</option>
            ),
          )}
        </select>
      </div>
      {range === "Custom Range" && (
        <div className="form-grid">
          <Field label="From" type="date" />
          <Field label="To" type="date" />
        </div>
      )}
      <p className="demo-note">
        Illustrative mock report. Date selectors preview a reporting period;
        server aggregation comes in Phase 2.
      </p>
      <div className="stat-grid">
        {[
          ["Total revenue", money(orders.reduce((n, o) => n + o.total, 0))],
          ["Orders", orders.length],
          [
            "Average order",
            money(orders.reduce((n, o) => n + o.total, 0) / orders.length),
          ],
        ].map(([title, value]) => (
          <section className="stat panel" key={title}>
            <span>{title}</span>
            <strong>{value}</strong>
          </section>
        ))}
      </div>
      <section className="panel">
        <h3>{report} overview</h3>
        <SalesChart
          days={range === "Today" ? 1 : range === "30 Days" ? 30 : 7}
          metric={report}
        />
      </section>
      <section className="panel">
        <div className="section-header">
          <h3>{report} report</h3>
          <div className="button-row">
            <Button
              secondary
              onClick={() => exportCSV(rows, report + "-report.csv")}
            >
              Export CSV
            </Button>
            <Button
              secondary
              onClick={() =>
                notify(
                  "Excel export preview — workbook generation will be connected in Phase 2.",
                )
              }
            >
              Export Excel
            </Button>
            <Button secondary onClick={() => window.print()}>
              Print / PDF
            </Button>
          </div>
        </div>
        <Table
          columns={["Reference", "Value / price", "Quantity / stock"]}
          rows={rows}
          render={(r) => (
            <>
              <td>{r.name}</td>
              <td>{money(r.total)}</td>
              <td>{r.quantity}</td>
            </>
          )}
        />
      </section>
    </>
  );
}
