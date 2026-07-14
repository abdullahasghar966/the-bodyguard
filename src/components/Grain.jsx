/**
 * Full-viewport film grain.
 *
 * The noise is a small SVG turbulence tile pre-rasterized once (via a data-URI
 * background) and repeated — far cheaper than recomputing feTurbulence across
 * the whole viewport every paint, which was stalling the compositor. Styling
 * (fixed position, blend, opacity, tile size) lives in styles.css → .grain.
 */
export default function Grain() {
  return <div className="grain" aria-hidden="true" />
}
