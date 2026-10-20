import { ArrowUpRight, ShoppingBag } from "lucide-react";
import "./deliveryPartners.css";

const partners = [
  {
    name: "PickMe",
    label: "PickMe Food",
    className: "pickme",
    url: import.meta.env.VITE_PICKME_STORE_URL,
    domains: ["pickme.lk", "food.pickme.lk", "pickme.onelink.me"],
  },
  {
    name: "Uber Eats",
    label: "Uber Eats",
    className: "uber",
    url: import.meta.env.VITE_UBER_EATS_STORE_URL,
    domains: ["ubereats.com", "www.ubereats.com", "uber.com", "www.uber.com"],
  },
];
function storeLink(partner) {
  try {
    const url = new URL(partner.url);
    return url.protocol === "https:" && partner.domains.includes(url.hostname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export default function DeliveryPartners() {
  return (
    <section
      className="delivery-partners"
      aria-labelledby="delivery-partners-title"
    >
      <div className="delivery-partners-heading">
        <span className="eyebrow">YOUR STATIONERY, YOUR WAY</span>
        <h2 id="delivery-partners-title">
          Find us on PickMe & Uber Eats<span className="red-dot">.</span>
        </h2>
        <p>
          Choose your favourite app to browse our store. Availability, delivery
          fees, and arrival times are shown by the provider.
        </p>
      </div>
      <div className="delivery-partner-grid">
        {partners.map((partner) => {
          const url = storeLink(partner);
          return (
            <article
              className={`delivery-partner ${partner.className}`}
              key={partner.name}
            >
              <div className="delivery-partner-brand">
                <img className="delivery-partner-original-logo" src={`/images/${partner.className}-logo.png`} alt={partner.className === "uber" ? "Uber" : "PickMe"} />
                <strong>{partner.name}</strong>
                <ShoppingBag size={22} />
              </div>
              <h3>Good ideas, delivered.</h3>
              <p>
                Shop school essentials, office supplies, and everyday stationery
                through {partner.label}.
              </p>
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Open our {partner.name} store <ArrowUpRight size={18} />
                </a>
              ) : (
                <span className="delivery-partner-pending">
                  Store link coming soon
                </span>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
