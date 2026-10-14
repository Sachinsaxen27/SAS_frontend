import React, { useContext } from 'react'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'

const DegreeIcon = () => (
  <>
    <path d="M2 9l10-5 10 5-10 5z" />
    <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
  </>
)
const BranchIcon = () => (
  <>
    <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
    <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
  </>
)
const YearIcon = () => (
  <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </>
)

const Studenedu = ({ info = {} }) => {
  const { bgcolor } = useContext(AttendancenSApi)
  const isDark = bgcolor === 'dark'

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const tile = isDark
    ? 'bg-slate-950/40 ring-1 ring-white/10'
    : 'bg-slate-50 ring-1 ring-slate-200'

  const fields = [
    {
      label: 'Degree',
      value: info.currentedu || '—',
      icon: <DegreeIcon />,
      badge: isDark ? 'bg-indigo-500/15' : 'bg-indigo-100',
      tint: isDark ? 'text-indigo-300' : 'text-indigo-600',
      wide: true,
    },
    {
      label: 'Branch',
      value: info.stdbranch || '—',
      icon: <BranchIcon />,
      badge: isDark ? 'bg-emerald-500/15' : 'bg-emerald-100',
      tint: isDark ? 'text-emerald-300' : 'text-emerald-600',
    },
    {
      label: 'Year',
      value: info.currentyear || '—',
      icon: <YearIcon />,
      badge: isDark ? 'bg-amber-500/15' : 'bg-amber-100',
      tint: isDark ? 'text-amber-300' : 'text-amber-600',
    },
  ]

  return (
    <div>
      <p className={`max-w-xl text-sm ${muted}`}>
        The degree, branch and year you’re currently studying.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.label}
            className={`flex items-center gap-4 rounded-2xl p-5 ${tile} ${f.wide ? 'sm:col-span-2' : ''}`}
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${f.badge}`}>
              <svg
                className={`h-6 w-6 ${f.tint}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {f.icon}
              </svg>
            </div>
            <div className="min-w-0">
              <p className={`text-sm ${muted}`}>{f.label}</p>
              <p className={`mt-0.5 break-words text-lg font-semibold ${heading}`}>{f.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Studenedu