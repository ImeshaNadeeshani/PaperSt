import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShoppingBag,
  Users,
  Package,
  Wallet,
  ArrowDownRight,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import {
  AdminHeading,
  SalesChart,
  Table,
} from "../../components/common/AdminUI";
import { Status } from "../../components/common/UI";
import { OrderTable } from "../account/AccountPages";
export default function Dashboard() {
  const { orders, products } = useShop(),
    [days, setDays] = useState(7),
    [metric, setMetric] = useState("Revenue");
  return (
    <div className="dashboard-overview">
      <div className="dashboard-welcome">
      <AdminHeading
        title="A good day for good ideas."
        description="Welcome back, Amaya. Here’s how your store is doing."
      />
      <div className="dashboard-quick-actions">
        <Link to="/admin/products/new"><Package size={16} /> Add product <ArrowUpRight size={16} /></Link>
        <Link to="/admin/orders"><ShoppingBag size={16} /> Manage orders</Link>
      </div>
      <span className="dashboard-welcome-note">A little inspiration. A lot of possibility.</span>
      </div>
      <div className="dashboard-period">
        <span>
          <span className="tiny-dot green" /> Your store is looking good
        </span>
        <select
          aria-label="Dashboard period"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value="1">Today</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
      <div className="stat-grid four">
        {[
          [Wallet, "Today’s sales", money(28450), "12.8%", true],
          [ShoppingBag, "Total orders", orders.length, "8.2%", true],
          [Users, "Customers", "248", "14.6%", true],
          [
            Package,
            "Low stock products",
            products.filter((p) => p.stock < 12).length,
            "Needs attention",
            false,
          ],
        ].map(([Icon, title, value, change, up]) => (
          <section className="stat panel" key={title}>
            <div>
              <span>{title}</span>
              <Icon size={19} />
            </div>
            <strong>{value}</strong>
            <small className={up ? "positive" : "red"}>
              {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{" "}
              {change} <span>{up ? "vs. previous period" : ""}</span>
            </small>
          </section>
        ))}
      </div>
      <div className="dashboard-charts">
        <section className="panel">
          <div className="section-header">
            <div>
              <h3>Sales overview</h3>
              <p className="muted">A little growth, every day.</p>
            </div>
            <div className="segmented">
              {["Revenue", "Orders"].map((x) => (
                <button
                  className={metric === x ? "active" : ""}
                  onClick={() => setMetric(x)}
                  key={x}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-total">
            {metric === "Revenue"
              ? money(days === 1 ? 28450 : days === 30 ? 1245800 : 312450)
              : days === 1
                ? "12"
                : days === 30
                  ? "184"
                  : "48"}{" "}
            <span>↗ 12.8%</span>
          </div>
          <SalesChart days={days} metric={metric} />
        </section>
        <section className="panel category-chart">
          <h3>Sales by category</h3>
          <p className="muted">What’s inspiring your customers.</p>
          <div className="donut">
            <div>
              <strong>Rs. 312k</strong>
              <small>Total revenue</small>
            </div>
          </div>
          {[
            ["Notebooks & journals", "42%"],
            ["Pens & pencils", "28%"],
            ["Art supplies", "18%"],
            ["Other essentials", "12%"],
          ].map(([name, value], i) => (
            <div className="legend-row" key={name}>
              <span>
                <i
                  style={{
                    background: ["#26394e", "#c19b73", "#9ba998", "#e6e0d5"][i],
                  }}
                />
                {name}
              </span>
              <strong>{value}</strong>
            </div>
          ))}
        </section>
      </div>
      <section className="panel">
        <div className="section-header">
          <div>
            <h3>Recent orders</h3>
            <p className="muted">Good things on their way.</p>
          </div>
          <Link className="text-link" to="/admin/orders">
            View all orders <ArrowUpRight size={15} />
          </Link>
        </div>
        <OrderTable admin orders={orders.slice(0, 5)} />
      </section>
      <div className="two-columns">
        <section className="panel">
          <div className="section-header">
            <h3>Best selling products</h3>
            <Link to="/admin/products">View all ↗</Link>
          </div>
          <Table
            columns={["Product", "Sold", "Revenue"]}
            rows={products.filter((p) => p.bestSeller).slice(0, 4)}
            render={(p, i) => (
              <>
                <td>
                  <div className="table-product">
                    <img src={p.images[0]} alt={p.name} />
                    <span>
                      {p.name}
                      <small>{p.brand}</small>
                    </span>
                  </div>
                </td>
                <td>{48 - i * 7}</td>
                <td>{money((48 - i * 7) * p.price)}</td>
              </>
            )}
          />
        </section>
        <section className="panel">
          <div className="section-header">
            <h3>Running a little low</h3>
            <Link to="/admin/inventory">Manage stock ↗</Link>
          </div>
          <Table
            columns={["Product", "Stock", "Status"]}
            rows={products.filter((p) => p.stock < 12)}
            render={(p) => (
              <>
                <td>
                  {p.name}
                  <small>{p.SKU}</small>
                </td>
                <td>{p.stock}</td>
                <td>
                  <Status>{p.stock ? "Low stock" : "Out of stock"}</Status>
                </td>
              </>
            )}
          />
        </section>
      </div>
    </div>
  );
}
