import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ArrowRight,
  Truck,
  Package,
  RotateCcw,
  Store,
} from "lucide-react";
import {
  Breadcrumb,
  Button,
  Field,
  SectionHeader,
} from "../../components/common/UI";
import "../../contact.css";

const contactDetails = [
  {
    Icon: Phone,
    title: "Call us",
    value: "+94 11 234 5678",
    note: "Mon–Sat · 9.00 AM–6.00 PM",
    tone: "rose",
  },
  {
    Icon: Mail,
    title: "Email us",
    value: "hello@paperist.example",
    note: "We'll get back to you as soon as possible.",
    tone: "blue",
  },
  {
    Icon: MapPin,
    title: "Visit our store",
    value: "123 Stationery Road, Colombo 05, Sri Lanka",
    note: "Mon–Sat · 9.00 AM–6.00 PM",
    tone: "sand",
  },
  {
    Icon: MessageCircle,
    title: "WhatsApp us",
    value: "+94 77 123 4567",
    note: "Quick support for orders & enquiries.",
    tone: "green",
  },
];
const questions = [
  {
    Icon: Truck,
    title: "Orders & delivery",
    note: "Track orders, delivery times and shipping options.",
    to: "/delivery",
  },
  {
    Icon: Package,
    title: "Product information",
    note: "Find answers about products, stock and more.",
    to: "/faq",
  },
  {
    Icon: RotateCcw,
    title: "Returns & exchanges",
    note: "Need to return or exchange an item? We can help.",
    to: "/returns",
  },
  {
    Icon: Store,
    title: "Store information",
    note: "Get to know our stationery space and services.",
    to: "/about",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="contact-page">
      <section className="contact-image-banner" aria-labelledby="contact-title">
        <h1 id="contact-title" className="contact-accessible-title">Contact us.</h1>
        <img src="/images/contact-banner.png" alt="Contact Us — we're just a message away. Sunlit stationery desk with a sleeping cat, plants and a laptop." width="2172" height="724" fetchPriority="high" />
      </section>
      <div className="container contact-content">
        <Breadcrumb name="Contact Us" />
        <div className="contact-main">
          <section className="contact-details">
            <span className="eyebrow">
              GET IN TOUCH <span className="red-dot">●</span>
            </span>
            <div className="contact-talk">
              <h2>
                Let's talk<span className="red-dot">.</span>
              </h2>
              <Send size={44} strokeWidth={1.3} aria-hidden="true" />
            </div>
            <p className="contact-intro">
              Have a question, need help with an order, or looking for something
              specific? Our team is here to help you.
            </p>
            <div className="contact-methods">
              {contactDetails.map(({ Icon, title, value, note, tone }) => (
                <div className="contact-method" key={title}>
                  <span className={`contact-icon ${tone}`}>
                    <Icon size={27} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{value}</p>
                    <small>{note}</small>
                  </div>
                </div>
              ))}
            </div>
            <p className="contact-demo-note">
              Contact details and store location are placeholders for this demo.
            </p>
          </section>
          <section className="contact-message-paper">
            <Mail
              className="contact-envelope"
              size={64}
              strokeWidth={1.2}
              aria-hidden="true"
            />
            <h2>
              Send us a message<span className="red-dot">.</span>
            </h2>
            <p>Fill in the form below and we'll get back to you shortly.</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
                event.currentTarget.reset();
              }}
              onChange={() => setSubmitted(false)}
            >
              <div className="contact-form-pair">
                <Field
                  label="Full name *"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  maxLength={100}
                />
                <Field
                  label="Email address *"
                  name="email"
                  autoComplete="email"
                  type="email"
                  placeholder="yourname@email.com"
                  required
                />
              </div>
              <label className="field">
                <span>Subject *</span>
                <select name="subject" defaultValue="" required>
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {[
                    "Order enquiry",
                    "Delivery & shipping",
                    "Product information",
                    "Returns & exchanges",
                    "Corporate & bulk orders",
                    "Something else",
                  ].map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>
              </label>
              <Field
                label="Your message *"
                name="message"
                type="textarea"
                placeholder="Write your message here…"
                required
                maxLength={3000}
              />
              <Button type="submit">
                Send message <ArrowRight size={19} />
              </Button>
              <p className="contact-demo-note">
                Demo form — messages are not sent to a server.
              </p>
              {submitted && (
                <div className="contact-form-success" role="status">
                  Thank you! Your demo submission is complete. No email was
                  sent.
                </div>
              )}
            </form>
            <div className="contact-paper-art" aria-hidden="true" />
          </section>
        </div>
        <section className="contact-location-row" aria-label="Find our store">
          <div className="contact-map">
            <iframe
              title="Google Maps — No. 27, Layards Road, Bamboo"
              src="https://www.google.com/maps?q=no+27,+layards+road,+bamboo&ll=6.8856642,79.8598531&z=17&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href="https://www.google.com/maps/search/no+27,+layards+road,+bamboo/@6.8856642,79.8598531,17.77z?entry=ttu"
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={25} />
              <span>
                <strong>No. 27, Layards Road</strong>
                <small>Open in Google Maps ↗</small>
              </span>
            </a>
          </div>
          <div className="contact-store-art">
            <div>
              <Store size={25} />
              <h2>
                A little space
                <br />
                for good ideas<span className="red-dot">.</span>
              </h2>
              <p>
                Discover stationery for your notes, plans, and everyday
                inspiration.
              </p>
              <Link to="/shop">
                Explore our collection <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
        <section className="contact-faqs">
          <SectionHeader
            title="Frequently asked questions"
            to="/faq"
            link="View all FAQs"
          />
          <div className="contact-faq-grid">
            {questions.map(({ Icon, title, note, to }) => (
              <Link to={to} className="contact-faq-card" key={title}>
                <span className="contact-icon blue">
                  <Icon size={25} strokeWidth={1.5} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{note}</p>
                </div>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
