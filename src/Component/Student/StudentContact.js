import React, { useContext } from 'react'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'

const PhoneIcon = () => (
  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
)
const MailIcon = () => (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </>
)

const StudentContact = ({ info = {} }) => {
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
      label: 'Contact number',
      value: info.mobile || '—',
      icon: <PhoneIcon />,
      badge: isDark ? 'bg-emerald-500/15' : 'bg-emerald-100',
      tint: isDark ? 'text-emerald-300' : 'text-emerald-600',
    },
    {
      label: 'Email address',
      value: info.email || '—',
      icon: <MailIcon />,
      badge: isDark ? 'bg-sky-500/15' : 'bg-sky-100',
      tint: isDark ? 'text-sky-300' : 'text-sky-600',
      breakAll: true,
    },
  ]

  return (
    <div>
      <p className={`max-w-xl text-sm ${muted}`}>
        The phone number and email address where you can be contacted.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label} className={`flex items-center gap-4 rounded-2xl p-5 ${tile}`}>
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
              <p className={`mt-0.5 text-lg font-semibold ${heading} ${f.breakAll ? 'break-all' : 'break-words'}`}>
                {f.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StudentContact