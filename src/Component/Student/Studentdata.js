import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'

const ProfileIcon = () => (
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </>
)
const AttendanceIcon = () => (
  <>
    <path d="M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
    <rect x="5" y="6" width="14" height="15" rx="2" />
    <path d="M9 14l2 2 4-4" />
  </>
)

const cards = [
  {
    to: '/studentinfo',
    title: 'My Profile',
    text: 'View and edit your profile details.',
    action: 'Open profile',
    icon: <ProfileIcon />,
    badge: 'from-indigo-600 via-violet-600 to-fuchsia-600',
    glow: 'shadow-indigo-600/40',
  },
  {
    to: '/checkStudnetA',
    title: 'Your Attendance',
    text: 'Check the attendance of all students.',
    action: 'View attendance',
    icon: <AttendanceIcon />,
    badge: 'from-sky-500 via-indigo-500 to-violet-600',
    glow: 'shadow-sky-500/40',
  },
]

const Studentdata = () => {
  const { bgcolor } = useContext(AttendancenSApi)
  const isDark = bgcolor === 'dark'
  const navigate = useNavigate()

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const panel = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl hover:ring-indigo-400/40'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60 hover:ring-indigo-300'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const accent = isDark ? 'text-indigo-300' : 'text-indigo-600'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'

  return (
    <div className="relative isolate mx-auto max-w-4xl px-4 py-10">
      {/* soft colour glows behind the cards */}
      <div className={`pointer-events-none absolute -left-6 top-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>Dashboard</h1>
      <p className={`mt-1 text-sm ${muted}`}>Choose where you’d like to go.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {cards.map((c) => (
          <button
            key={c.to}
            type="button"
            onClick={() => navigate(c.to)}
            className={`group flex flex-col items-start rounded-3xl p-7 text-left outline-none transition duration-200 hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-indigo-500/40 ${panel}`}
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${c.badge} ${c.glow}`}
            >
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {c.icon}
              </svg>
            </span>

            <h2 className={`mt-6 text-xl font-semibold ${heading}`}>{c.title}</h2>
            <p className={`mt-1.5 text-sm ${muted}`}>{c.text}</p>

            <span className={`mt-6 inline-flex items-center gap-1.5 text-sm font-medium ${accent}`}>
              {c.action}
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Studentdata