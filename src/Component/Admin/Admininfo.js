import React, { useContext, useEffect, useRef, useState } from 'react'
import Basicdetails from './Basicdetails'
import Contactdetails from './Contactdetails'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'

const API = 'http://localhost:5000/api'
const MAX_PHOTO_MB = 5
const GENDERS = ['Male', 'Female', 'Other']

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
  { id: 'basicDetails', label: 'Basic Details', ready: true },
  { id: 'familydetails', label: 'Family Details', ready: false },
  { id: 'contactdetails', label: 'Contact Details', ready: true },
  { id: 'educationdetails', label: 'Education Details', ready: false },
]

// ---- editable fields; `name` must match the field names on your admin document ----
const EDIT_FIELDS = {
  name: { label: 'Full name', type: 'text', auto: 'name', full: true },
  dob: { label: 'Date of birth', type: 'date' },
  gender: { label: 'Gender', type: 'select' },
  mobile: { label: 'Contact number', type: 'tel', auto: 'tel' },
  email: { label: 'Email address', type: 'email', auto: 'email' },
  address: { label: 'Address', type: 'textarea', auto: 'street-address', full: true },
}
const TAB_FIELDS = {
  basicDetails: ['name', 'dob', 'gender'],
  contactdetails: ['mobile', 'email', 'address'],
}
const FIELD_NAMES = Object.keys(EDIT_FIELDS)

const toDateInput = (v) => {
  if (!v) return ''
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}
const matchGender = (g) =>
  GENDERS.find((x) => x.toLowerCase() === String(g || '').toLowerCase()) || g || ''

const buildForm = (info) => ({
  name: info.name || '',
  dob: toDateInput(info.dob),
  gender: matchGender(info.gender),
  mobile: info.mobile != null ? String(info.mobile) : '',
  email: info.email || '',
  address: info.address || '',
})

// Shrinks the picked photo to max 400px and returns a JPEG data URL,
// so the request body stays small.
const resizeImage = (file, max = 400) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image'))
    }
    img.src = url
  })

