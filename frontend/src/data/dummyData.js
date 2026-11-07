export const LOCATION = 'Elizabeth Ward, Bangor Hospital'
export const HOSPITAL = 'Bangor Hospital'
export const WARD = 'Elizabeth Ward'
export const VERSION = 'v2.4.1'

export const navItems = [
  { path: '/', label: 'Testing Dashboard', icon: 'Star' },
  { path: '/hand-hygiene', label: 'Hand Hygiene Dashboard', icon: 'Droplets' },
  { path: '/environmental', label: 'Environmental Dashboard', icon: 'Stethoscope' },
  { path: '/heatmap', label: 'Ward Compliance & Heatmap', icon: 'LayoutGrid' },
  { path: '/patient-care', label: 'Patient Care', icon: 'BedDouble' },
  { path: '/patient-safety', label: 'Patient Safety', icon: 'ShieldPlus' },
  { path: '/reports', label: 'Reports', icon: 'FileText' },
  { path: '/alerts', label: 'Alerts', icon: 'Bell' },
  { path: '/devices', label: 'Devices', icon: 'Smartphone' },
  { path: '/users', label: 'Users', icon: 'User' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
]

/** Event code legend */
export const eventCodes = {
  E001: 'Entry',
  EX001: 'Exit',
  PT001: 'Patient Touched',
  PNT001: 'Patient Not Touched',
  D1001: '1 press dispenser',
  D2001: '2 presses dispenser',
  D0001: 'Dispenser Ignored',
  'HR>20001': 'Hand rub >20 sec',
  'HR<20001': 'Hand rub <20 sec',
  SET001: 'Shared Equipment Touched',
  HTST001: 'High Touch Surface Touched',
  MDPT001: 'Medical Device Touched Patient',
}

/** Bay A SPZ001 … Bay A SPZ024 (then B/C/D for variety) */
export function bayLocation(spzNum, bay = 'A') {
  return `Bay ${bay} SPZ${String(spzNum).padStart(3, '0')}`
}

/**
 * POC workbook order: M1-01…M1-06, then NR (not recognised).
 */
const ROLES = ['Doctor', 'Nurse', 'HCA', 'Cleaner']
const BAYS = ['A', 'B', 'C', 'D']

const POC_SEEDS = [
  { code: 'M1-01', bucket: 'directTouch', compliant: false, reason: 'No hand hygiene', event_code: 'PT001' },
  { code: 'M1-02', bucket: 'nonOpportunity', compliant: true, reason: 'Not an opportunity', event_code: 'EX001' },
  {
    code: 'M1-03',
    bucket: 'qualityStack',
    compliant: false,
    reason: 'Ineffective dose; Ineffective coverage; Contact time <20s',
    event_code: 'D1001',
  },
  { code: 'M1-04', bucket: 'ineffectiveDose', compliant: false, reason: 'Ineffective dose', event_code: 'D1001' },
  {
    code: 'M1-05',
    bucket: 'contactTime',
    compliant: false,
    reason: 'Ineffective coverage; Contact time <20s',
    event_code: 'HR<20001',
  },
  { code: 'M1-06', bucket: 'compliant', compliant: true, reason: 'Compliant Moment 1', event_code: 'HR>20001' },
  {
    code: 'NR',
    bucket: 'notRecognised',
    compliant: null,
    reason: 'Not recognised — ignore or missed?',
    event_code: 'SET001',
  },
]

function dummyRow(seed, i, period, timestamp) {
  const key = `demo-${i + 1}`
  return {
    key,
    id: key,
    event_code: seed.event_code,
    code: seed.code,
    scenario: seed.code,
    bucket: seed.bucket,
    compliant: seed.compliant,
    reason: seed.reason,
    failures: seed.reason === '—' ? [] : seed.reason.split('; '),
    role: ROLES[i % ROLES.length],
    location: bayLocation((i % 24) + 1, BAYS[i % 4]),
    period,
    timestamp,
  }
}

function buildAllTestingEvents() {
  const list = []
  while (list.length < 34) {
    const i = list.length
    const seed = POC_SEEDS[i % POC_SEEDS.length]
    const period = i < 12 ? 'today' : i < 24 ? 'week' : 'month'
    const day = i < 24 ? 27 : 20
    list.push(
      dummyRow(
        seed,
        i,
        period,
        `${day}-07-2026 ${String(8 + (i % 10)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
      ),
    )
  }
  return list
}

export const allTestingEvents = buildAllTestingEvents()

/** First 5 featured rows (same as wireframe) */
export const testingEvents = allTestingEvents.slice(0, 5)

export function filterEventsByPeriod(events, period) {
  if (period === 'Today') return events.filter((e) => e.period === 'today')
  if (period === 'This Week') return events.filter((e) => e.period === 'today' || e.period === 'week')
  return events // This Month = all
}

export function calcTestingStats(events) {
  const moment1Compliant = events.filter((e) => e.code === 'M1-06').length
  const moment1NonCompliant = events.filter((e) => ['M1-01', 'M1-03', 'M1-04', 'M1-05'].includes(e.code)).length
  const nonOpportunity = events.filter((e) => e.code === 'M1-02').length
  const notRecognised = events.filter((e) => e.code === 'NR').length
  return {
    totalEvents: events.length,
    moment1Compliant,
    moment1NonCompliant,
    nonOpportunity,
    notRecognised,
  }
}

export const testingStats = calcTestingStats(allTestingEvents)

export function buildEventMetadata(event) {
  const stamp = String(event.timestamp || '').trim()
  const [date, time] = stamp.split(/\s+/)
  return {
    event: event.id,
    date: event.date || date || '',
    time: event.time || time || '',
    location: event.location,
    role: event.role,
    scenario: event.code || event.scenario,
    compliance: event.compliant,
    reason: event.reason,
    failures: event.failures,
    event_code: event.event_code,
  }
}

/** Hospital patient-zone sample: doctor + patient bed (Mixkit 35956) */
export const EVENT_VIDEO_URL = '/videos/hospital-event.mp4?v=3'

/** Stephen group colour cues (+ icon cues, not colour alone) */
export const hhGroupMeta = {
  Nurses: { color: '#001F3F', label: 'Navy blue', icon: 'nurse' },
  Doctors: { color: '#FFFFFF', label: 'White', icon: 'doctor', border: true },
  HCAs: { color: '#2E8B57', label: 'Bottle green', icon: 'hca' },
  'Nurse Students': { color: '#7C3AED', label: 'Purple', icon: 'student' },
  Cleaners: { color: '#800000', label: 'Maroon', icon: 'cleaner' },
  Porters: { color: '#7DD3FC', label: 'Light blue', icon: 'porter' },
  Visitors: { color: '#EC4899', label: 'Pink', icon: 'visitor' },
}

/** Hand Hygiene — Top Summary (group-wise) */
export const hhGroupSummary = [
  { group: 'Nurses', total: 45, moment1Comp: '88%', moment1Non: '8%', nonOpp: '4%' },
  { group: 'Doctors', total: 32, moment1Comp: '72%', moment1Non: '18%', nonOpp: '10%' },
  { group: 'HCAs', total: 28, moment1Comp: '84%', moment1Non: '10%', nonOpp: '6%' },
  { group: 'Nurse Students', total: 12, moment1Comp: '80%', moment1Non: '12%', nonOpp: '8%' },
  { group: 'Cleaners', total: 20, moment1Comp: '90%', moment1Non: '6%', nonOpp: '4%' },
  { group: 'Porters', total: 10, moment1Comp: '70%', moment1Non: '20%', nonOpp: '10%' },
  { group: 'Visitors', total: 15, moment1Comp: '76%', moment1Non: '14%', nonOpp: '10%' },
]

/** Observation by Location (PZ / Bay) */
export const hhLocationObs = [
  { location: 'Bay A SPZ001', moment1Comp: 12, moment1Non: 4, nonOpp: 2, failure: 'Touched Before' },
  { location: 'Bay B SPZ007', moment1Comp: 8, moment1Non: 6, nonOpp: 1, failure: 'Dose 0/1' },
  { location: 'Bay C SPZ013', moment1Comp: 10, moment1Non: 3, nonOpp: 2, failure: 'Time <20s' },
  { location: 'Bay D SPZ019', moment1Comp: 9, moment1Non: 5, nonOpp: 1, failure: 'Touched Before' },
]

/** Quality Criteria — Dose, Coverage, Contact Time, Patient Touch */
export const hhQualityCriteria = [
  { group: 'Nurses', dose: '2', doseOk: true, coverage: 'Yes', coverageOk: true, contact: '>20s', contactOk: true, touch: 'After', touchOk: true },
  { group: 'Doctors', dose: '1', doseOk: false, coverage: 'No', coverageOk: false, contact: '<20s', contactOk: false, touch: 'Before', touchOk: false },
  { group: 'HCAs', dose: '2', doseOk: true, coverage: 'Yes', coverageOk: true, contact: '>20s', contactOk: true, touch: 'After', touchOk: true },
  { group: 'Nurse Students', dose: '2', doseOk: true, coverage: 'Yes', coverageOk: true, contact: '>20s', contactOk: true, touch: 'After', touchOk: true },
  { group: 'Cleaners', dose: '0', doseOk: false, coverage: 'No', coverageOk: false, contact: '<20s', contactOk: false, touch: 'Before', touchOk: false },
  { group: 'Porters', dose: '1', doseOk: false, coverage: 'No', coverageOk: false, contact: '<20s', contactOk: false, touch: 'Before', touchOk: false },
  { group: 'Visitors', dose: '1', doseOk: false, coverage: 'No', coverageOk: false, contact: '<20s', contactOk: false, touch: 'Before', touchOk: false },
]

/** Dispenser Stats by location */
export const hhDispenserStats = [
  { location: 'Bay A SPZ001', totalDisp: 45, volumeMl: 90, price: '4.50' },
  { location: 'Bay B SPZ007', totalDisp: 32, volumeMl: 64, price: '3.20' },
  { location: 'Bay C SPZ013', totalDisp: 28, volumeMl: 56, price: '2.80' },
]

/** Gloves — Moment 2 & 3 */
export const hhGloves = [
  { group: 'Nurses', moment2: '92%', moment3: '88%', misuse: '8%' },
  { group: 'Doctors', moment2: '78%', moment3: '72%', misuse: '15%' },
  { group: 'HCAs', moment2: '86%', moment3: '82%', misuse: '10%' },
  { group: 'Nurse Students', moment2: '84%', moment3: '80%', misuse: '12%' },
]

/** Keep old export name for any leftover refs */
export const handHygieneGroups = hhGroupSummary.map((g) => ({
  group: g.group,
  color: hhGroupMeta[g.group]?.color || '#2563EB',
  total: g.total,
  compliant: parseInt(g.moment1Comp, 10),
  nonCompliant: parseInt(g.moment1Non, 10),
  noCompliance: parseInt(g.nonOpp, 10),
}))

/** Environmental — Shared Equipment */
export const envSharedEquipment = [
  { location: 'Bay A SPZ001', cleanEntry: true, preContact: true, postUse: true, exitDisinfect: true, residual: false, coach: 'Clean on entry and after use. Keep this sequence.' },
  { location: 'Bay B SPZ007', cleanEntry: true, preContact: false, postUse: true, exitDisinfect: true, residual: true, coach: 'Shared device is in the bay but not cleaned before patient contact — disinfect now.' },
  { location: 'Bay C SPZ013', cleanEntry: true, preContact: true, postUse: false, exitDisinfect: true, residual: false, coach: 'Used without a post-use wipe. Disinfect before the next patient.' },
]

/** High Touch Surfaces (schedule-based). residual = due soon, still time. */
export const envHighTouch = [
  { location: 'Bay A SPZ001', task: 'Bed Rails', schedule: '08:00', completed: '07:55', ok: true, residual: false, coach: 'On time — keep this window.' },
  { location: 'Bay B SPZ007', task: 'Call Buttons', schedule: '09:00', completed: '09:30', ok: false, residual: false, coach: 'Overdue. Wipe now and reset the bay schedule.' },
  { location: 'Bay C SPZ013', task: 'Light Switches', schedule: '16:00', completed: '—', ok: false, residual: true, coach: 'Due at 16:00 — wipe now before this goes overdue.' },
]

/** Medical Devices */
export const envMedicalDevices = [
  { location: 'Bay A SPZ001', device: 'Reusable Stethoscope', kind: 'Reusable', preTouch: true, postTouch: true, disposal: null, residual: false, coach: 'Reusable kit wiped before and after contact.' },
  { location: 'Bay B SPZ007', device: 'Reusable BP cuff', kind: 'Reusable', preTouch: false, postTouch: false, disposal: null, residual: true, coach: 'Reusable item is in the zone — disinfect before it touches the patient.' },
  { location: 'Bay C SPZ013', device: 'Syringe', kind: 'Disposable', preTouch: null, postTouch: null, disposal: true, residual: false, coach: 'Disposable — single use, then clinical waste.' },
]

/** Quality Measure: Coverage × Sequence × Contact Time */
export const envQuality = [
  { location: 'Bay A SPZ001', wipes: '2', sequence: true, contact: '30s', ok: true, residual: false, coach: 'Right wipe count, right order, enough contact time.' },
  { location: 'Bay B SPZ007', wipes: '1', sequence: false, contact: '15s', ok: false, residual: false, coach: 'Need the right number of wipes, in order, with enough wet contact time.' },
  { location: 'Bay D SPZ019', wipes: '2', sequence: true, contact: 'in progress', ok: false, residual: true, coach: 'Wipes are on — wait the full contact time before the next touch.' },
]

export const surfaceCategories = [
  { label: 'Shared Equipment', value: 82, color: '#0B172A', icon: 'Stethoscope' },
  { label: 'High Touch Surfaces', value: 76, color: '#22C55E', icon: 'Hand' },
  { label: 'Medical Devices', value: 88, color: '#7C3AED', icon: 'Monitor' },
  { label: 'Pre-touch Surfaces', value: 74, color: '#EAB308', icon: 'Layers' },
  { label: 'Post-touch Surfaces', value: 70, color: '#F97316', icon: 'Sparkles' },
]

export const zoneCompliance = [
  { zone: 'A', value: 85, color: '#22C55E' },
  { zone: 'B', value: 72, color: '#EAB308' },
  { zone: 'C', value: 80, color: '#3B82F6' },
  { zone: 'D', value: 68, color: '#EF4444' },
  { zone: 'E', value: 90, color: '#22C55E' },
]

export const careBundles = [
  { id: 'A', value: 94, color: '#22C55E' },
  { id: 'B', value: 88, color: '#EAB308' },
  { id: 'C', value: 90, color: '#F97316' },
  { id: 'D', value: 86, color: '#EF4444' },
]

export const wardCompliance = [
  { name: 'ICU', value: 96, color: '#22C55E', icon: 'Monitor' },
  { name: 'Ward A', value: 88, color: '#EAB308', icon: 'BedDouble' },
  { name: 'Ward B', value: 82, color: '#F97316', icon: 'BedDouble' },
  { name: 'Cardiac', value: 94, color: '#22C55E', icon: 'Heart' },
]

export const safetyEvents = [
  { label: 'Falls', count: 2, color: '#EF4444', icon: 'PersonStanding' },
  { label: 'Medication', count: 1, color: '#F97316', icon: 'Pill' },
  { label: 'Infection', count: 0, color: '#22C55E', icon: 'Bug' },
  { label: 'Other', count: 0, color: '#94A3B8', icon: 'MoreHorizontal' },
]

export const safetyAlerts = [
  { title: 'Fall risk', detail: '2 patients identified', time: 'Just now', type: 'warning' },
  { title: 'Low compliance', detail: 'Ward B below 80%', time: '10 min ago', type: 'caution' },
  { title: 'Safety audit due', detail: 'Next week', time: '1 hour ago', type: 'info' },
]

export const reportEvents = [
  { id: 'PZ01-E-1', timestamp: '10:24:15', location: 'ICU-R3', role: 'Doctor', roleColor: '#ffffff', compliant: false },
  { id: 'PZ01-E-2', timestamp: '10:18:02', location: 'Ward-7B', role: 'Nurse', roleColor: '#1A73E8', compliant: true },
  { id: 'PZ01-E-3', timestamp: '10:12:44', location: 'OT-2', role: 'HCA', roleColor: '#22C55E', compliant: false },
  { id: 'PZ01-E-4', timestamp: '09:58:11', location: 'ICU-R1', role: 'Doctor', roleColor: '#ffffff', compliant: true },
  { id: 'PZ01-E-5', timestamp: '09:45:33', location: 'Ward-5A', role: 'Nurse', roleColor: '#1A73E8', compliant: true },
]

export const alerts = [
  {
    id: 1,
    severity: 'critical',
    title: 'Missed Hand Hygiene — ICU Room 3',
    detail: 'Dr. Ahmed — 10:24 AM',
    status: 'Unresolved • Critical',
  },
  {
    id: 2,
    severity: 'warning',
    title: 'Low Liquid — SPZ02',
    detail: 'Refill needed — 20% remaining',
    status: 'In Progress • Warning',
  },
  {
    id: 3,
    severity: 'info',
    title: 'Offline Unit — CAM-05',
    detail: 'Device disconnected — 5 min ago',
    status: 'Unresolved • Info',
  },
]

export const devices = [
  { id: 'CAM-01', status: 'Active', location: 'ICU-R3', compliance: 86 },
  { id: 'CAM-02', status: 'Active', location: 'Ward-7B', compliance: 92 },
  { id: 'CAM-03', status: 'Offline', location: 'OT-2', compliance: null },
  { id: 'CAM-04', status: 'Active', location: 'ICU-R1', compliance: 78 },
  { id: 'CAM-05', status: 'Active', location: 'Ward-5A', compliance: 88 },
]

export const users = [
  { name: 'Dr. Ahmed', role: 'Admin', status: 'Active', lastActive: 'Today 10:24 AM' },
  { name: 'Nurse Khan', role: 'Manager', status: 'Active', lastActive: 'Today 09:15 AM' },
  { name: 'Dr. Ali', role: 'Viewer', status: 'Inactive', lastActive: 'Yesterday' },
  { name: 'Nurse Lee', role: 'Staff', status: 'Active', lastActive: 'Today 11:02 AM' },
  { name: 'Dr. Smith', role: 'Staff', status: 'Active', lastActive: '2 days ago' },
]

/** Heatmap: 4 bays x 6 beds. vulnerability + residual risk colors */
const vulnColors = ['#ffffff', '#FACC15', '#F97316', '#EF4444', '#9F1239']
const residualColors = ['#22C55E', '#EAB308', '#EF4444']

function pick(arr, i) {
  return arr[i % arr.length]
}

/**
 * Special beds (Stephen + mockup):
 * - SPZ-002: isolation solid red (Known/Suspected Infection)
 * - SPZ-007: bold red dashed (High Risk Residual)
 * - SPZ-001: residual risk active
 */
export const heatmapBays = ['A', 'B', 'C', 'D'].map((bay, bayIdx) => {
  const start = bayIdx * 6 + 1
  return {
    label: `BAY ${bay}`,
    range: `SPZ${start}–SPZ${start + 5}`,
    beds: Array.from({ length: 6 }, (_, i) => {
      const num = start + i
      const id = `SPZ-${String(num).padStart(3, '0')}`
      const isolation = id === 'SPZ-002'
      const highRiskResidual = id === 'SPZ-007'
      const residualActive = id === 'SPZ-001'

      let vulnerability = pick(vulnColors, bayIdx + i)
      let vulnLabel = ['Standard', 'Increased', 'High', 'Infection', 'Alert Org.'][
        (bayIdx + i) % 5
      ]
      let residual = pick(residualColors, bayIdx * 2 + i)
      let residualLabel = residual === '#22C55E' ? 'Compliant' : residual === '#EAB308' ? 'Warning' : 'Non-Compliant'
      let residualScore = residual === '#22C55E' ? 0 : residual === '#EAB308' ? 3 : 8

      if (isolation) {
        vulnerability = '#EF4444'
        vulnLabel = 'Infection'
        residual = '#EF4444'
        residualLabel = 'Non-Compliant'
        residualScore = 10
      }
      if (highRiskResidual) {
        residual = '#EF4444'
        residualLabel = 'Non-Compliant'
        residualScore = 11
        vulnLabel = 'High'
        vulnerability = '#F97316'
      }
      if (residualActive) {
        residual = '#EF4444'
        residualLabel = 'Non-Compliant'
        residualScore = 9
      }

      return {
        bed: `Bed ${i + 1}`,
        id,
        spzNum: num,
        vulnerability,
        vulnLabel,
        residual,
        residualLabel,
        residualScore,
        isolation,
        highRiskResidual,
        residualActive,
      }
    }),
  }
})

export const heatmapStats = {
  totalBeds: 24,
  compliantBeds: 19,
  compliantPct: '79.2%',
  warningZones: 3,
  warningPct: '12.5%',
  highRiskBeds: 2,
  highRiskPct: '8.3%',
}

export const heatmapResidualDonut = [
  { name: 'Low', value: 19, color: '#22C55E' },
  { name: 'Medium', value: 3, color: '#EAB308' },
  { name: 'High', value: 2, color: '#EF4444' },
]

export const heatmapIsolationList = [
  { id: 'SPZ-002', reason: 'Known Infection', type: 'isolation' },
  { id: 'SPZ-007', reason: 'High Residual Risk', type: 'high' },
]

export const heatmapCleaning = [
  { task: 'Morning Clean', pct: 96, trend: 'up' },
  { task: 'Terminal Clean', pct: 88, trend: 'flat' },
  { task: 'Disinfection', pct: 91, trend: 'up' },
]

export const heatmapBayCompliance = [
  { bay: 'Bay A', pct: 92, color: '#22C55E' },
  { bay: 'Bay B', pct: 74, color: '#F97316' },
  { bay: 'Bay C', pct: 88, color: '#22C55E' },
  { bay: 'Bay D', pct: 85, color: '#22C55E' },
]

export const heatmapAlerts = [
  { text: 'High residual risk detected — SPZ-007', time: '2 min ago', level: 'high' },
  { text: 'Isolation active — SPZ-002 Known Infection', time: '8 min ago', level: 'high' },
  { text: 'Residual risk active on SPZ-001', time: '15 min ago', level: 'warn' },
]

export const sparkline = {
  up: [40, 45, 42, 55, 60, 58, 70],
  down: [70, 65, 68, 55, 50, 48, 40],
  flat: [50, 52, 50, 51, 50, 52, 50],
}
