/**
 * Infinite marquee strip. Two identical tracks animate -50%; the copy is
 * duplicated enough times that it always overflows the viewport.
 */
export default function Marquee({ items, theme = 'ink', reverse = false }) {
  const row = [...items, ...items, ...items]

  return (
    <div className={`marquee marquee--${theme} ${reverse ? 'marquee--reverse' : ''}`} aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <div className="marquee__copy" key={copy}>
            {row.map((item, i) => (
              <span className="marquee__item" key={i}>
                {item} <span className="marquee__star">✶</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
