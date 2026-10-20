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
  privacy: [
    "Your privacy matters.",
    "Your ideas are yours. Your information, too.",
    "This prototype stores cart, wishlist, profile, and demo management data in this browser. It does not send payments, authentication credentials, or form requests to a server.",
    "Clear browser site data to remove local demo records. A complete privacy policy will be reviewed before the store launches.",
  ],
  terms: [
    "The little details.",
    "A clear beginning to a good experience.",
    "Paperist Phase 1 is a demonstration storefront. Prices, stock, delivery estimates, and policies are illustrative. Placing a demo order does not create a real purchase.",
    "Real payment, fulfilment, legal terms, and consumer protections will be configured and reviewed before launch.",
  ],
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
