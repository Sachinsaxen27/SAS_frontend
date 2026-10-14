import React, { useContext, useEffect, useState } from 'react'
import Basicdetails from '../Admin/Basicdetails'
import Familydetails from './FamilyDetail'
import Contactdetails from './StudentContact'
import Studenedu from './Studenedu'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'
import { apiUrl } from '../../config'
const tabIcons = {
  basicDetails: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  familydetails: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 15c3 0 5 1.8 5 4.5" />
    </>
  ),
  contactdetails: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  ),
  educationdetails: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
    </>
  ),
}

const TabIcon = ({ name }) => (
  <svg
    className="h-5 w-5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {tabIcons[name]}
  </svg>
)

const tabs = [
  { id: 'basicDetails', label: 'Basic Details' },
  { id: 'familydetails', label: 'Family Details' },
  { id: 'contactdetails', label: 'Contact Details' },
  { id: 'educationdetails', label: 'Education Details' },
]

const StudentInfo = () => {
  const { bgcolor } = useContext(AttendancenSApi)
  const isDark = bgcolor === 'dark'

  const [page, setmyPage] = useState('basicDetails')
  const [info, setMyinfo] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getinfo = async () => {
    try {
      const response = await fetch(`${apiUrl}api/student/getstudent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      })
      const json = await response.json()
      setMyinfo(json)
    } catch (err) {
      setError('Could not load your profile. Check that the server is running and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getinfo()
    // eslint-disable-next-line
  }, [])

  const activeTab = tabs.find((t) => t.id === page)
  const initial = info.name ? info.name.trim().charAt(0).toUpperCase() : ''
  const pills = [info.currentedu, info.stdbranch].filter(Boolean)

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const panel = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const errorText = isDark ? 'text-red-400' : 'text-red-600'
  const avatarRing = isDark ? 'ring-slate-900' : 'ring-white'
  const avatarFallback = isDark ? 'bg-slate-800 text-slate-200' : 'bg-indigo-100 text-indigo-700'
  const pill = isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
  const tabIdle = isDark
    ? 'text-slate-300 hover:bg-slate-800'
    : 'text-slate-600 hover:bg-slate-100'
  const tabActive =
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
  const skeleton = isDark ? 'bg-slate-700' : 'bg-slate-200'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 py-10">
      {/* soft colour glows behind the cards */}
      <div className={`pointer-events-none absolute -left-6 top-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      <h1 className={`mb-8 text-3xl font-semibold tracking-tight ${heading}`}>My Profile</h1>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Profile card */}
          <div className={`overflow-hidden rounded-3xl ${panel}`}>
            <div className="h-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600" />
            <div className="px-6 pb-6 text-center">
              <div
                className={`-mt-12 mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-4 ${avatarRing} ${avatarFallback}`}
              >
                {info.image ? (
                  <img src={info.image} alt="Your profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-semibold">{initial}</span>
                )}
              </div>

              {loading ? (
                <div className="mt-4 space-y-2" aria-hidden="true">
                  <div className={`mx-auto h-5 w-32 animate-pulse rounded ${skeleton}`} />
                  <div className={`mx-auto h-4 w-44 animate-pulse rounded ${skeleton}`} />
                </div>
              ) : (
                <>
                  <h2 className={`mt-4 text-lg font-semibold ${heading}`}>{info.name}</h2>
                  <p className={`mt-0.5 break-all text-sm ${muted}`}>{info.email}</p>
                  {pills.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {pills.map((p) => (
                        <span key={p} className={`rounded-full px-3 py-1 text-xs font-medium ${pill}`}>
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Menu */}
          <nav
            aria-label="Profile sections"
            className={`flex gap-1 overflow-x-auto rounded-3xl p-2 lg:flex-col lg:overflow-visible ${panel}`}
          >
            {tabs.map((t) => {
              const active = page === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setmyPage(t.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium outline-none transition focus-visible:ring-4 focus-visible:ring-indigo-500/40 lg:shrink ${
                    active ? tabActive : tabIdle
                  }`}
                >
                  <TabIcon name={t.id} />
                  <span className="whitespace-nowrap">{t.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <section className={`min-w-0 rounded-3xl p-6 sm:p-8 ${panel}`}>
          <h2 className={`mb-6 text-xl font-semibold ${heading}`}>{activeTab.label}</h2>

          {error ? (
            <p role="alert" className={`text-sm ${errorText}`}>{error}</p>
          ) : (
            <>
              {page === 'basicDetails' && <Basicdetails info={info} />}
              {page === 'familydetails' && <Familydetails info={info} />}
              {page === 'contactdetails' && <Contactdetails info={info} />}
              {page === 'educationdetails' && <Studenedu info={info} />}
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default StudentInfo