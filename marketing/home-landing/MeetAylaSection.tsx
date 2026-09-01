import Image from "next/image";

const BULLETS = [
  "Knows your curriculum, grade and lesson context",
  "Suggests activities, materials and differentiation",
  "Adapts content for ELL, SEN and gifted learners",
] as const;

const CHIPS = [
  "ADAPT FOR ELL",
  "ADD SEN SUPPORT",
  "INCREASE DIFFICULTY",
  "EXTENSION TASK",
] as const;

const MESSAGES = [
  {
    role: "bot" as const,
    text: "Hi! I can refine your lesson, suggest activities or adjust difficulty.",
  },
  {
    role: "user" as const,
    text: "Add a group activity to the Ecosystems lesson.",
  },
  {
    role: "bot" as const,
    text: "Done — I added a 15-minute Ecosystem Mapping task after core teaching.",
  },
  {
    role: "user" as const,
    text: "Can you adapt that activity for ELL students?",
  },
  {
    role: "bot" as const,
    text: "Yes — I added visual cards and sentence starters so ELL learners can join in confidently.",
  },
] as const;

const AYLA_IMAGE = "/svgs/ayla.webp";
const AYLA_AVATAR = "/Group 7.svg";

function TypingDots() {
  return (
    <span className="mml-ayla-typing" aria-hidden>
      <span />
      <span />
      <span />
    </span>
  );
}

export default function MeetAylaSection() {
  return (
    <section className="mml-ayla" id="ayla" aria-labelledby="mml-ayla-heading">
      <div className="mml-ayla-card">
        <div className="mml-ayla-left">
          <p className="mml-ayla-label">MEET AYLA</p>
          <h2 id="mml-ayla-heading" className="mml-ayla-title">
            <span className="mml-ayla-title-line">The colleague who</span>
            <span className="mml-ayla-title-line">never runs out of ideas.</span>
          </h2>
          <p className="mml-ayla-copy">
            Ayla understands your curriculum, year level and lesson context so
            you can refine teaching materials without starting again.
          </p>
          <ul className="mml-ayla-bullets">
            {BULLETS.map((item) => (
              <li key={item}>
                <span className="mml-ayla-bullet" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <div className="mml-ayla-character">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AYLA_IMAGE}
              alt="Ayla, teaching assistant"
              width={420}
              height={630}
              sizes="(max-width: 767px) 52vw, 30vw"
              className="mml-ayla-character-img"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="mml-ayla-right">
          <div className="mml-ayla-chat">
            <header className="mml-ayla-chat-head">
              <div className="mml-ayla-chat-avatar-wrap">
                <Image
                  src={AYLA_AVATAR}
                  alt="Ayla avatar"
                  width={44}
                  height={44}
                  className="mml-ayla-chat-avatar"
                  loading="lazy"
                />
                <span className="mml-ayla-chat-online" aria-hidden />
              </div>
              <div>
                <p className="mml-ayla-chat-name">Ayla</p>
                <p className="mml-ayla-chat-role">TEACHING ASSISTANT</p>
              </div>
            </header>

            <div
              className="mml-ayla-msgs"
              tabIndex={0}
              aria-label="Ayla conversation"
            >
              {MESSAGES.map((msg) => (
                <div
                  key={`${msg.role}-${msg.text.slice(0, 24)}`}
                  className={`mml-ayla-msg mml-ayla-msg--${msg.role}`}
                >
                  {msg.text}
                </div>
              ))}

              <div
                className="mml-ayla-msg mml-ayla-msg--bot mml-ayla-msg--typing"
                role="status"
                aria-live="polite"
              >
                <span className="sr-only">Ayla is typing</span>
                <TypingDots />
              </div>
            </div>

            <div className="mml-ayla-chips">
              {CHIPS.map((chip) => (
                <span key={chip} className="mml-ayla-chip">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
