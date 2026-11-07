/** Frozen Moment 1 POC scripts — workbook order. */

export const POC_SCENARIOS = [
  {
    code: 'M1-01',
    script: 'Enter zone, touch patient, no hand hygiene',
    expected: 'NC',
    expectedLabel: 'Non-compliant',
    opportunity: true,
    failures: ['No hand hygiene'],
    bucket: 'directTouch',
    compliant: false,
  },
  {
    code: 'M1-02',
    script: 'Enter zone, do not touch patient, leave <20s',
    expected: 'Non-opp',
    expectedLabel: 'Not an opportunity',
    opportunity: false,
    failures: [],
    bucket: 'nonOpportunity',
    compliant: true,
  },
  {
    code: 'M1-03',
    script: 'Enter, 1 dispense, rub <20s, then touch',
    expected: 'NC',
    expectedLabel: 'Non-compliant',
    opportunity: true,
    failures: ['Ineffective dose', 'Ineffective coverage', 'Contact time <20s'],
    bucket: 'qualityStack',
    compliant: false,
  },
  {
    code: 'M1-04',
    script: 'Enter, 1 dispense, rub >20s, then touch',
    expected: 'NC',
    expectedLabel: 'Non-compliant',
    opportunity: true,
    failures: ['Ineffective dose'],
    bucket: 'ineffectiveDose',
    compliant: false,
  },
  {
    code: 'M1-05',
    script: 'Enter, 2 dispenses, rub <20s, then touch',
    expected: 'NC',
    expectedLabel: 'Non-compliant',
    opportunity: true,
    failures: ['Ineffective coverage', 'Contact time <20s'],
    bucket: 'contactTime',
    compliant: false,
  },
  {
    code: 'M1-06',
    script: 'Enter, 2 dispenses, rub >20s, then touch',
    expected: 'C',
    expectedLabel: 'Compliant Moment 1',
    opportunity: true,
    failures: [],
    bucket: 'compliant',
    compliant: true,
  },
]

export const NOT_RECOGNISED = {
  code: 'NR',
  script: 'Does not match M1-01 to M1-06',
  expected: 'Review',
  expectedLabel: 'Not recognised',
  opportunity: null,
  failures: ['Not recognised — ignore or missed?'],
  bucket: 'notRecognised',
  compliant: null,
}

export const POC_BY_CODE = Object.fromEntries(POC_SCENARIOS.map((s) => [s.code, s]))

export const M1_NC_CODES = ['M1-01', 'M1-03', 'M1-04', 'M1-05']

export function emptyPocCounts() {
  return Object.fromEntries([...POC_SCENARIOS.map((s) => [s.code, 0]), ['NR', 0]])
}

/** Count events in workbook order (plus NR). */
export function pocCounts(events) {
  const counts = emptyPocCounts()
  for (const e of events || []) {
    const code = e.code === 'NR' || e.bucket === 'notRecognised' ? 'NR' : e.code
    if (counts[code] != null) counts[code] += 1
    else counts.NR += 1
  }
  return counts
}
