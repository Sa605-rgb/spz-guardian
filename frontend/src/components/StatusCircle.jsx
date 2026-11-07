import { Check, HelpCircle, Minus, X } from 'lucide-react'

/**
 * Green check, red X, grey dash (non-opportunity),
 * orange dashed (medium residual — still time to intervene), amber ? (not recognised).
 */
export default function StatusCircle({
  ok,
  neutral = false,
  unknown = false,
  residual = false,
  className = '',
}) {
  if (unknown) {
    return (
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 bg-amber-500 ${className}`}
        aria-label="Not recognised"
        title="Not recognised — does not match M1-01 to M1-06"
      >
        <HelpCircle className="w-3 h-3 text-white" strokeWidth={3} />
      </span>
    )
  }

  if (residual) {
    return (
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 border-2 border-dashed border-orange-500 bg-orange-50 ${className}`}
        aria-label="Medium residual risk"
        title="Medium residual risk — intervene before this becomes non-compliant"
      >
        <Minus className="w-3 h-3 text-orange-500" strokeWidth={3} />
      </span>
    )
  }

  if (neutral) {
    return (
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 bg-slate-400 ${className}`}
        aria-label="Non-opportunity"
        title="Non-opportunity — not Moment 1"
      >
        <Minus className="w-3 h-3 text-white" strokeWidth={3} />
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${
        ok ? 'bg-compliant' : 'bg-danger'
      } ${className}`}
      aria-label={ok ? 'Compliant' : 'Non-compliant'}
    >
      {ok ? (
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      ) : (
        <X className="w-3 h-3 text-white" strokeWidth={3} />
      )}
    </span>
  )
}
