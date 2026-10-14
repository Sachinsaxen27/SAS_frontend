import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import graduate from './image/graduate.png'
import admin from './image/management.png'
import whitemang from './image/whitemang.png'
import dgraduate from './image/dgraduate.png'
import dcamera from './image/dcamera.png'
import wcamera from './image/wcamera.png'
import AttendancenSApi from '../ContextAPi/AttendanceSApi'

const Home = () => {
  const context = useContext(AttendancenSApi)
  const { bgcolor } = context
  const navigate = useNavigate()
  const isDark = bgcolor === 'dark'

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/admindata')
    } else if (localStorage.getItem('student')) {
      // student session exists; add redirect here if needed
    }
    // eslint-disable-next-line
  }, [])

  // Tailwind can't see class names built with template strings,
  // so every class is written out in full here.
  const cards = [
    {
      title: 'My Profile',
      text: 'View or edit your profile details.',
      icon: isDark ? whitemang : admin,
      path: '/admin',
      border: 'border-t-blue-500',
      ring: 'bg-blue-500/15',
      focus: 'focus-visible:ring-blue-500',
    },
    {
      title: 'Student Login',
      text: 'Sign in or create a new student account.',
      icon: isDark ? dgraduate : graduate,
      path: '/student',
      border: 'border-t-emerald-500',
      ring: 'bg-emerald-500/15',
      focus: 'focus-visible:ring-emerald-500',
    },
    {
      title: 'Attendance',
      text: 'Check attendance for all students.',
      icon: isDark ? dcamera : wcamera,
      path: '/camera',
      border: 'border-t-amber-500',
      ring: 'bg-amber-500/15',
      focus: 'focus-visible:ring-amber-500',
    },
  ]

  const pageText = isDark ? 'text-slate-100' : 'text-slate-800'
  const subText = isDark ? 'text-slate-400' : 'text-slate-500'
  const pageBg = isDark
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950'
    : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
  const cardBg = isDark
    ? 'bg-slate-800/60 ring-1 ring-white/10 backdrop-blur'
    : 'bg-white ring-1 ring-slate-200'
  // const navBtn = isDark
  //   ? 'border-slate-600 text-slate-200 hover:bg-slate-700'
  //   : 'border-slate-300 text-slate-700 hover:bg-slate-100'
  //   consle.log('isDark:', isDark)
  return (
    <div className={`min-h-screen ${pageBg}`}>
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Back / Forward */}
      {/* <div className="mb-8 flex gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${navBtn}`}
        >
          &#8592; Back
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Go forward"
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${navBtn}`}
        >
          Forward &#8594;
        </button>
      </div> */}

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            role="button"
            tabIndex={0}
            onClick={() => navigate(c.path)}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && navigate(c.path)
            }
            className={`flex min-h-[15rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-t-4 p-6 text-center shadow-md outline-none transition duration-200 hover:-translate-y-1.5 hover:shadow-xl focus-visible:ring-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${cardBg} ${c.border} ${c.focus}`}
          >
            <div
              className={`flex h-22 w-22 items-center justify-center rounded-full ${c.ring}`}
              style={{ width: '5.5rem', height: '5.5rem' }}
            >
              <img src={c.icon} alt="" className="h-13 w-13 object-contain" style={{ width: '3.2rem', height: '3.2rem' }} />
            </div>
            <h5 className={`mb-1 mt-4 text-lg font-semibold ${pageText}`}>
              {c.title}
            </h5>
            <p className={`text-sm ${subText}`}>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default Home