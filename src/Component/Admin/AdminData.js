import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import image from '../image/user-icon.png'
import userimage from '../image/adduser.svg'
import checklist from '../image/checklist.png'
import stdlist from '../image/list.png'
import dimage from '../image/duser.png'
import duserimage from '../image/dadduser.png'
import dchecklist from '../image/dchecklist.png'
import dstdlist from '../image/dlist.png'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'

const AdminData = () => {
  const context = useContext(AttendancenSApi)
  const { bgcolor } = context
  const isDark = bgcolor === 'dark'

  // Every class is written out in full so Tailwind can detect it.
  const cards = [
    {
      title: 'My Profile',
      text: 'View or edit your profile details.',
      icon: isDark ? dimage : image,
      path: '/admininfo',
      top: 'border-t-indigo-500',
      badge: isDark ? 'bg-indigo-500/15' : 'bg-indigo-100',
      arrow: isDark ? 'text-indigo-300' : 'text-indigo-600',
      focus: 'focus-visible:ring-indigo-500',
    },
    {
      title: 'New Registration',
      text: 'Create a new student account.',
      icon: isDark ? duserimage : userimage,
      path: '/studentsingup',
      top: 'border-t-emerald-500',
      badge: isDark ? 'bg-emerald-500/15' : 'bg-emerald-100',
      arrow: isDark ? 'text-emerald-300' : 'text-emerald-600',
      focus: 'focus-visible:ring-emerald-500',
    },
    {
      title: 'Attendance',
      text: 'Check attendance for all students.',
      icon: isDark ? dchecklist : checklist,
      path: '/Attendancelist',
      top: 'border-t-amber-500',
      badge: isDark ? 'bg-amber-500/15' : 'bg-amber-100',
      arrow: isDark ? 'text-amber-300' : 'text-amber-600',
      focus: 'focus-visible:ring-amber-500',
    },
    {
      title: 'Student Info',
      text: 'See every student entry.',
      icon: isDark ? dstdlist : stdlist,
      path: '/studlist',
      top: 'border-t-sky-500',
      badge: isDark ? 'bg-sky-500/15' : 'bg-sky-100',
      arrow: isDark ? 'text-sky-300' : 'text-sky-600',
      focus: 'focus-visible:ring-sky-500',
    },
    {
      title: 'Admin List',
      text: 'See every admin account.',
      icon: isDark ? dstdlist : stdlist,
      path: '/adminlist',
      top: 'border-t-rose-500',
      badge: isDark ? 'bg-rose-500/15' : 'bg-rose-100',
      arrow: isDark ? 'text-rose-300' : 'text-rose-600',
      focus: 'focus-visible:ring-rose-500',
    },
  ]

  // ---- theme classes ----
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const cardBg = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-lg shadow-black/20 backdrop-blur-xl hover:shadow-2xl hover:shadow-indigo-950/60 hover:ring-white/20'
    : 'bg-white ring-1 ring-slate-200 shadow-md shadow-slate-200/70 hover:shadow-xl hover:shadow-indigo-200/70 hover:ring-slate-300'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 py-10">
      {/* soft colour glows behind the cards */}
      <div className={`pointer-events-none absolute -left-6 top-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      <header className="mb-8">
        <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>Dashboard</h1>
        <p className={`mt-2 text-sm ${muted}`}>
          Manage students, attendance and admin accounts.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.title}
            to={c.path}
            className={`group flex min-h-[13rem] flex-col rounded-2xl border-t-4 p-6 outline-none transition duration-200 hover:-translate-y-1 focus-visible:ring-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${cardBg} ${c.top} ${c.focus}`}
          >
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${c.badge}`}>
              <img src={c.icon} alt="" className="h-9 w-9 object-contain" />
            </div>

            <h2 className={`mt-5 text-lg font-semibold ${heading}`}>{c.title}</h2>
            <p className={`mt-1 text-sm ${muted}`}>{c.text}</p>

            <span
              className={`mt-auto flex items-center justify-end pt-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none ${c.arrow}`}
              aria-hidden="true"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminData