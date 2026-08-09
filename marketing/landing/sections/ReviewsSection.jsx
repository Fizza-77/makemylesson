import { REVIEWS_1, REVIEWS_2 } from '../data'
import { Label, Reveal, ReviewCard } from '../shared'

export default function ReviewsSection() {
  const doubled1 = [...REVIEWS_1, ...REVIEWS_1]
  const doubled2 = [...REVIEWS_2, ...REVIEWS_2]

  return (
    <section id="reviews" className="reviews">
      <div className="W">
        <Reveal className="section-head reviews-head">
          <Label center>Reviews</Label>
          <h2 className="reviews-head-title">
            Loved by <em>educators</em> worldwide.
          </h2>
        </Reveal>
      </div>
      <div className="mq-rows">
        <div className="mq-outer">
          <div className="mq-track mq-left">{doubled1.map((r, i) => <ReviewCard key={i} {...r} />)}</div>
        </div>
        <div className="mq-outer">
          <div className="mq-track mq-right">{doubled2.map((r, i) => <ReviewCard key={i} {...r} />)}</div>
        </div>
      </div>
    </section>
  )
}
