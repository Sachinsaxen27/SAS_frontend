import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'
import { apiUrl } from '../../config'
// Small line icons (24x24 grid)
const icons = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
}

const Icon = ({ name, className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {icons[name]}
  </svg>
)

const AdminSignup = () => {
  const context = useContext(AttendancenSApi)
  const { showAlert, bgcolor } = context
  const isDark = bgcolor === 'dark'

  const [credintial, setMycredintial] = useState({
    name: '',
    email: '',
    address: '',
    mobile: '',
    dob: '',
    password: '',
    gender: '',
  })
  const [image, setImage] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Already signed in -> go straight to the dashboard
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/admindata')
    }
    // eslint-disable-next-line
  }, [])

  const handleChange = (e) => {
    setMycredintial({ ...credintial, [e.target.name]: e.target.value })
  }

  const convertobase64 = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) {
      setImage('')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => setImage(reader.result)
    reader.onerror = () => showAlert('Could not read the photo', 'danger')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}api/user/adminSingup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: credintial.name,
          email: credintial.email,
          password: credintial.password,
          address: credintial.address,
          mobile: credintial.mobile,
          dob: credintial.dob,
          gender: credintial.gender,
          image: image,
        }),
      })
      const json = await response.json()
      if (json.success) {
        localStorage.setItem('token', json.authtoken)
        showAlert('Successfully Sign Up', 'success')
        navigate('/admin')
      } else {
        showAlert('Sign up failed. Check your details and try again.', 'danger')
      }
    } catch (err) {
      showAlert('Cannot reach the server. Try again.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const panel = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const label = isDark ? 'text-slate-200' : 'text-slate-700'
  const iconCls = isDark ? 'text-slate-500' : 'text-slate-400'
  const badge = isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
  const input = isDark
    ? 'bg-slate-950/60 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:ring-indigo-400/25 [color-scheme:dark]'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/25 [color-scheme:light]'
  // Keeps Chrome's autofill from painting its own pale blue over the field
  const autofill = isDark
    ? '[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#f1f5f9]'
    : '[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#0f172a]'
  const link = isDark
    ? 'text-indigo-300 hover:text-indigo-200'
    : 'text-indigo-600 hover:text-indigo-700'
  const avatarBg = isDark ? 'bg-slate-950/60 ring-slate-700' : 'bg-slate-100 ring-slate-300'
  const uploadBtn = isDark
    ? 'border-slate-600 text-slate-200 hover:bg-slate-800'
    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
  const segment = isDark
    ? 'border-slate-700 text-slate-300 hover:bg-slate-800 peer-checked:border-transparent'
    : 'border-slate-300 text-slate-600 hover:bg-slate-50 peer-checked:border-transparent'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'

  const inputCls = `w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-4 ${input} ${autofill}`
  const labelCls = `mb-1.5 block text-sm font-medium ${label}`
  const leftIcon = `pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 ${iconCls}`

  return (
    <form onSubmit={handleSubmit} className="relative isolate mx-auto max-w-4xl px-4 py-10">
      {/* soft colour glows behind the cards */}
      <div className={`pointer-events-none absolute -left-4 top-10 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-4 bottom-10 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      <header className="text-center">
        <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>
          Teacher sign-up
        </h1>
        <p className={`mt-2 text-sm ${muted}`}>
          Create your account to manage students and attendance.
        </p>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Personal details */}
        <section className={`rounded-3xl p-6 sm:p-8 ${panel}`}>
          <div className="mb-6 flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${badge}`}>
              <Icon name="user" className="h-5 w-5" />
            </span>
            <h2 className={`text-lg font-semibold ${heading}`}>Personal details</h2>
          </div>

          <div className="space-y-5">
            {/* Photo */}
            <div>
              <span className={labelCls}>Photo</span>
              <div className="flex items-center gap-4">
                <div className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ${avatarBg}`}>
                  {image ? (
                    <img src={image} alt="Selected" className="h-full w-full object-cover" />
                  ) : (
                    <Icon name="user" className={`h-8 w-8 ${iconCls}`} />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={convertobase64}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="image"
                    className={`inline-flex cursor-pointer items-center rounded-xl border px-4 py-2 text-sm font-medium transition peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-500/40 ${uploadBtn}`}
                  >
                    {image ? 'Change photo' : 'Upload photo'}
                  </label>
                  <p className={`mt-1.5 text-xs ${muted}`}>PNG or JPG, square works best.</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className={labelCls}>Full name</label>
              <div className="relative">
                <Icon name="user" className={leftIcon} />
                <input type="text" id="name" name="name" value={credintial.name} onChange={handleChange} autoComplete="name" required placeholder="Your full name" className={inputCls} />
              </div>
            </div>

            {/* Gender */}
            <div>
              <span className={labelCls}>Gender</span>
              <div className="grid grid-cols-3 gap-2">
                {['Male', 'Female', 'Other'].map((g, i) => (
                  <label key={g} className="cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={credintial.gender === g}
                      onChange={handleChange}
                      required={i === 0}
                      className="peer sr-only"
                    />
                    <span
                      className={`block rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-violet-600 peer-checked:text-white peer-checked:shadow-md peer-checked:shadow-indigo-600/30 peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-500/40 ${segment}`}
                    >
                      {g}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* DOB */}
            <div>
              <label htmlFor="dob" className={labelCls}>Date of birth</label>
              <div className="relative">
                <Icon name="calendar" className={leftIcon} />
                <input type="date" id="dob" name="dob" value={credintial.dob} onChange={handleChange} autoComplete="bday" required className={inputCls} />
              </div>
            </div>
          </div>
        </section>

        {/* Contact details */}
        <section className={`rounded-3xl p-6 sm:p-8 ${panel}`}>
          <div className="mb-6 flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${badge}`}>
              <Icon name="mail" className="h-5 w-5" />
            </span>
            <h2 className={`text-lg font-semibold ${heading}`}>Contact details</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="mobile" className={labelCls}>Mobile number</label>
              <div className="relative">
                <Icon name="phone" className={leftIcon} />
                <input type="tel" inputMode="numeric" id="mobile" name="mobile" value={credintial.mobile} onChange={handleChange} autoComplete="tel" required placeholder="10-digit number" className={inputCls} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelCls}>Email address</label>
              <div className="relative">
                <Icon name="mail" className={leftIcon} />
                <input type="email" id="email" name="email" value={credintial.email} onChange={handleChange} autoComplete="email" required placeholder="you@example.com" className={inputCls} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelCls}>Password</label>
              <div className="relative">
                <Icon name="lock" className={leftIcon} />
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credintial.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  placeholder="Create a password"
                  className={`${inputCls} !pr-16`}
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

            <div>
              <label htmlFor="address" className={labelCls}>Address</label>
              <div className="relative">
                <Icon name="pin" className={leftIcon} />
                <input type="text" id="address" name="address" value={credintial.address} onChange={handleChange} autoComplete="street-address" required placeholder="Street, city" className={inputCls} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full max-w-sm rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
        <p className={`text-sm ${muted}`}>
          Already have an account?{' '}
          <Link to="/admin" className={`font-medium ${link}`}>
            Log in
          </Link>
        </p>
      </div>
    </form>
  )
}

export default AdminSignup