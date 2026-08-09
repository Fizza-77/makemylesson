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

const AYLA_IMAGE = "/ChatGPT Image Aug 5, 2026, 11_22_18 AM 1.svg";
const AYLA_AVATAR = "/Group 7.svg";

export default function MeetAylaSection() {
  return (
    <section className="mml-ayla" aria-labelledby="mml-ayla-heading">
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
            <Image
              src={AYLA_IMAGE}
              alt="Ayla, AI teaching assistant"
              width={376}
              height={376}
              className="mml-ayla-character-img"
              priority={false}
            />
          </div>
        </div>

        <div className="mml-ayla-right">
          <div className="mml-ayla-chat">
            <header className="mml-ayla-chat-head">
              <Image
                src={AYLA_AVATAR}
                alt=""
                width={44}
                height={44}
                className="mml-ayla-chat-avatar"
              />
              <div>
                <p className="mml-ayla-chat-name">Ayla</p>
                <p className="mml-ayla-chat-role">AI TEACHING ASSISTANT</p>
              </div>
            </header>

            <div className="mml-ayla-msgs">
              <div className="mml-ayla-msg mml-ayla-msg--bot">
                Hi! I can refine your lesson, suggest activities or adjust
                difficulty.
              </div>
              <div className="mml-ayla-msg mml-ayla-msg--user">
                Add a group activity to the Ecosystems lesson.
              </div>
              <div className="mml-ayla-msg mml-ayla-msg--bot">
                Done — I added a 15-minute Ecosystem Mapping task after core
                teaching.
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
