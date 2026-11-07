import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Star,
  ListChecks,
  CheckCircle2,
  XCircle,
  MinusCircle,
  HelpCircle,
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  Video,
  FileJson,
  BarChart3,
  ClipboardList,
} from 'lucide-react'
import {
  buildEventMetadata,
  calcTestingStats,
  eventCodes,
} from '../data/dummyData'
import { useDashboardEvents } from '../data/useDashboardEvents'
import { buildLiveMetadata, calcLiveStats, splitDateTime } from '../data/mapLiveSessions'
import { LIVE_VIDEO_URL } from '../data/liveConfig'
import { asset } from '../asset'
import GroupBadge from '../components/GroupBadge'
import StatusCircle from '../components/StatusCircle'
import EventInspect from '../components/EventInspect'
import PocSequence from '../components/PocSequence'

function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec || 0))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export default function TestingDashboard() {
  const { period } = useOutletContext()
  const videoRef = useRef(null)
  const playerRef = useRef(null)
  const { events: liveEvents, results, liveLoading, liveOk, updatedAt, removeEvent } =
    useDashboardEvents(period)

  const [showAll, setShowAll] = useState(false)
  const [selectedKey, setSelectedKey] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(45)
  const [imageOpen, setImageOpen] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [showLiveCam, setShowLiveCam] = useState(false)

  const isLive = liveOk
  const sourceEvents = liveEvents

  const filtered = useMemo(() => sourceEvents, [sourceEvents])
  const stats = useMemo(
    () => (isLive ? calcLiveStats(filtered) : calcTestingStats(filtered)),
    [filtered, isLive],
  )
  const visible = showAll ? filtered : filtered.slice(0, 5)

  const selected = useMemo(
    () => filtered.find((e) => e.key === selectedKey) || filtered[0] || sourceEvents[0],
    [filtered, selectedKey, sourceEvents]
  )
  const metadata = useMemo(
    () => (selected ? (isLive ? buildLiveMetadata(selected) : buildEventMetadata(selected)) : {}),
    [selected, isLive],
  )

  // Pick first row when data / period changes
  useEffect(() => {
    if (!filtered.length) return
    if (!filtered.some((e) => e.key === selectedKey)) {
      setSelectedKey(filtered[0].key)
      setShowAll(false)
      setPlaying(false)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [period, filtered, selectedKey])

  // Load new event → pause & reset video
  useEffect(() => {
    if (!selected?.key) return
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
    setPlaying(false)
    setCurrentTime(0)
  }, [selected?.key])

  function handlePlay() {
    const v = videoRef.current
    if (!v) return
    v.play()
    setPlaying(true)
  }

  function handlePause() {
    const v = videoRef.current
    if (!v) return
    v.pause()
    setPlaying(false)
  }

  function handleFullscreen() {
    const el = playerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else if (el.requestFullscreen) {
      el.requestFullscreen()
    }
  }

  function goUp() {
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selectEvent(e) {
    setSelectedKey(e.key)
    setImageIndex(0)
    setShowLiveCam(false)
    handlePause()
    goUp()
  }

  async function handleDelete() {
    if (!selected) return
    if (!window.confirm(`Delete this ${selected.code || selected.id} event?`)) return
    setImageOpen(false)
    await removeEvent(selected)
  }

  const selectedImages = selected?.images?.length
    ? selected.images
    : selected?.snapshot
      ? [selected.snapshot]
      : []

  const from = filtered.length === 0 ? 0 : 1
  const to = showAll ? filtered.length : Math.min(5, filtered.length)
  const liveFrame = results?.latest_snapshot || null
  const hasSnapshot = Boolean(selected?.snapshot || liveFrame)

  if (!selected) {
    return (
      <div>
        <h2 className="page-title font-bold">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          Testing Dashboard
          {isLive ? (
            <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-compliant">Live</span>
          ) : (
            <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              {liveLoading ? 'Connecting…' : 'Local demo'}
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="card p-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm font-medium text-slate-600">Total Events</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-compliant" />
            </div>
            <div>
              <div className="text-3xl font-bold text-compliant">0</div>
              <div className="text-sm font-medium text-slate-600">Moment 1 Compliant</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <div className="text-3xl font-bold text-danger">0</div>
              <div className="text-sm font-medium text-slate-600">Moment 1 Non-Comp.</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          {isLive ? (
            <>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Live ward camera
              </h3>
              <div className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video">
                <iframe
                  title="Live ward camera"
                  src={LIVE_VIDEO_URL}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="autoplay; camera"
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              No events in this browser. Camera tests show here when the badge says{' '}
              <span className="font-semibold text-compliant">Live</span> — not Local demo.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="page-title font-bold">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        Testing Dashboard
        {isLive ? (
          <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-compliant">Live</span>
        ) : (
          <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            {liveLoading ? 'Connecting…' : 'Local demo'}
          </span>
        )}
      </h2>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="card p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{stats.totalEvents}</div>
            <div className="text-sm font-medium text-slate-600">Total Events</div>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-compliant" />
          </div>
          <div>
            <div className="text-3xl font-bold text-compliant">{stats.moment1Compliant}</div>
            <div className="text-sm font-medium text-slate-600">Moment 1 Compliant</div>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <div className="text-3xl font-bold text-danger">{stats.moment1NonCompliant}</div>
            <div className="text-sm font-medium text-slate-600">Moment 1 Non-Comp.</div>
          </div>
        </div>
      </div>

      {/* Video + JSON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card p-4">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              {isLive && (showLiveCam || !selectedImages.length)
                ? 'Live ward camera'
                : selectedImages.length
                  ? 'Event Snapshot'
                  : 'Event Video'}
            </span>
            {isLive && selectedImages.length ? (
              <button
                type="button"
                onClick={() => setShowLiveCam((v) => !v)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {showLiveCam ? 'Show images' : 'Live camera'}
              </button>
            ) : null}
          </h3>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm mb-3">
            <div>
              <span className="text-slate-500 font-medium">Event:</span>{' '}
              <span className="font-bold text-primary">{selected.code || selected.id}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Location:</span>{' '}
              <span className="font-semibold text-slate-800">{selected.location}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Role:</span>{' '}
              <span className="inline-flex align-middle">
                <GroupBadge role={selected.role} compact />
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Scenario:</span>{' '}
              <span className="font-semibold text-slate-800">{selected.scenario}</span>
            </div>
          </div>

          <EventInspect
            event={selected}
            images={selectedImages}
            imageOpen={imageOpen}
            imageIndex={imageIndex}
            onOpenImages={() => {
              setImageIndex(0)
              setImageOpen(true)
            }}
            onCloseImages={() => setImageOpen(false)}
            onPrev={() => setImageIndex((i) => (i - 1 + selectedImages.length) % selectedImages.length)}
            onNext={() => setImageIndex((i) => (i + 1) % selectedImages.length)}
            onDelete={handleDelete}
            onGoUp={goUp}
          />

          <div
            ref={playerRef}
            className="relative rounded-lg overflow-hidden bg-slate-900 aspect-video group"
          >
            {isLive && (showLiveCam || !selectedImages.length) ? (
              <iframe
                title="Live ward camera"
                src={LIVE_VIDEO_URL}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; camera"
              />
            ) : selectedImages.length ? (
              <img
                src={selectedImages[imageIndex] || selected.snapshot || liveFrame}
                alt={`${selected.id} snapshot`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                key={`hospital-${selected.key}`}
                src={asset('videos/hospital-event.mp4?v=3')}
                className="absolute inset-0 w-full h-full object-cover"
                muted={muted}
                playsInline
                preload="auto"
                poster=""
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 45)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onClick={() => (playing ? handlePause() : handlePlay())}
              />
            )}

            <div className="absolute top-2 left-2 bg-black/65 text-white text-xs font-semibold px-2 py-1 rounded font-mono pointer-events-none">
              {selected.id} · Scenario {selected.scenario}
              {isLive ? ' · Live' : ''}
            </div>

            {!isLive && !hasSnapshot && (
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-2 text-white text-xs bg-gradient-to-t from-black/80 to-transparent">
              <button type="button" onClick={playing ? handlePause : handlePlay} className="hover:text-primary">
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <span className="tabular-nums font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button type="button" onClick={() => setMuted((m) => !m)} className="hover:text-primary">
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button type="button" onClick={handleFullscreen} className="hover:text-primary" title="Full view">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            )}
          </div>

          {!isLive && !hasSnapshot && (
          <div className="flex items-center gap-4 mt-3">
            <button
              type="button"
              onClick={handlePlay}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                playing ? 'text-primary' : 'text-slate-700 hover:text-primary'
              }`}
            >
              <Play className="w-4 h-4" /> Play
            </button>
            <button
              type="button"
              onClick={handlePause}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                !playing ? 'text-primary' : 'text-slate-700 hover:text-primary'
              }`}
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
          </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <FileJson className="w-4 h-4 text-primary" />
            JSON Metadata
          </h3>
          <pre className="bg-[#0A1628] text-sm p-4 rounded-lg overflow-x-auto leading-relaxed font-mono min-h-[260px]">
            <span className="text-slate-400">{'{\n'}</span>
            <span className="text-sky-300">{'  "event"'}</span>
            <span className="text-slate-400">: </span>
            <span className="text-amber-300">{`"${metadata.event}"`}</span>
            <span className="text-slate-400">{',\n'}</span>
            <span className="text-sky-300">{'  "date"'}</span>
            <span className="text-slate-400">: </span>
            <span className="text-amber-300">{`"${metadata.date || ''}"`}</span>
            <span className="text-slate-400">{',\n'}</span>
            <span className="text-sky-300">{'  "time"'}</span>
            <span className="text-slate-400">: </span>
            <span className="text-amber-300">{`"${metadata.time || ''}"`}</span>
            <span className="text-slate-400">{',\n'}</span>
            <span className="text-sky-300">{'  "location"'}</span>
            <span className="text-slate-400">: </span>
            <span className="text-amber-300">{`"${metadata.location}"`}</span>
            <span className="text-slate-400">{',\n'}</span>
            <span className="text-sky-300">{'  "role"'}</span>
            <span className="text-slate-400">: </span>
            <span className="text-amber-300">{`"${metadata.role}"`}</span>
            <span className="text-slate-400">{',\n'}</span>
            <span className="text-sky-300">{'  "scenario"'}</span>
            <span className="text-slate-400">: </span>
            <span className="text-amber-300">{`"${metadata.scenario}"`}</span>
            <span className="text-slate-400">{',\n'}</span>
            <span className="text-sky-300">{'  "compliance"'}</span>
            <span className="text-slate-400">: </span>
            <span className="text-orange-400">{String(metadata.compliance)}</span>
            <span className="text-slate-400">{',\n'}</span>
            <span className="text-sky-300">{'  "event_code"'}</span>
            <span className="text-slate-400">: </span>
            <span className="text-amber-300">{`"${metadata.event_code}"`}</span>
            {metadata.reason != null && (
              <>
                <span className="text-slate-400">{',\n'}</span>
                <span className="text-sky-300">{'  "reason"'}</span>
                <span className="text-slate-400">: </span>
                <span className="text-amber-300">{`"${metadata.reason}"`}</span>
              </>
            )}
            {metadata.failures != null && (
              <>
                <span className="text-slate-400">{',\n'}</span>
                <span className="text-sky-300">{'  "failures"'}</span>
                <span className="text-slate-400">: </span>
                <span className="text-amber-300">{`"${(metadata.failures || []).join('; ')}"`}</span>
              </>
            )}
            {metadata.started_at != null && (
              <>
                <span className="text-slate-400">{',\n'}</span>
                <span className="text-sky-300">{'  "started_at"'}</span>
                <span className="text-slate-400">: </span>
                <span className="text-amber-300">{`"${metadata.started_at}"`}</span>
              </>
            )}
            <span className="text-slate-400">{'\n}'}</span>
          </pre>
        </div>
      </div>

      {/* Moment 1 Reports */}
      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Moment 1 Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-green-100 bg-green-50/50 p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-compliant" />
            <div>
              <div className="text-2xl font-bold text-compliant">{stats.moment1Compliant}</div>
              <div className="text-sm font-medium text-slate-600">Moment 1 Compliant</div>
            </div>
          </div>
          <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-danger" />
            <div>
              <div className="text-2xl font-bold text-danger">{stats.moment1NonCompliant}</div>
              <div className="text-sm font-medium text-slate-600">Moment 1 Non-Comp.</div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-3">
            <MinusCircle className="w-5 h-5 text-slate-500" />
            <div>
              <div className="text-2xl font-bold text-slate-700">{stats.nonOpportunity}</div>
              <div className="text-sm font-medium text-slate-600">Non-Opportunity</div>
              <div className="text-[11px] text-compliant font-semibold">(Always Compliant)</div>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-amber-700" />
          <div>
            <div className="text-2xl font-bold text-amber-800">{stats.notRecognised || 0}</div>
            <div className="text-sm font-medium text-amber-900">Not recognised</div>
            <div className="text-[11px] text-amber-800">Does not match M1-01 to M1-06 — ignore or missed</div>
          </div>
        </div>
      </div>

      <PocSequence events={filtered} title="POC workbook sequence — M1-01 to M1-06" />

      {/* Event Logs */}
      <div className="card p-4">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" />
          Event Logs
        </h3>
        <p className="text-xs font-medium text-slate-500 mb-3">
          Click a row for Images / Delete / Go up · Period:{' '}
          <span className="text-primary">{period}</span>
          {isLive ? (
            <span className="text-compliant"> · Live ward feed</span>
          ) : (
            <span className="text-slate-400"> · Local demo data</span>
          )}
          {updatedAt ? (
            <span className="text-slate-400">
              {' '}
              · Updated {new Date(updatedAt).toLocaleTimeString()}
            </span>
          ) : null}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Event ID</th>
                <th className="px-3 py-2.5 font-semibold">Date</th>
                <th className="px-3 py-2.5 font-semibold">Time</th>
                <th className="px-3 py-2.5 font-semibold">Location</th>
                <th className="px-3 py-2.5 font-semibold">Role</th>
                <th className="px-3 py-2.5 font-semibold">Scenario</th>
                <th className="px-3 py-2.5 font-semibold">Failure reason</th>
                <th className="px-3 py-2.5 font-semibold">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <Fragment key={e.key}>
                <tr
                  onClick={() => selectEvent(e)}
                  className={`border-b border-slate-100 cursor-pointer transition ${
                    selectedKey === e.key ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <td
                    className="px-3 py-3 font-mono font-bold text-primary"
                    title={eventCodes[e.id]}
                  >
                    {e.code || e.id}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap tabular-nums">
                    {(e.date || splitDateTime(e.started_at || e.timestamp).date)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap tabular-nums">
                    {(e.time || splitDateTime(e.started_at || e.timestamp).time)}
                  </td>
                  <td className="px-3 py-3 font-medium whitespace-nowrap">{e.location}</td>
                  <td className="px-3 py-3">
                    <GroupBadge role={e.role} compact />
                  </td>
                  <td className="px-3 py-3 font-semibold font-mono">{e.code || e.scenario}</td>
                  <td className="px-3 py-3 text-slate-700">{e.reason || '—'}</td>
                  <td className="px-3 py-3">
                    <StatusCircle
                      ok={e.compliant}
                      residual={['M1-03', 'M1-04', 'M1-05'].includes(e.code)}
                      unknown={e.code === 'NR' || e.bucket === 'notRecognised'}
                      neutral={e.code === 'M1-02' || e.bucket === 'nonOpportunity'}
                    />
                  </td>
                </tr>
                {selectedKey === e.key ? (
                  <tr key={`${e.key}-actions`} className="bg-blue-50/70">
                    <td colSpan={8} className="px-3 pt-1 pb-3">
                      <EventInspect
                        event={e}
                        images={selectedImages}
                        imageOpen={false}
                        imageIndex={imageIndex}
                        onOpenImages={() => {
                          setImageIndex(0)
                          setImageOpen(true)
                          goUp()
                        }}
                        onCloseImages={() => setImageOpen(false)}
                        onPrev={() => setImageIndex((i) => (i - 1 + selectedImages.length) % selectedImages.length)}
                        onNext={() => setImageIndex((i) => (i + 1) % selectedImages.length)}
                        onDelete={handleDelete}
                        onGoUp={goUp}
                      />
                    </td>
                  </tr>
                ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-600 transition shadow-sm"
          >
            {showAll ? 'Show Less' : 'Show All Events'}
          </button>
          <span className="text-sm font-medium text-slate-500">
            Showing {from} to {to} of {filtered.length} events
          </span>
        </div>
      </div>
    </div>
  )
}
