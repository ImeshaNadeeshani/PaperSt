import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Contact from "./Contact";
import { photos } from "../../data/products";
import { useShop } from "../../hooks/useShop";
import {
  Button,
  Field,
  Breadcrumb,
  SectionHeader,
  EmptyState,
} from "../../components/common/UI";
import useLocalStorage from "../../hooks/useLocalStorage";
import { rfqs as rfqSeed } from "../../data/rfqs";
const copy = {
  delivery: [
    "Good things, delivered.",
    "Islandwide delivery, from our little corner to yours.",
    "Standard delivery takes 3–5 business days and costs Rs. 350. Orders over Rs. 5,000 qualify for free standard delivery. Express delivery costs Rs. 650. Store pickup is free.",
    "Delivery times are estimates in this demonstration storefront. A real order confirmation and tracking service will be connected in Phase 2.",
  ],
  returns: [
    "Room to change your mind.",
    "We want you to love every little detail.",
    "Request a return within 14 days of delivery. Items should be unused, in their original packaging, with proof of purchase. Contact our team with your order number and reason for returning.",
    "Damaged or incorrect items? Let us know within 48 hours so we can help. Customised stationery is excluded unless faulty. These are sample store policies for the demo.",
  ],
};
const policies = {
  privacy: {
    title: "Privacy Policy",
    intro: "How Paperist handles information in this demonstration website.",
    sections: [
      ["Information you enter", "You may enter contact, delivery, profile and order details while exploring the site. Cart, wishlist, profile, demo orders and other demo records are stored in your browser's local storage. Checkout form entries may also be held temporarily while you use the page."],
      ["How the demo uses information", "The site uses these details to display your cart, simulate checkout and show your demo account and orders. Demo contact and newsletter forms do not send a message or create a subscription."],
      ["External services and images", "When configured, the site requests product information from Supabase. Product images and other resources may load from external providers, which receive the technical information needed to serve those requests, such as your IP address."],
      ["Payments", "The checkout is a demonstration. It does not process payments or submit real orders. Please do not enter real payment card details."],
      ["Storage and your choices", "Local demo records remain on your device until removed. You can clear this website's data through your browser settings; doing so will remove saved demo records on that browser. Avoid entering sensitive information on shared devices."],
      ["Questions and updates", "This policy describes the current demo and may change as the store is developed. See the Contact Us page for the current contact information; the contact details and form are placeholders in this demo."],
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "The terms for using the Paperist demonstration website.",
    sections: [
      ["Using the website", "You may browse the site for personal, lawful use. Please do not interfere with the service, misuse its forms or attempt to access restricted areas without permission."],
      ["Product information", "Product names, images, descriptions, prices and availability are provided for demonstration and may contain errors or become outdated. Some product information is a snapshot from external listings and does not update automatically."],
      ["Orders and payment", "The cart and checkout simulate a shopping experience. A demo order is not a real purchase or an order confirmation, and no payment is processed. Displayed payment methods are examples."],
      ["Delivery and returns", "Delivery charges, estimates and returns information shown on the site are sample terms. No delivery or return service is created by placing a demo order."],
      ["Accounts and local data", "Demo account and order information may be stored in your browser and can be lost if you clear site data or change devices. Keep your device secure and do not use sensitive information in the demo."],
      ["Content and third-party services", "Product images and third-party resources may belong to their respective owners. Links and external services are subject to their own terms and availability."],
      ["Changes and contact", "These terms may be updated as Paperist develops. Visit the Contact Us page for current contact details; the details and contact form are placeholders in this demo."],
    ],
  },
};
export default function Information() {
  const { pathname } = useLocation(),
    key = pathname.slice(1),
    [opened, setOpened] = useState(0);
  if (key === "about")
    return (
      <div className="container page">
        <Breadcrumb name="About Us" />
        <section className="about-hero">
          <div>
            <span className="eyebrow">ABOUT PAPERST.</span>
            <h1>
              Good ideas
              <br />
              <em>start here.</em>
            </h1>
            <p>PaperSt. — stationery for learning, working, and creating.</p>
            <p>
              PaperSt. is a stationery space for students, professionals,
              artists, and anyone who loves a fresh page. From school essentials
              and office supplies to notebooks, journals, and art materials, our
              collection brings together practical tools for everyday ideas.
            </p>
            <p>
              We believe the little things can make a big difference: a pen that
              helps you think, a notebook that keeps your plans together, or a
              desk that inspires you to begin. Our aim is to make choosing
              stationery simple, enjoyable, and full of possibility.
            </p>
            <Button to="/shop">
              Find your inspiration <ArrowUpRight size={17} />
            </Button>
          </div>
          <img
            src="/images/contact-storefront.png"
            alt="Illustration of a welcoming stationery shop filled with notebooks and creative supplies"
          />
        </section>
        <section className="section">
          <SectionHeader title="For every chapter of your day" to={null} />
          <div className="three-columns">
            {[
              [
                "Learn with confidence",
                "Exercise books, pens, pencils, and school essentials to support notes, lessons, and new discoveries.",
              ],
              [
                "Work with purpose",
                "Office stationery, filing supplies, and desk organisers to keep your workspace and plans together.",
              ],
              [
                "Create your own story",
                "Journals, sketchbooks, paper, and art supplies for the ideas that deserve room to grow.",
              ],
            ].map(([title, text]) => (
              <article className="panel" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  if (key === "brands")
    return (
      <div className="container page">
        <Breadcrumb name="Brands" />
        <h1>
          Good company<span className="red-dot">.</span>
        </h1>
        <p>Meet the makers behind your everyday favourites.</p>
        <div className="brand-grid">
          {["Kokuyo", "MUJI", "Stabilo", "Paperist", "Midori", "Sakura"].map(
            (x) => (
              <Link to={"/search?q=" + x} key={x}>
                <h2>{x}</h2>
                <span>Explore the collection ↗</span>
              </Link>
            ),
          )}
        </div>
      </div>
    );
  if (key === "blog")
    return (
      <div className="container page">
        <Breadcrumb name="Journal" />
        <span className="eyebrow">THE PAPERIST JOURNAL</span>
        <h1>
          A few good ideas<span className="red-dot">.</span>
        </h1>
        <div className="three-columns">
          {[
            ["A desk that feels like you", photos.desk],
            ["The joy of a fresh notebook", photos.notebooks],
            ["Make a little time to create", photos.art],
          ].map(([title, image], i) => (
            <article className="blog-card" key={title}>
              <img src={image} alt={title} />
              <span className="eyebrow">INSPIRATION · 5 MIN READ</span>
              <h2>{title}</h2>
              <p>
                {
                  [
                    "Start with the things you use every day. A calm corner, a favourite pen, and room for your imagination.",
                    "There’s something lovely about an empty page. Try a daily note, a reading list, or a little gratitude ritual.",
                    "Creativity begins with showing up. Keep your sketchbook close and give yourself ten minutes to explore.",
                  ][i]
                }
              </p>
              <Link
                className="text-link"
                to={i === 2 ? "/category/art" : "/shop"}
              >
                Shop the story ↗
              </Link>
            </article>
          ))}
        </div>
      </div>
    );
  if (key === "faq")
    return (
      <div className="container page narrow">
        <Breadcrumb name="FAQs" />
        <h1>
          A few little answers<span className="red-dot">.</span>
        </h1>
        {[
          [
            "Do you deliver islandwide?",
            "Yes! Standard delivery is available throughout Sri Lanka.",
          ],
          [
            "How do I get free delivery?",
            "Spend over Rs. 5,000 for free standard delivery.",
          ],
          [
            "Can I return an item?",
            "You can request a return within 14 days for unused items in their original packaging.",
          ],
          [
            "What payment methods are available?",
            "The demo previews card, bank transfer, and cash on delivery. No real payment is collected.",
          ],
          [
            "Do you offer bulk orders?",
            "Yes — explore our corporate page to send a demo quote request.",
          ],
        ].map(([q, a], i) => (
          <div className="faq-item" key={q}>
            <button
              aria-expanded={opened === i}
              onClick={() => setOpened(opened === i ? -1 : i)}
            >
              {q}
              <span>{opened === i ? "−" : "+"}</span>
            </button>
            {opened === i && <p>{a}</p>}
          </div>
        ))}
      </div>
    );
  if (key === "contact") return <Contact />;
  if (policies[key]) {
    const policy = policies[key];
    return (
      <article className="container page narrow">
        <Breadcrumb name={policy.title} />
        <span className="eyebrow">THE PAPERIST DETAILS</span>
        <h1>{policy.title}</h1>
        <p className="lead">{policy.intro}</p>
        <p>Draft for the current demonstration website. Review and update before launch.</p>
        {policy.sections.map(([title, text]) => (
          <section key={title} style={{ marginTop: "2rem" }}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <p><Link to="/contact">Contact Us</Link></p>
      </article>
    );
  }
  if (copy[key]) {
    const [title, subtitle, ...paragraphs] = copy[key];
    return (
      <div className="container page narrow">
        <Breadcrumb name={key} />
        <span className="eyebrow">THE PAPERIST DETAILS</span>
        <h1>{title}</h1>
        <p className="lead">{subtitle}</p>
        {paragraphs.map((x) => (
          <section className="panel" key={x}>
            <p>{x}</p>
          </section>
        ))}
        <Button to="/contact" secondary>
          Need a little help?
        </Button>
      </div>
    );
  }
  return (
    <div className="container page">
      <EmptyState
        title="404 — A page yet to be written"
        text="This page could not be found. Let’s get you back to the good ideas."
      />
    </div>
  );
}
export function Corporate() {
  const { notify } = useShop(),
    [rfqs, setRfqs] = useLocalStorage("paperist-rfqs", rfqSeed);
  return (
    <div className="container page">
      <Breadcrumb name="Corporate & bulk orders" />
      <section className="catalog-banner">
        <div>
          <span className="eyebrow">GOOD IDEAS, TOGETHER</span>
          <h1>
            Corporate &<br />
            bulk orders.
          </h1>
          <p>Thoughtful stationery for teams, schools, and every occasion.</p>
        </div>
        <img src={photos.desk} alt="Corporate stationery collection" />
      </section>
      <div className="chips">
        {[
          "Custom stationery",
          "Branded notebooks",
          "Employee welcome packs",
          "School supplies",
          "Event stationery",
        ].map((x) => (
          <span key={x}>{x}</span>
        ))}
      </div>
      <div className="two-columns section">
        <div>
          <h2>Make it a little more personal.</h2>
          <p>
            From a beautiful notebook with your logo to a complete welcome kit,
            we’ll help put together something thoughtful.
          </p>
          <p>
            Tell us what you have in mind. Your request will be saved locally
            and appear in the admin RFQ demo.
          </p>
        </div>
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            delete data["Logo upload"];
            setRfqs([
              {
                ...data,
                id: "RFQ-" + Date.now().toString().slice(-5),
                status: "New",
                date: new Date().toISOString().slice(0, 10),
              },
              ...rfqs,
            ]);
            notify(
              "Demo quote request saved. View it in Admin → Corporate RFQs.",
            );
            e.target.reset();
          }}
        >
          <h3>Let’s make something good</h3>
          <div className="form-grid">
            {[
              "Company name",
              "Contact person",
              "Email",
              "Phone",
              "Product",
              "Estimated quantity",
              "Required date",
            ].map((x) => (
              <Field
                key={x}
                label={x}
                name={x}
                type={
                  x === "Email"
                    ? "email"
                    : x === "Estimated quantity"
                      ? "number"
                      : x === "Required date"
                        ? "date"
                        : "text"
                }
                min={x === "Estimated quantity" ? 1 : undefined}
                required
              />
            ))}
            <Field
              label="Branding required"
              name="Branding required"
              options={["Yes", "No", "Not sure yet"]}
            />
          </div>
          <Field
            label="Logo upload"
            name="Logo upload"
            type="file"
            accept="image/*,.pdf"
          />
          <Field label="Message" name="Message" type="textarea" required />
          <Button>Submit demo request ↗</Button>
        </form>
      </div>
    </div>
  );
}
