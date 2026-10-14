import React, { useContext, useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { useNavigate } from 'react-router-dom'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'
import { apiUrl } from '../../config'
const API = `${apiUrl}api`

const Svg = ({ children, className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)
const CameraIcon = ({ className }) => (
  <Svg className={className}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>
)
const StopIcon = () => (
  <Svg>
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </Svg>
)
const CheckIcon = ({ className }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.7 2.7L16 9.8" />
  </Svg>
)
const AlertIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16h.01" />
  </Svg>
)
const BackIcon = () => (
  <Svg>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
)

const Camera = () => {
  const { bgcolor } = useContext(AttendancenSApi)
  const isDark = bgcolor === 'dark'
  const navigate = useNavigate()

  const videoRef = useRef(null)
  const streamRef = useRef(null) // the camera stream, owned by this component
  const scanTimerRef = useRef(null) // the frame-scanning interval
  const handledRef = useRef(false) // blocks repeat scans of the same code
  const timerRef = useRef(null)

  const [scanning, setScanning] = useState(true) // camera on/off
  const [status, setStatus] = useState('scanning') // scanning | processing | success | error
  const [message, setMessage] = useState('')
  const [marked, setMarked] = useState(null)

  /* Stops the scan loop and every camera track. We keep a reference to the stream itself,
     so this works even if the <video> element is already gone. */
  const releaseCamera = () => {
    clearInterval(scanTimerRef.current)
    scanTimerRef.current = null
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    const video = videoRef.current
    if (video) {
      video.pause()
      video.srcObject = null
    }
  }

  // start the camera whenever `scanning` is true, release it when it turns false or the page closes
  useEffect(() => {
    if (!scanning) return undefined
    let cancelled = false

    const start = async () => {
      try {
        releaseCamera() // never keep two streams open
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (cancelled) {
          // the page closed (or React re-ran this effect) while the camera was starting
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream

        const video = videoRef.current
        video.srcObject = stream
        await video.play()
        if (cancelled) return

        // read a frame a few times a second and look for a QR code in it
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        scanTimerRef.current = setInterval(() => {
          if (!video.videoWidth || video.readyState < 2) return
          const scale = Math.min(1, 640 / video.videoWidth)
          canvas.width = Math.round(video.videoWidth * scale)
          canvas.height = Math.round(video.videoHeight * scale)
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(frame.data, frame.width, frame.height, { inversionAttempts: 'dontInvert' })
          if (code && code.data) handleResult(code.data)
        }, 250)
      } catch (err) {
        if (cancelled) return
        releaseCamera()
        setScanning(false)
        setMessage(
          err && err.name === 'NotAllowedError'
            ? 'Camera access is blocked. Allow the camera for this site, then start the scanner.'
            : 'Could not start the camera. Make sure no other app or tab is using it.'
        )
        setStatus('error')
      }
    }
    start()

    window.addEventListener('pagehide', releaseCamera)
    return () => {
      cancelled = true
      window.removeEventListener('pagehide', releaseCamera)
      releaseCamera()
    }
    // eslint-disable-next-line
  }, [scanning])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const stopCamera = () => {
    releaseCamera()
    setScanning(false)
  }
  const startCamera = () => {
    handledRef.current = false
    setMessage('')
    setStatus('scanning')
    setScanning(true)
  }
  const scanAgain = () => {
    handledRef.current = false
    setMessage('')
    setStatus('scanning')
  }
  const goBack = () => {
    stopCamera()
    navigate('/')
  }

  const fail = (text) => {
    setMessage(text)
    setStatus('error')
  }

  const markAttendance = async (code) => {
    setStatus('processing')
    setMessage('')
    try {
      const found = await fetch(`${API}/student/findstudent/${encodeURIComponent(code)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const student = await found.json().catch(() => null)
      if (!found.ok || !student) return fail('No student found for this QR code.')

      localStorage.setItem('student', JSON.stringify(student))
      const date = new Date().toLocaleDateString()

      const added = await fetch(`${API}/attendance/addattendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: student.name,
          currentedu: student.currentedu,
          currentyear: student.currentyear,
          stdbranch: student.stdbranch,
          rollnumber: code,
          date,
        }),
      })
      if (!added.ok) {
        const body = await added.json().catch(() => ({}))
        return fail(body.error || body.message || 'Could not mark attendance. Try again.')
      }

      // success: turn the camera off, then go back
      stopCamera()
      setMarked({ name: student.name, rollnumber: code, date })
      setStatus('success')
      timerRef.current = setTimeout(() => navigate('/'), 1800)
    } catch (err) {
      fail('Could not reach the server. Check your connection and try again.')
    }
  }

  const handleResult = (text) => {
    const code = String(text || '').trim()
    if (!code || handledRef.current) return
    handledRef.current = true
    markAttendance(code)
  }

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const panel = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const ghost = isDark
    ? 'text-slate-200 ring-1 ring-white/15 hover:bg-slate-800'
    : 'text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'
  const stopBtn = isDark
    ? 'bg-red-500/15 text-red-300 ring-1 ring-red-400/30 hover:bg-red-500/25'
    : 'bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100'
  const gradient =
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 hover:brightness-110'
  const okBox = isDark ? 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30' : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
  const errBox = isDark ? 'bg-red-500/15 text-red-200 ring-1 ring-red-400/30' : 'bg-red-50 text-red-700 ring-1 ring-red-200'
  const offBox = isDark ? 'bg-slate-950/60 text-slate-400' : 'bg-slate-100 text-slate-500'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'

  const btn =
    'inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-medium outline-none transition ' +
    'focus-visible:ring-4 focus-visible:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60'

  const showSuccess = status === 'success'

  return (
    <div className="relative isolate mx-auto max-w-xl px-4 py-10">
      {/* soft colour glows behind the card */}
      <div className={`pointer-events-none absolute -left-6 top-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>Scan attendance</h1>
          <p className={`mt-1 text-sm ${muted}`}>Hold the student’s QR code in front of the camera.</p>
        </div>
        <button type="button" onClick={goBack} className={`${btn} h-10 shrink-0 px-4 ${ghost}`}>
          <BackIcon />
          Back
        </button>
      </div>

      <section className={`overflow-hidden rounded-3xl p-4 sm:p-5 ${panel}`}>
        {/* Camera area */}
        <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-slate-950">
          {scanning ? (
            <>
              <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />

              {/* viewfinder corners */}
              <div className="pointer-events-none absolute inset-8">
                <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-white/90" />
                <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-white/90" />
                <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-white/90" />
                <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-white/90" />
              </div>

              {status === 'processing' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/70 text-white backdrop-blur-sm">
                  <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/25 border-t-white" />
                  <p className="text-sm font-medium">Marking attendance…</p>
                </div>
              )}
            </>
          ) : (
            <div className={`flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center ${offBox}`}>
              {showSuccess ? (
                <>
                  <CheckIcon className="h-14 w-14 text-emerald-500" />
                  <p className={`text-lg font-semibold ${heading}`}>Camera turned off</p>
                </>
              ) : (
                <>
                  <CameraIcon className="h-12 w-12" />
                  <p className="text-sm font-medium">Camera is off</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mt-4" role="status" aria-live="polite">
          {showSuccess && marked && (
            <div className={`flex items-start gap-3 rounded-2xl p-4 ${okBox}`}>
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 text-sm">
                <p className="font-semibold">Attendance marked</p>
                <p className="mt-0.5 break-words">
                  {marked.name || 'Student'} (roll no. {marked.rollnumber}) on {marked.date}. Going back…
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className={`flex items-start gap-3 rounded-2xl p-4 ${errBox}`}>
              <span className="mt-0.5 shrink-0"><AlertIcon /></span>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {status === 'scanning' && scanning && (
            <p className={`flex items-center justify-center gap-2 text-sm ${muted}`}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Scanning for a QR code…
            </p>
          )}

          {status === 'scanning' && !scanning && (
            <p className={`text-center text-sm ${muted}`}>The camera is off. Start the scanner to mark attendance.</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {showSuccess ? (
            <button type="button" onClick={goBack} className={`${btn} sm:col-span-2 ${gradient}`}>
              Back now
            </button>
          ) : (
            <>
              {scanning ? (
                <button type="button" onClick={stopCamera} className={`${btn} ${stopBtn}`}>
                  <StopIcon />
                  Turn off scanner
                </button>
              ) : (
                <button type="button" onClick={startCamera} className={`${btn} ${gradient}`}>
                  <CameraIcon className="h-5 w-5" />
                  Start scanner
                </button>
              )}

              {status === 'error' && scanning ? (
                <button type="button" onClick={scanAgain} className={`${btn} ${gradient}`}>
                  Scan again
                </button>
              ) : (
                <button type="button" onClick={goBack} className={`${btn} ${ghost}`}>
                  Back to dashboard
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Camera