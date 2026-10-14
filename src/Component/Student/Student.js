import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginimg from '../image/phishing.webp'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'
import { apiUrl } from '../../config'
const Student = () => {
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
      const response = await fetch(`${apiUrl}api/student/studentlogin`, {
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
        navigate('/studentdata')
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
      'Enter your Roll Number as email or password is your Date of Birth',
      'info'
    )
  }

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const shell = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-100'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const label = isDark ? 'text-slate-200' : 'text-slate-700'
  const icon = isDark ? 'text-slate-500' : 'text-slate-400'
  const input = isDark
    ? 'bg-slate-950/60 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:ring-indigo-400/25'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/25'
  // Stops Chrome's light-blue autofill background from replacing the input colour
  const autofill = isDark
    ? '[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#f1f5f9]'
    : '[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a]'
  const link = isDark
    ? 'text-indigo-300 hover:text-indigo-200'
    : 'text-indigo-600 hover:text-indigo-700'
  const helpBtn = isDark
    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/40'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/40'

  const inputCls = `w-full rounded-xl border py-3 pl-11 text-sm outline-none transition focus:ring-4 ${input} ${autofill}`

  return (
    <div className="relative isolate mx-auto max-w-5xl px-4 py-10">
      {/* soft colour glows behind the card */}
      <div className={`pointer-events-none absolute -left-6 top-4 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-0 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      <div className={`grid w-full overflow-hidden rounded-3xl md:grid-cols-2 ${shell}`}>
        {/* Welcome panel */}
        <div className="relative hidden flex-col justify-between gap-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 md:flex">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white">
              Welcome back
            </h2>
            <p className="mt-2 max-w-xs text-sm text-indigo-100">
              Check your attendance anytime, from any device.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/30 ring-4 ring-white/20">
            <img
              src={loginimg}
              alt="Secure student login illustration"
              className="h-64 w-full object-cover"
            />
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-sm" noValidate>
            <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>
              Student login
            </h1>
            <p className={`mt-2 text-sm ${muted}`}>
              Sign in to see your attendance records.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className={`mb-1.5 block text-sm font-medium ${label}`}>
                  Username or roll number
                </label>
                <div className="relative">
                  <svg className={`pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 ${icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={credintial.email}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                    placeholder="e.g. 21CS104"
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

            <button
              type="button"
              onClick={handleHelp}
              className={`mt-4 w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition ${helpBtn}`}
            >
              Need help signing in?
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Student