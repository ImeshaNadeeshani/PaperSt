import "./paymentOptions.css";

export default function PaymentOptions({ amount, detailed = false }) {
  const installment = new Intl.NumberFormat("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(amount) / 3);
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) return null;
  return <div className={`product-payment-options ${detailed ? "detailed" : ""}`}>
    <span className="payment-preview-label">Pay-in-3 preview</span>
    {[{ name: "KOKO", image: "koko-logo.png" }, { name: "Mintpay", image: "mintpay-logo.png" }].map(provider => <div className="product-installment-row" key={provider.name}><span>3 × <strong>Rs. {installment}</strong> with</span><img src={`/images/${provider.image}`} alt={provider.name} className={provider.name === "Mintpay" ? "mintpay-badge" : "koko-badge"} /></div>)}
    {detailed && <p>Illustrative amounts only. Final instalments, eligibility and terms are confirmed by the provider. KOKO and Mintpay payments are not connected yet.</p>}
  </div>;
}
