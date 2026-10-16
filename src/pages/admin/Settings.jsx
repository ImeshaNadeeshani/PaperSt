import { useState } from "react";
import { useShop } from "../../hooks/useShop";
import useLocalStorage from "../../hooks/useLocalStorage";
import { AdminHeading } from "../../components/common/AdminUI";
import { Field, Button } from "../../components/common/UI";
const groups = {
  General: ["Store name", "Support email", "Phone"],
  "Store Information": ["Address", "Country", "Business hours"],
  Currency: ["Currency", "Currency symbol"],
  Delivery: [
    "Standard delivery fee",
    "Express delivery fee",
    "Free delivery minimum",
  ],
  Payments: ["Card payments", "Bank transfer", "Cash on delivery"],
  Email: ["Sender name", "Reply-to email"],
  Notifications: ["Order notifications", "Low stock alerts"],
  Taxes: ["Tax rate", "Prices include tax"],
  "Social Media": ["Instagram URL", "Facebook URL", "WhatsApp number"],
  SEO: ["Site title", "Meta description"],
  Security: ["Session timeout", "Two-factor authentication"],
};
export default function Settings() {
  const [tab, setTab] = useState("General"),
    [values, setValues] = useLocalStorage("paperist-settings", {
      "Store name": "Paperist",
      "Support email": "hello@paperist.example",
      Country: "Sri Lanka",
      Currency: "LKR",
      "Currency symbol": "Rs.",
      "Standard delivery fee": "350",
      "Express delivery fee": "650",
      "Free delivery minimum": "5000",
    }),
    { notify } = useShop();
  return (
    <>
      <AdminHeading
        title="Store settings"
        description="The little details that keep everything running."
      />
      <div className="settings-layout">
        <aside className="panel settings-nav">
          {Object.keys(groups).map((x) => (
            <button
              className={x === tab ? "active" : ""}
              key={x}
              onClick={() => setTab(x)}
            >
              {x}
            </button>
          ))}
        </aside>
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setValues({
              ...values,
              ...Object.fromEntries(new FormData(e.target)),
            });
            notify("Demo settings saved");
          }}
          key={tab}
        >
          <h2>{tab}</h2>
          <p className="demo-note">
            Configuration preview only. No external service is connected.
          </p>
          {groups[tab].map((x) => (
            <Field
              key={x}
              label={x}
              name={x}
              defaultValue={values[x] || ""}
              type={
                x.toLowerCase().includes("email")
                  ? "email"
                  : x.includes("URL")
                    ? "url"
                    : x === "Meta description"
                      ? "textarea"
                      : "text"
              }
              options={
                [
                  "Card payments",
                  "Bank transfer",
                  "Cash on delivery",
                  "Order notifications",
                  "Low stock alerts",
                  "Prices include tax",
                  "Two-factor authentication",
                ].includes(x)
                  ? ["Enabled", "Disabled"]
                  : undefined
              }
            />
          ))}
          <Button>Save settings</Button>
        </form>
      </div>
    </>
  );
}
