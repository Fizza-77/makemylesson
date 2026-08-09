export default function ReviewsSection() {
  return (
    <section className="mml-rv" id="reviews" aria-labelledby="mml-rv-heading">
      <div className="mml-rv-inner">
        <p className="mml-rv-eyebrow">
          <span className="mml-rv-eyebrow-dots" aria-hidden>
            <span className="mml-rv-eyebrow-dot mml-rv-eyebrow-dot--teal" />
            <span className="mml-rv-eyebrow-dot mml-rv-eyebrow-dot--muted" />
          </span>
          REVIEWS
        </p>

        <h2 id="mml-rv-heading" className="mml-rv-title">
          Pinned in staffrooms worldwide.
        </h2>

        <p className="mml-rv-sub">
          Real teacher reactions, presented like the notes that get passed
          around a staffroom when someone finds something useful.
        </p>

        <div className="mml-rv-board">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/reviews-board.svg"
            alt="Teacher reviews pinned like staffroom notes from James T., Sarah M., Daniel R., Priya K., Mark H., Olivia P., Emily C. and Michael B."
            width={1232}
            height={885}
            className="mml-rv-board-img"
          />
        </div>
      </div>
    </section>
  );
}
