import React, { useContext } from 'react'
import emailpic from '../image/email.png'
import mobileno from '../image/phone.png'
import dmobile from '../image/dphone.png'
import demail from '../image/demail.png'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'

const Contactdetails = ({ info = {} }) => {
  const context = useContext(AttendancenSApi)
  const { bgcolor } = context
  const isDark = bgcolor === 'dark'

  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const tile = isDark
    ? 'bg-slate-950/40 ring-1 ring-white/10'
    : 'bg-slate-50 ring-1 ring-slate-200'

  const fields = [
    {
      label: 'Contact number',
      value: info.mobile || '—',
      icon: (
        <img
          src={isDark ? dmobile : mobileno}
          alt=""
          className="h-6 w-6 object-contain"
        />
      ),
      badge: isDark ? 'bg-emerald-500/15' : 'bg-emerald-100',
    },
    {
      label: 'Email address',
      value: info.email || '—',
      icon: (
        <img
          src={isDark ? demail : emailpic}
          alt=""
          className="h-6 w-6 object-contain"
        />
      ),
      badge: isDark ? 'bg-sky-500/15' : 'bg-sky-100',
      breakAll: true,
    },
    {
      label: 'Address',
      value: info.address || '—',
      // No address image in the project, so a small inline icon is used
      icon: (
        <svg
          className={`h-6 w-6 ${isDark ? 'text-amber-300' : 'text-amber-600'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      ),
      badge: isDark ? 'bg-amber-500/15' : 'bg-amber-100',
      wide: true,
    },
  ]

  return (
    <div>
      <p className={`max-w-xl text-sm ${muted}`}>
        Manage the phone number, email address and address where you can be
        contacted.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.label}
            className={`flex items-center gap-4 rounded-2xl p-5 ${tile} ${
              f.wide ? 'sm:col-span-2' : ''
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${f.badge}`}
            >
              {f.icon}
            </div>
            <div className="min-w-0">
              <p className={`text-sm ${muted}`}>{f.label}</p>
              <p
                className={`mt-0.5 text-lg font-semibold ${heading} ${
                  f.breakAll ? 'break-all' : 'break-words'
                }`}
              >
                {f.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Contactdetails