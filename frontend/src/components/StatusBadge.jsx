import { Check, X } from 'lucide-react'

export default function StatusBadge({ compliant, active, label }) {
  if (typeof active === 'boolean' || label === 'Active' || label === 'Inactive') {
    const isActive = active ?? label === 'Active'
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-50 text-compliant' : 'bg-red-50 text-danger'
        }`}
      >
        {isActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
        {isActive ? 'Active' : 'Inactive'}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        compliant ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {compliant ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
      {compliant ? 'Compliant' : 'Non-Compliant'}
    </span>
  )
}
