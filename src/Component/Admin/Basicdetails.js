import React, { useContext } from 'react'
import userpic from '../image/user.png'
import birthdate from '../image/date.png'
import Genders from '../image/gender.png'
import duserpic from '../image/dduser.png'
import dbirthdate from '../image/ddate.png'
import dgender from '../image/dgender.png'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'

const Basicdetails = ({ info = {} }) => {
  const context = useContext(AttendancenSApi)
  const { bgcolor } = context
  const isDark = bgcolor === 'dark'

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    })
  }

  const fields = [
    {
      label: 'Name',
      value: info.name || '—',
      icon: isDark ? duserpic : userpic,
      badge: isDark ? 'bg-indigo-500/15' : 'bg-indigo-100',
      wide: true,
    },
    {
      label: 'Date of birth',
      value: formatDate(info.dob),
      icon: isDark ? dbirthdate : birthdate,
      badge: isDark ? 'bg-emerald-500/15' : 'bg-emerald-100',
    },
    {
      label: 'Gender',
      value: info.gender || '—',
      icon: isDark ? dgender : Genders,
      badge: isDark ? 'bg-amber-500/15' : 'bg-amber-100',
    },
  ]

  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const tile = isDark
    ? 'bg-slate-950/40 ring-1 ring-white/10'
    : 'bg-slate-50 ring-1 ring-slate-200'

  return (
    <div>
      <p className={`max-w-xl text-sm ${muted}`}>
        Manage your personal information, including the phone number and email
        address where you can be contacted.
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
              <img src={f.icon} alt="" className="h-6 w-6 object-contain" />
            </div>
            <div className="min-w-0">
              <p className={`text-sm ${muted}`}>{f.label}</p>
              <p className={`mt-0.5 break-words text-lg font-semibold ${heading}`}>
                {f.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Basicdetails