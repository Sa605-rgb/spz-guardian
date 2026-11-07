import { classifySession, HH_GROUPS, sessionGroup } from './classifySession.js'

function pct(n, total) {
  if (!total) return '0%'
  return `${Math.round((n / total) * 100)}%`
}

/**
 * Build Hand Hygiene tables from live ward sessions (no dummy).
 */
export function hhTablesFromSessions(sessions) {
  const list = sessions || []
  const groupSummary = HH_GROUPS.map((group) => {
    const rows = list.filter((s) => sessionGroup(s) === group)
    let moment1Comp = 0
    let moment1Non = 0
    let nonOpp = 0
    let notRec = 0
    for (const s of rows) {
      const { code } = classifySession(s)
      if (code === 'M1-06') moment1Comp += 1
      else if (code === 'M1-02') nonOpp += 1
      else if (code === 'NR') notRec += 1
      else moment1Non += 1
    }
    const total = rows.length
    return {
      group,
      total,
      moment1Comp: total ? `${moment1Comp} (${pct(moment1Comp, total)})` : '0',
      moment1Non: total ? `${moment1Non} (${pct(moment1Non, total)})` : '0',
      nonOpp: total ? `${nonOpp} (${pct(nonOpp, total)})` : '0',
      notRec: total ? `${notRec} (${pct(notRec, total)})` : '0',
    }
  })

  const locMap = new Map()
  for (const s of list) {
    const location = s.location || 'Patient Zone'
    if (!locMap.has(location)) {
      locMap.set(location, { location, moment1Comp: 0, moment1Non: 0, nonOpp: 0, notRec: 0, failure: '—' })
    }
    const row = locMap.get(location)
    const { code, label } = classifySession(s)
    if (code === 'M1-06') row.moment1Comp += 1
    else if (code === 'M1-02') row.nonOpp += 1
    else if (code === 'NR') {
      row.notRec += 1
      row.failure = label
    } else {
      row.moment1Non += 1
      row.failure = label
    }
  }
  const locationObs = [...locMap.values()]

  const qualityCriteria = HH_GROUPS.map((group) => {
    const rows = list.filter((s) => sessionGroup(s) === group)
    let doseFail = 0
    let coverFail = 0
    let timeFail = 0
    let touchFail = 0
    let doseOk = 0
    for (const s of rows) {
      const { code } = classifySession(s)
      if (code === 'M1-01') touchFail += 1
      else if (code === 'M1-03') {
        doseFail += 1
        coverFail += 1
        timeFail += 1
      } else if (code === 'M1-04') doseFail += 1
      else if (code === 'M1-05') {
        coverFail += 1
        timeFail += 1
      } else if (code === 'M1-06') doseOk += 1
    }
    return {
      group,
      dose: doseFail ? 'Fail' : doseOk ? 'OK' : '—',
      doseOk: !doseFail && doseOk > 0,
      coverage: coverFail ? 'No' : doseOk ? 'Yes' : '—',
      coverageOk: !coverFail && doseOk > 0,
      contact: timeFail ? '<20s' : doseOk ? '>20s' : '—',
      contactOk: !timeFail && doseOk > 0,
      touch: touchFail ? 'Before' : doseOk ? 'After' : '—',
      touchOk: !touchFail && doseOk > 0,
    }
  })

  const dispMap = new Map()
  for (const s of list) {
    const n = Number(s.interaction_count)
    if (!Number.isFinite(n) || n <= 0) continue
    const location = s.location || 'Patient Zone'
    if (!dispMap.has(location)) dispMap.set(location, { location, totalDisp: 0, volumeMl: '—', price: '—' })
    dispMap.get(location).totalDisp += n
  }
  const dispenserStats = [...dispMap.values()]

  return { groupSummary, locationObs, qualityCriteria, dispenserStats, gloves: [] }
}