const Admininfo = () => {
  const context = useContext(AttendancenSApi)
  const { bgcolor, showAlert } = context
  const isDark = bgcolor === 'dark'

  const fileRef = useRef(null)
  const [page, setmyPage] = useState('basicDetails')
  const [info, setMyinfo] = useState({})
  const [loading, setLoading] = useState(true)

  // inline edit state
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(buildForm({}))
  const [photo, setPhoto] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const getinfo = async () => {
    try {
      const response = await fetch(`${API}/user/getadmin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      })
      const json = await response.json()
      setMyinfo(json)
    } catch (err) {
      console.error('Could not load profile', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getinfo()
    // eslint-disable-next-line
  }, [])

  /* ---- edit mode ---- */
  const original = buildForm(info)
  const photoChanged = editing && photo !== (info.image || '')
  const changed = editing && (photoChanged || FIELD_NAMES.some((n) => form[n].trim() !== original[n]))

  const startEdit = () => {
    setForm(buildForm(info))
    setPhoto(info.image || '')
    setError('')
    setEditing(true)
  }
  const cancelEdit = () => {
    if (saving) return
    setEditing(false)
    setError('')
  }

  // Esc cancels editing
  useEffect(() => {
    if (!editing) return undefined
    const onKey = (e) => e.key === 'Escape' && !saving && cancelEdit()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line
  }, [editing, saving])

  const onField = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const onPhoto = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = '' // lets you pick the same file again
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Choose an image file (JPG, PNG or WebP).')
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) return setError(`Photo must be under ${MAX_PHOTO_MB} MB.`)
    try {
      setPhoto(await resizeImage(file))
      setError('')
    } catch (err) {
      setError('Could not read that image. Try a different file.')
    }
  }

  const handleSave = async () => {
    const v = (n) => form[n].trim()

    if (v('name').length < 2) return setError('Enter your full name (Basic Details).')
    if (!/^\S+@\S+\.\S+$/.test(v('email'))) return setError('Enter a valid email address (Contact Details).')
    if (v('mobile') && !/^\+?\d{7,15}$/.test(v('mobile').replace(/[\s-]/g, '')))
      return setError('Enter a valid contact number, 7–15 digits (Contact Details).')
    if (v('dob') && new Date(v('dob')) > new Date()) return setError('Date of birth can’t be in the future.')

    // send only what changed
    const payload = {}
    FIELD_NAMES.forEach((n) => {
      if (v(n) !== original[n]) payload[n] = v(n)
    })
    if (photoChanged) payload.image = photo

    setSaving(true)
    try {
      const response = await fetch(`${API}/user/updateadmin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(payload),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(json.error || json.message || 'Could not save changes. Try again.')
        setSaving(false)
        return
      }
      setMyinfo((prev) => ({ ...prev, ...payload }))
      if (showAlert) showAlert('Profile updated', 'success')
      setSaving(false)
      setEditing(false)
    } catch (err) {
      setError('Could not reach the server. Check your connection and try again.')
      setSaving(false)
    }
  }

  const activeTab = tabs.find((t) => t.id === page)
  const nameInitial = info.name ? info.name.trim().charAt(0).toUpperCase() : ''
  const shownPhoto = editing ? photo : info.image
  const avatarInitial = editing ? (form.name || info.name || '').trim().charAt(0).toUpperCase() : nameInitial

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const panel = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const label = isDark ? 'text-slate-300' : 'text-slate-700'
  const errorText = isDark ? 'text-rose-300' : 'text-rose-600'
  const avatarRing = isDark ? 'ring-slate-900' : 'ring-white'
  const avatarFallback = isDark ? 'bg-slate-800 text-slate-200' : 'bg-indigo-100 text-indigo-700'
  const tabIdle = isDark
    ? 'text-slate-300 hover:bg-slate-800'
    : 'text-slate-600 hover:bg-slate-100'
  const tabActive =
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
  const soonBadge = isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
  const skeleton = isDark ? 'bg-slate-700' : 'bg-slate-200'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'
  const input = isDark
    ? 'bg-slate-800/80 text-slate-100 placeholder-slate-500 ring-1 ring-white/10 [color-scheme:dark]'
    : 'bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300'
  const ghost = isDark
    ? 'text-slate-200 ring-1 ring-white/15 hover:bg-slate-800'
    : 'text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'
  const linkBtn = isDark ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-700'
  const mutedBtn = isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
  const gradientBtn =
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 hover:brightness-110'
  const focus = 'outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/40'

  const genderOptions = GENDERS.includes(form.gender) || !form.gender ? GENDERS : [form.gender, ...GENDERS]

  const renderEditFields = (tabId) => (
    <div>
      <p className={`max-w-xl text-sm ${muted}`}>
        You're editing. Change anything here or on the other tab, then save from the bar below.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TAB_FIELDS[tabId].map((n) => {
          const f = EDIT_FIELDS[n]
          const common = {
            id: `profile-${n}`,
            name: n,
            value: form[n],
            onChange: onField,
            disabled: saving,
            autoComplete: f.auto,
            className: `w-full rounded-2xl px-4 py-3 text-sm disabled:opacity-60 ${input} ${focus}`,
          }
          return (
            <div key={n} className={f.full ? 'sm:col-span-2' : ''}>
              <label htmlFor={`profile-${n}`} className={`mb-1.5 block text-sm font-medium ${label}`}>
                {f.label}
              </label>
              {f.type === 'select' ? (
                <select {...common}>
                  <option value="">Select gender</option>
                  {genderOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea {...common} rows={3} className={`${common.className} resize-none`} />
              ) : (
                <input {...common} type={f.type} inputMode={f.type === 'tel' ? 'tel' : undefined} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  const avatarInner = shownPhoto ? (
    <img src={shownPhoto} alt="Your profile" className="h-full w-full object-cover" />
  ) : (
    <span className="text-3xl font-semibold">{avatarInitial}</span>
  )

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 py-10">
      {/* soft colour glows behind the cards */}
      <div className={`pointer-events-none absolute -left-6 top-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>My Profile</h1>
        {editing ? (
          <span className={`text-sm font-medium ${muted}`}>Editing</span>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            disabled={loading}
            className={`inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${gradientBtn} ${focus}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
            </svg>
            Edit profile
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Profile card */}
          <div className={`overflow-hidden rounded-3xl ${panel}`}>
            <div className="h-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600" />
            <div className="px-6 pb-6 text-center">
              <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" tabIndex={-1} />

              {editing ? (
                <button
                  type="button"
                  onClick={() => fileRef.current && fileRef.current.click()}
                  disabled={saving}
                  aria-label="Change photo"
                  className={`group relative -mt-12 mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-4 ${avatarRing} ${avatarFallback} ${focus}`}
                >
                  {avatarInner}
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/50 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                      <circle cx="12" cy="13" r="3.5" />
                    </svg>
                  </span>
                </button>
              ) : (
                <div className={`-mt-12 mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-4 ${avatarRing} ${avatarFallback}`}>
                  {avatarInner}
                </div>
              )}

              {editing && (
                <div className="mt-2 flex items-center justify-center gap-3 text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => fileRef.current && fileRef.current.click()}
                    disabled={saving}
                    className={`rounded-lg px-1 transition ${linkBtn} ${focus}`}
                  >
                    Change photo
                  </button>
                  {photoChanged && (
                    <button
                      type="button"
                      onClick={() => setPhoto(info.image || '')}
                      disabled={saving}
                      className={`rounded-lg px-1 transition ${mutedBtn} ${focus}`}
                    >
                      Undo
                    </button>
                  )}
                </div>
              )}

              {loading ? (
                <div className="mt-4 space-y-2" aria-hidden="true">
                  <div className={`mx-auto h-5 w-32 animate-pulse rounded ${skeleton}`} />
                  <div className={`mx-auto h-4 w-44 animate-pulse rounded ${skeleton}`} />
                </div>
              ) : (
                <>
                  <h2 className={`mt-4 text-lg font-semibold ${heading}`}>{info.name}</h2>
                  <p className={`mt-0.5 break-all text-sm ${muted}`}>{info.email}</p>
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
                  {!t.ready && (
                    <span
                      className={`ml-auto hidden rounded-full px-2 py-0.5 text-[11px] font-medium lg:inline ${
                        active ? 'bg-white/20 text-white' : soonBadge
                      }`}
                    >
                      Soon
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <section className={`min-w-0 rounded-3xl p-6 sm:p-8 ${panel}`}>
          <h2 className={`mb-6 text-xl font-semibold ${heading}`}>{activeTab.label}</h2>

          {page === 'basicDetails' && (editing ? renderEditFields('basicDetails') : <Basicdetails info={info} />)}
          {page === 'contactdetails' && (editing ? renderEditFields('contactdetails') : <Contactdetails info={info} />)}

          {!activeTab.ready && (
            <div className={`flex min-h-[12rem] flex-col items-center justify-center text-center ${muted}`}>
              <p className={`text-base font-medium ${heading}`}>Coming soon</p>
              <p className="mt-1 text-sm">This section isn't available yet.</p>
            </div>
          )}
        </section>
      </div>

      {/* Save bar: appears while editing */}
      {editing && (
        <div className={`sticky bottom-4 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-3 ${panel}`}>
          <p
            role="alert"
            aria-live="polite"
            className={`text-sm ${error ? errorText : muted}`}
          >
            {error || (changed ? 'You have unsaved changes.' : 'Change your photo, basic details or contact details.')}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className={`h-10 rounded-2xl px-4 text-sm font-medium transition ${ghost} ${focus}`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !changed}
              className={`h-10 rounded-2xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${gradientBtn} ${focus}`}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admininfo