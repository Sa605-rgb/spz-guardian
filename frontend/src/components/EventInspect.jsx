import { ArrowUp, ChevronLeft, ChevronRight, ImageIcon, Trash2, X } from 'lucide-react'

/**
 * Row actions: jump to snapshots, browse images, delete event.
 */
export default function EventInspect({
  event,
  images = [],
  imageOpen,
  imageIndex,
  onOpenImages,
  onCloseImages,
  onPrev,
  onNext,
  onDelete,
  onGoUp,
}) {
  if (!event) return null
  const pic = images[imageIndex] || null

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onOpenImages}
          disabled={!images.length}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ImageIcon className="h-4 w-4 text-primary" />
          Images {images.length ? `(${images.length})` : ''}
        </button>
        <button
          type="button"
          onClick={onGoUp}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowUp className="h-4 w-4 text-primary" />
          Go up
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-danger hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Delete event
        </button>
      </div>

      {imageOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              type="button"
              onClick={onCloseImages}
              className="absolute -top-10 right-0 text-white hover:text-slate-200"
              aria-label="Close"
            >
              <X className="h-7 w-7" />
            </button>
            {pic ? (
              <img src={pic} alt="" className="max-h-[80vh] w-full rounded-lg object-contain bg-slate-900" />
            ) : (
              <p className="rounded-lg bg-white p-8 text-center text-slate-600">No image on this event.</p>
            )}
            {images.length > 1 ? (
              <div className="mt-3 flex items-center justify-center gap-4 text-white">
                <button type="button" onClick={onPrev} className="rounded-full bg-white/15 p-2 hover:bg-white/25">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <span className="text-sm tabular-nums">
                  {imageIndex + 1} / {images.length}
                </span>
                <button type="button" onClick={onNext} className="rounded-full bg-white/15 p-2 hover:bg-white/25">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
