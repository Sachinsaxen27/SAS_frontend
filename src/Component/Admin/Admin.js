import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'
import adminlogin from '../image/adminlogin.jpg'

import { apiUrl } from '../../config'

const Admin = () => {
  const context = useContext(AttendancenSApi)
  const { showAlert, bgcolor } = context
  const isDark = bgcolor === 'dark'

  const [credintial, setMycredintial] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setMycredintial({ ...credintial, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      console.log('API URL:', apiUrl) // Log the API URL to check if it's correct
      const response = await fetch(`${apiUrl}api/user/adminlogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credintial.email,
          password: credintial.password,
        }),
      })
      const json = await response.json()
      if (json.success) {
        localStorage.setItem('token', json.authtoken)
        showAlert('Login Successfully', 'success')
        navigate('/admindata')
      } else {
        showAlert('Invalid Credenital', 'danger')
      }
    } catch (err) {
      showAlert('Cannot reach the server. Try again.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleHelp = () => {
    showAlert(
      'Use the email and password you registered with. New here? Sign up first.',
      'info'
    )
  }

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const shell = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const label = isDark ? 'text-slate-200' : 'text-slate-700'
  const icon = isDark ? 'text-slate-500' : 'text-slate-400'
  const input = isDark
    ? 'bg-slate-950/60 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:ring-indigo-400/25'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/25'
  // Keeps Chrome's autofill from painting its own pale blue over the field
  const autofill = isDark
    ? '[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#f1f5f9]'
    : '[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a]'
  const link = isDark
    ? 'text-indigo-300 hover:text-indigo-200'
    : 'text-indigo-600 hover:text-indigo-700'
  const outlineBtn = isDark
    ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
  const divider = isDark ? 'bg-slate-700' : 'bg-slate-200'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-sky-600/20' : 'bg-sky-300/50'

  const inputCls = `w-full rounded-xl border py-3 pl-11 text-sm outline-none transition focus:ring-4 ${input} ${autofill}`

  return (
    <div className="relative isolate mx-auto max-w-5xl px-4 py-10">
      {/* soft colour glows behind the card */}
      <div className={`pointer-events-none absolute -left-6 top-4 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-0 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      <div className={`grid w-full overflow-hidden rounded-3xl md:grid-cols-2 ${shell}`}>
        {/* Image panel with caption */}
        <div className="relative hidden min-h-[34rem] md:block">
          <img
            src={adminlogin}
            alt="Admin login illustration"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white">
              Admin portal
            </h2>
            <p className="mt-2 max-w-xs text-sm text-indigo-100">
              Manage students, track attendance and review records in one place.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>
              Admin login
            </h1>
            <p className={`mt-2 text-sm ${muted}`}>
              Sign in to manage students and attendance.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className={`mb-1.5 block text-sm font-medium ${label}`}>
                  Email
                </label>
                <div className="relative">
                  <svg className={`pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 ${icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={credintial.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className={`${inputCls} pr-4`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`mb-1.5 block text-sm font-medium ${label}`}>
                  Password
                </label>
                <div className="relative">
                  <svg className={`pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 ${icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 018 0v3" />
                  </svg>
                  <input
                    type={showPass ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={credintial.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className={`${inputCls} pr-16`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className={`absolute inset-y-0 right-4 text-xs font-semibold ${link}`}
                  >
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !credintial.email || !credintial.password}
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>

            {/* New account */}
            <div className="my-6 flex items-center gap-3">
              <span className={`h-px flex-1 ${divider}`} />
              <span className={`text-xs ${muted}`}>New here?</span>
              <span className={`h-px flex-1 ${divider}`} />
            </div>

            <Link
              to="/adminsignup"
              className={`flex w-full items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition ${outlineBtn}`}
            >
              Create an account
            </Link>

            <button
              type="button"
              onClick={handleHelp}
              className={`mt-4 block w-full text-center text-sm font-medium ${link}`}
            >
              Need help signing in?
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Admin