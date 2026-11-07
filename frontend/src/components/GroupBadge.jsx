import {
  User,
  Stethoscope,
  GraduationCap,
  SprayCan,
  Truck,
  Users,
  Handshake,
} from 'lucide-react'
import { hhGroupMeta } from '../data/dummyData'

const groupIcons = {
  nurse: Users,
  doctor: Stethoscope,
  hca: Handshake,
  student: GraduationCap,
  cleaner: SprayCan,
  porter: Truck,
  visitor: User,
}

/** Map singular roles (Testing Dashboard) → group meta keys */
const ROLE_TO_GROUP = {
  Doctor: 'Doctors',
  Doctors: 'Doctors',
  Nurse: 'Nurses',
  Nurses: 'Nurses',
  HCA: 'HCAs',
  HCAs: 'HCAs',
  Cleaner: 'Cleaners',
  Cleaners: 'Cleaners',
  Porter: 'Porters',
  Porters: 'Porters',
  Visitor: 'Visitors',
  Visitors: 'Visitors',
  'Nurse Student': 'Nurse Students',
  'Nurse Students': 'Nurse Students',
  Staff: 'HCAs',
}

export function resolveGroupKey(roleOrGroup) {
  return ROLE_TO_GROUP[roleOrGroup] || roleOrGroup
}

export default function GroupBadge({ group, role, compact = false }) {
  const key = resolveGroupKey(group || role)
  const meta = hhGroupMeta[key] || { color: '#64748B', icon: 'visitor', label: '', border: false }
  const Icon = groupIcons[meta.icon] || User
  const isWhite = (meta.color || '').toUpperCase() === '#FFFFFF'
  const label = group || role || key

  return (
    <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
      <span
        className={`${compact ? 'w-7 h-7' : 'w-8 h-8'} rounded-lg flex items-center justify-center shrink-0 shadow-sm`}
        style={{
          backgroundColor: meta.color,
          border: meta.border || isWhite ? '1.5px solid #94A3B8' : 'none',
        }}
        title={`${key}${meta.label ? ` — ${meta.label}` : ''}`}
      >
        <Icon
          className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}
          style={{ color: isWhite || meta.color === '#7DD3FC' ? '#0A1628' : '#FFFFFF' }}
        />
      </span>
      {label}
    </span>
  )
}
