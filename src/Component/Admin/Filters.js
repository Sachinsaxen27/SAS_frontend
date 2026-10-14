import React, { useContext, useState } from 'react'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'

const EMPTY = { year: '', branch: '', course: '' }

const YEARS = ['1st', '2nd', '3rd', '4th']

const COURSES = [
  { value: 'Polytechnic', label: 'Polytechnic', icon: 'fa-screwdriver-wrench' },
  { value: 'Btech', label: 'B.Tech', icon: 'fa-graduation-cap' },
  { value: 'MBA', label: 'MBA', icon: 'fa-briefcase' },
]

const BRANCHES = [
  { value: 'CSE', label: 'Computer Science', code: 'CSE', icon: 'fa-laptop-code' },
  { value: 'EC', label: 'Electronics & Comm.', code: 'EC', icon: 'fa-tower-broadcast' },
  { value: 'ME', label: 'Mechanical', code: 'ME', icon: 'fa-gears' },
  { value: 'CE', label: 'Civil', code: 'CE', icon: 'fa-building' },
  { value: 'HR', label: 'Human Resources', code: 'HR', icon: 'fa-users' },
  { value: 'Finance', label: 'Finance', code: 'Fin', icon: 'fa-chart-line' },
]

const focusRing = 'peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-500/40'

const GroupTitle = ({ ui, title, done }) => (
  <div className="mb-2.5 flex items-center justify-between">
    <h4 className={`text-sm font-semibold ${ui.heading}`}>{title}</h4>
    {done && <i className={`fa-solid fa-circle-check text-sm ${ui.ok}`} aria-label="chosen"></i>}
  </div>
)

/* One selectable row (course / branch) */
const Row = ({ ui, name, option, checked, onChange }) => (
  <label className="relative block cursor-pointer">
    <input type="radio" name={name} value={option.value} checked={checked} onChange={onChange} className="peer sr-only" />
    <div
      className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${focusRing} ${
        checked ? ui.active : `${ui.idle} ${ui.idleRing}`
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm ${
          checked ? 'bg-white/20 text-white' : ui.iconIdle
        }`}
      >
        <i className={`fa-solid ${option.icon}`} aria-hidden="true"></i>
      </span>
      <span className="min-w-0 flex-1 truncate">{option.label}</span>
      {option.code && (
        <span className={`text-xs font-medium ${checked ? 'text-indigo-100' : ui.muted}`}>{option.code}</span>
      )}
      {checked && <i className="fa-solid fa-circle-check text-sm" aria-hidden="true"></i>}
    </div>
  </label>
)

const Filters = ({ handelsubmit }) => {
  const { bgcolor } = useContext(AttendancenSApi)
  const isDark = bgcolor === 'dark'

  const [cred, setMycred] = useState(EMPTY)

  const handleChange = (e) => {
    setMycred({ ...cred, [e.target.name]: e.target.value })
  }

  const steps = [cred.year, cred.course, cred.branch]
  const doneCount = steps.filter(Boolean).length
  // The backend route needs year, course and branch together
  const isComplete = doneCount === 3

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isComplete) return
    handelsubmit(cred)
  }

  const handelreset = (e) => {
    e.preventDefault()
    setMycred(EMPTY)
    handelsubmit(null) // null = show all records
  }

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const ui = {
    panel: isDark
      ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
      : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60',
    heading: isDark ? 'text-white' : 'text-slate-900',
    muted: isDark ? 'text-slate-400' : 'text-slate-500',
    ok: isDark ? 'text-emerald-400' : 'text-emerald-600',
    idle: isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100',
    idleRing: isDark ? 'ring-1 ring-white/10' : 'ring-1 ring-slate-200',
    iconIdle: isDark ? 'bg-slate-800 text-indigo-300' : 'bg-indigo-50 text-indigo-600',
    active:
      'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30',
    barOff: isDark ? 'bg-slate-700' : 'bg-slate-200',
    divider: isDark ? 'border-white/10' : 'border-slate-200',
    ghost: isDark
      ? 'text-slate-200 ring-1 ring-white/15 hover:bg-slate-800'
      : 'text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100',
    disabled: isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400',
  }

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handelreset}
      className={`space-y-6 rounded-3xl p-5 ${ui.panel}`}
    >
      {/* Header + progress */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${ui.heading}`}>Filters</h3>
          <span className={`text-xs font-medium ${ui.muted}`} aria-live="polite">
            {doneCount} of 3 chosen
          </span>
        </div>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {steps.map((s, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : ui.barOff
              }`}
            />
          ))}
        </div>
      </div>

      {/* Year */}
      <fieldset>
        <legend className="sr-only">Year</legend>
        <GroupTitle ui={ui} title="Year" done={Boolean(cred.year)} />
        <div className="grid grid-cols-4 gap-1.5">
          {YEARS.map((y) => (
            <label key={y} className="relative block cursor-pointer">
              <input
                type="radio"
                name="year"
                value={y}
                checked={cred.year === y}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div
                className={`rounded-2xl py-2.5 text-center text-sm font-semibold transition ${focusRing} ${
                  cred.year === y ? ui.active : `${ui.idle} ${ui.idleRing}`
                }`}
              >
                {y}
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Course */}
      <fieldset>
        <legend className="sr-only">Course</legend>
        <GroupTitle ui={ui} title="Course" done={Boolean(cred.course)} />
        <div className="space-y-1.5">
          {COURSES.map((o) => (
            <Row key={o.value} ui={ui} name="course" option={o} checked={cred.course === o.value} onChange={handleChange} />
          ))}
        </div>
      </fieldset>

      {/* Branch */}
      <fieldset>
        <legend className="sr-only">Branch</legend>
        <GroupTitle ui={ui} title="Branch" done={Boolean(cred.branch)} />
        <div className="space-y-1.5">
          {BRANCHES.map((o) => (
            <Row key={o.value} ui={ui} name="branch" option={o} checked={cred.branch === o.value} onChange={handleChange} />
          ))}
        </div>
      </fieldset>

      {/* Actions */}
      <div className={`border-t pt-5 ${ui.divider}`}>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="reset"
            className={`h-11 rounded-2xl text-sm font-medium outline-none transition focus-visible:ring-4 focus-visible:ring-indigo-500/40 ${ui.ghost}`}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!isComplete}
            className={`h-11 rounded-2xl text-sm font-medium outline-none transition focus-visible:ring-4 focus-visible:ring-indigo-500/40 ${
              isComplete ? `${ui.active} hover:brightness-110` : `${ui.disabled} cursor-not-allowed`
            }`}
          >
            Apply
          </button>
        </div>
        {!isComplete && (
          <p className={`mt-3 text-center text-xs ${ui.muted}`}>Choose a year, course and branch to apply.</p>
        )}
      </div>
    </form>
  )
}

export default Filters