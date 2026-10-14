import React, { useContext, useEffect, useState } from 'react'
import AttendanceTable from './AttendanceTable'
import Filters from './Filters'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'

const API = 'http://localhost:5000/api/attendance'
const COLUMNS = ['SN#', 'Name', 'Roll No.', 'Course', 'Year', 'Branch', 'Date']

const Attendancelist = () => {
  const { bgcolor } = useContext(AttendancenSApi)
  const isDark = bgcolor === 'dark'

  const [attendancelist, setMyAlist] = useState([])
  const [dates, setMydates] = useState('')
  const [datas, setMydatas] = useState(null)
  const [showFilters, setShowFilters] = useState(false) // mobile only; always open on large screens
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // One effect picks the endpoint. A date and a course filter are mutually exclusive:
  // whichever the user picked last wins.
  useEffect(() => {
    const controller = new AbortController()

    let url = `${API}/attendancelist`
    if (dates) {
      url = `${API}/datelist/${dates}T00:00:00.000Z`
    } else if (datas) {
      url = `${API}/filterattendance/${datas.course}/${datas.year}/${datas.branch}`
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        })
        const json = await response.json()
        setMyAlist(Array.isArray(json) ? json : [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setMyAlist([])
          setError('Could not load attendance. Check that the server is running and try again.')
        }
        return
      }
      setLoading(false)
    }

    load()
    return () => controller.abort()
  }, [dates, datas])

  const handelchange = (e) => {
    setMydates(e.target.value)
    setMydatas(null)
  }

  const handelsubmit = (data) => {
    setMydatas(data)
    setMydates('')
    setShowFilters(false)
  }

  const clearAll = () => {
    setMydates('')
    setMydatas(null)
  }

  const hasActiveFilter = Boolean(dates || datas)
  const count = attendancelist.length

  const emptyMessage = dates
    ? 'No attendance was recorded for this date.'
    : datas
    ? 'No records match these filters.'
    : 'No attendance records yet.'

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const panel = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const accent = isDark ? 'text-indigo-300' : 'text-indigo-600'
  const danger = isDark ? 'text-red-400' : 'text-red-600'
  const gradient =
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
  const ghost = isDark
    ? 'text-slate-200 ring-1 ring-white/15 hover:bg-slate-800'
    : 'text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'
  const chip = isDark
    ? 'bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/30'
    : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
  const dateBox = isDark
    ? 'bg-slate-900/70 text-slate-300 ring-1 ring-white/10 backdrop-blur-xl'
    : 'bg-white text-slate-500 ring-1 ring-slate-300'
  const dateInput = isDark ? 'text-slate-100 [color-scheme:dark]' : 'text-slate-900 [color-scheme:light]'
  const thead = isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-500'
  const rowText = isDark ? 'text-slate-200' : 'text-slate-700'
  const rowLine = isDark ? 'border-white/5' : 'border-slate-100'
  const rowHover = isDark ? 'hover:bg-slate-800/60' : 'hover:bg-indigo-50/60'
  const skeleton = isDark ? 'bg-slate-700' : 'bg-slate-200'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'

  const btn =
    'inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-medium outline-none transition ' +
    'focus-visible:ring-4 focus-visible:ring-indigo-500/40'
  const chipClass = `rounded-full px-3 py-1 text-xs font-medium ${chip}`

  return (
    <div className="relative isolate mx-auto max-w-7xl px-4 py-10">
      {/* soft colour glows behind the cards */}
      <div className={`pointer-events-none absolute -left-6 top-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      {/* Title row */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>Attendance Records</h1>
          <p className={`mt-1 text-sm ${muted}`} aria-live="polite">
            {loading ? 'Loading records…' : `${count} ${count === 1 ? 'record' : 'records'} found`}
          </p>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label
            htmlFor="date"
            className={`flex h-10 flex-1 items-center gap-2 rounded-2xl px-3.5 sm:flex-none ${dateBox}`}
          >
            <i className="fa-regular fa-calendar" aria-hidden="true"></i>
            <input
              type="date"
              name="date"
              id="date"
              value={dates}
              onChange={handelchange}
              aria-label="Filter by date"
              className={`bg-transparent text-sm outline-none ${dateInput}`}
            />
          </label>

          {/* Mobile-only toggle for the filters */}
          <button
            type="button"
            className={`${btn} lg:hidden ${gradient} hover:brightness-110`}
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            aria-controls="filter-rail"
          >
            <i className="fa-solid fa-sliders" aria-hidden="true"></i>
            Filters
          </button>
        </div>
      </div>

      {/* Active filters */}
      {hasActiveFilter && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className={`text-sm ${muted}`}>Showing:</span>
          {dates && <span className={chipClass}>Date {dates}</span>}
          {datas?.year && <span className={chipClass}>{datas.year} year</span>}
          {datas?.course && <span className={chipClass}>{datas.course}</span>}
          {datas?.branch && <span className={chipClass}>{datas.branch}</span>}
          <button
            type="button"
            onClick={clearAll}
            className={`ml-1 text-sm font-medium underline underline-offset-2 hover:opacity-75 ${accent}`}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter rail + results */}
      <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside
          id="filter-rail"
          className={`${showFilters ? 'block' : 'hidden'} lg:sticky lg:top-4 lg:block`}
        >
          <Filters handelsubmit={handelsubmit} />
        </aside>

        <section className={`min-w-0 overflow-hidden rounded-3xl ${panel}`}>
          <div className="max-h-[75vh] overflow-auto">
            <table className="w-full border-collapse text-left text-[0.925rem]">
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
                        <div className={`h-4 animate-pulse rounded ${skeleton}`} />
                      </td>
                    </tr>
                  ))}

                {!loading &&
                  attendancelist.map((attend, index) => (
                    <tr
                      key={index}
                      className={`border-b transition last:border-0 ${rowText} ${rowLine} ${rowHover}
                                  [&>*]:whitespace-nowrap [&>*]:px-4 [&>*]:py-3.5 [&>*]:align-middle
                                  [&>*:first-child]:w-16 [&>*:nth-child(2)]:font-medium
                                  [&>*:nth-child(3)]:tabular-nums [&>*:last-child]:tabular-nums`}
                    >
                      <AttendanceTable attend={attend} index={index} />
                    </tr>
                  ))}

                {!loading && count === 0 && (
                  <tr>
                    <td colSpan={COLUMNS.length}>
                      <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
                        <i
                          className={`text-3xl ${
                            error
                              ? `fa-solid fa-triangle-exclamation ${danger}`
                              : `fa-regular fa-calendar-xmark ${accent}`
                          }`}
                          aria-hidden="true"
                        ></i>
                        <p className={`max-w-md text-sm ${muted}`}>{error || emptyMessage}</p>
                        {hasActiveFilter && !error && (
                          <button type="button" onClick={clearAll} className={`${btn} mt-2 ${ghost}`}>
                            Show all records
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
    </div>
  )
}

export default Attendancelist