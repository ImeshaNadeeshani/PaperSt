import {
  Heart,
  Lightbulb,
  Palette,
  ShieldCheck,
  Sprout,
  UsersRound,
} from "lucide-react";
import { ReferenceHeader, ReferenceFooter } from "./ReferenceShop";
import "../../reference-about.css";
const mission = [
  {
    Icon: ShieldCheck,
    title: "Quality Products",
    text: (
      <>
        Carefully curated
        <br />
        for everyday use.
      </>
    ),
    colour: "blue",
  },
  {
    Icon: Lightbulb,
    title: "Better Ideas",
    text: (
      <>
        Inspire creativity
        <br />
        in every moment.
      </>
    ),
    colour: "yellow",
  },
  {
    Icon: Heart,
    title: "Happier You",
    text: (
      <>
        Because stationery
        <br />
        makes life brighter.
      </>
    ),
    colour: "pink",
  },
];
const values = [
  {
    Icon: Palette,
    title: "Creativity",
    text: (
      <>
        Encouraging self-expression
        <br />
        in all its forms.
      </>
    ),
    colour: "yellow",
  },
  {
    Icon: Sprout,
    title: "Sustainability",
    text: (
      <>
        Supporting a greener
        <br />
        tomorrow.
      </>
    ),
    colour: "green",
  },
  {
    Icon: UsersRound,
    title: "Community",
    text: (
      <>
        Building a community
        <br />
        of creators and learners.
      </>
    ),
    colour: "blue",
  },
  {
    Icon: Heart,
    title: "Passion",
    text: (
      <>
        Doing what we love
        <br />
        and sharing it with you.
      </>
    ),
    colour: "pink",
  },
];
function ValueCard({ Icon, title, text, colour }) {
  return (
    <article className={"ab-value ab-" + colour}>
      <div className="ab-icon">
        <Icon size={61} strokeWidth={1.7} />
        {title === "Quality Products" && (
          <span className="ab-check" aria-hidden="true" />
        )}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
export default function ReferenceAbout() {
  return (
    <div className="reference-shop reference-about">
      <ReferenceHeader home active="" />
      <main>
        <section className="ab-story" aria-labelledby="ab-story-title">
          <div
            className="ab-story-art"
            role="img"
            aria-label="A creative day at the Paperist desk, with notebooks, a daydreaming artist, and her sleeping cat"
          />
          <div className="ab-story-copy">
            <h1 id="ab-story-title">
              Our Story<span>.</span>
            </h1>
            <div className="ab-tagline">
              Small Stationery.
              <br />
              Big Dreams. <span>♥</span>
            </div>
            <div className="ab-story-prose">
              <p>
                Paperist started with a simple belief — that good ideas deserve
                a beautiful space. We’re a stationery brand inspired by
                students, dreamers and creators who find joy in writing,
                planning and making things.
              </p>
              <p>
                From notebooks to pens, from desk setups to art supplies, we
                carefully curate products that spark creativity and bring more
                meaning to everyday moments.
              </p>
            </div>
          </div>
        </section>
        <section className="ab-mission" aria-labelledby="ab-mission-title">
          <h2 id="ab-mission-title">
            Our Mission<span>.</span>
          </h2>
          <p className="ab-mission-copy">
            To bring thoughtfully designed, high-quality stationery to everyone,
            <br className="ab-desktop-break" /> making everyday moments more
            creative and meaningful.
          </p>
          <div className="ab-mission-grid">
            {mission.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </section>
        <section className="ab-values" aria-labelledby="ab-values-title">
          <h2 id="ab-values-title">
            Our Values<span>.</span>
          </h2>
          <div className="ab-values-grid">
            {values.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </section>
        <section
          className="ab-thanks"
          aria-label="Thank you for being part of our journey"
        >
          <p>
            Thank you
            <br />
            for being part
            <br />
            of our journey! <span>♥</span>
          </p>
          <div>
            Good Ideas.
            <br />
            Brighter Days. <span>♥</span>
          </div>
        </section>
      </main>
      <ReferenceFooter />
    </div>
  );
}
