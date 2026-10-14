import React, { useContext, useEffect, useState } from 'react'
import CheckTable from './CheckTable'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'
import { apiUrl } from '../../config'
const API = `${apiUrl}api`
const COLUMNS = ['SN#', 'Name', 'Roll No.', 'Course', 'Branch', 'Year', 'Date']

const SearchIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
)
const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" />
  </svg>
)
const AlertIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l10 18H2z" />
    <path d="M12 10v5M12 18h.01" />
  </svg>
)

const CheckAttendance = () => {
  const { bgcolor } = useContext(AttendancenSApi)
  const isDark = bgcolor === 'dark'

  const [mylist, setMyAlist] = useState([])
  const [info, setMyinfo] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  // One effect: get the logged-in student, then their attendance (runs once)
  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        const response = await fetch(`${API}/student/getstudent`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
          signal: controller.signal,
        })
        const student = await response.json()
        setMyinfo(student)

        if (!student.rollnumber) {
          setMyAlist([])
          return
        }

        const response2 = await fetch(`${API}/student/getstudentA/${student.rollnumber}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        })
        const json = await response2.json()
        setMyAlist(Array.isArray(json) ? json : [])
      } catch (err) {
        if (err.name === 'AbortError') return
        setError('Could not load attendance. Check that the server is running and try again.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  /* ---- search (client side, across every text/number value in a record) ---- */
  const q = query.trim().toLowerCase()
  const visible = q
    ? mylist.filter((s) =>
        Object.values(s)
          .filter((v) => typeof v === 'string' || typeof v === 'number')
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    : mylist
  const total = mylist.length

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const panel = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const accent = isDark ? 'text-indigo-300' : 'text-indigo-600'
  const danger = isDark ? 'text-red-400' : 'text-red-600'
  const ghost = isDark
    ? 'text-slate-200 ring-1 ring-white/15 hover:bg-slate-800'
    : 'text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'
  const searchBox = isDark
    ? 'bg-slate-900/70 text-slate-300 ring-1 ring-white/10 backdrop-blur-xl focus-within:ring-indigo-400'
    : 'bg-white text-slate-500 ring-1 ring-slate-300 focus-within:ring-indigo-500'
  const searchInput = isDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
  const thead = isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-500'
  const rowText = isDark ? 'text-slate-200' : 'text-slate-700'
  const rowLine = isDark ? 'border-white/5' : 'border-slate-100'
  const rowHover = isDark ? 'hover:bg-slate-800/60' : 'hover:bg-indigo-50/60'
  const skeleton = isDark ? 'bg-slate-700' : 'bg-slate-200'
  const countBadge = isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'

  const btn =
    'inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium outline-none transition ' +
    'focus-visible:ring-4 focus-visible:ring-indigo-500/40'

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 py-10">
      {/* soft colour glows behind the card */}
      <div className={`pointer-events-none absolute -left-6 top-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      {/* Title row */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>Attendance</h1>
            {!loading && !error && (
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${countBadge}`}>
                {q ? `${visible.length} of ${total}` : `${total} ${total === 1 ? 'record' : 'records'}`}
              </span>
            )}
          </div>
          <p className={`mt-1 text-sm ${muted}`} aria-live="polite">
            {loading
              ? 'Loading attendance…'
              : info.rollnumber
                ? `Attendance records for roll no. ${info.rollnumber}.`
                : 'Your attendance records appear here.'}
          </p>
        </div>

        <label className={`flex h-10 w-full items-center gap-2 rounded-2xl px-3.5 sm:w-72 ${searchBox}`}>
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search attendance"
            aria-label="Search attendance"
            className={`w-full bg-transparent text-sm outline-none ${searchInput}`}
          />
        </label>
      </div>

      {/* Table card */}
      <section className={`overflow-hidden rounded-3xl ${panel}`}>
        <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />
        <div className="max-h-[70vh] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[40rem] border-collapse text-left text-[0.925rem]">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    scope="col"
                    key={col}
                    className={`sticky top-0 z-10 whitespace-nowrap px-4 py-4 text-xs font-semibold tracking-wide ${thead}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading &&
                [0, 1, 2, 3, 4, 5].map((i) => (
                  <tr key={`sk-${i}`} aria-hidden="true">
                    <td colSpan={COLUMNS.length} className="px-4 py-3">
                      <div className={`h-5 animate-pulse rounded ${skeleton}`} />
                    </td>
                  </tr>
                ))}

              {!loading &&
                visible.map((students, index) => (
                  <tr
                    key={students._id || index}
                    className={`border-b transition last:border-0 ${rowText} ${rowLine} ${rowHover}
                                [&>*]:whitespace-nowrap [&>*]:px-4 [&>*]:py-3.5 [&>*]:align-middle
                                [&>*:nth-child(1)]:tabular-nums [&>*:nth-child(2)]:font-medium`}
                  >
                    <CheckTable students={students} index={index} />
                  </tr>
                ))}

              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length}>
                    <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
                      {error ? (
                        <AlertIcon className={`h-9 w-9 ${danger}`} />
                      ) : (
                        <CalendarIcon className={`h-9 w-9 ${accent}`} />
                      )}
                      <p className={`max-w-md text-sm ${muted}`}>
                        {error ||
                          (q
                            ? `No attendance records match “${query}”.`
                            : 'No attendance has been recorded yet.')}
                      </p>
                      {q && !error && (
                        <button type="button" onClick={() => setQuery('')} className={`${btn} mt-2 ${ghost}`}>
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default CheckAttendance