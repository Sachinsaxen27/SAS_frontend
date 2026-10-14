import React, { useRef, useState } from 'react'
import {apiUrl} from '../../config'
const API = `${apiUrl}api`
const MAX_PHOTO_MB = 5

// `name` must match the field names on your student documents
const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', full: true },
  { name: 'email', label: 'Email', type: 'email', full: true },
  { name: 'rollnumber', label: 'Roll no.', type: 'text' },
  { name: 'currentedu', label: 'Course', type: 'text' },
  { name: 'stdbranch', label: 'Branch', type: 'text' },
  { name: 'currentyear', label: 'Year', type: 'text' },
]

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

// Rendered inside <Modal> by Studentlist, so it only holds the form content.
// Studentlist gives it key={student._id}, so the form starts from that student's values.
const Editlist = ({ student, isDark, onClose, onSaved, showAlert,widthClass = 'max-w-sm'}) => {
  const fileRef = useRef(null)
  const [form, setForm] = useState(() =>
    FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: student[f.name] != null ? String(student[f.name]) : '' }), {})
  )
  const [photo, setPhoto] = useState(student.image || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const photoChanged = photo !== (student.image || '')
  const changed = photoChanged || FIELDS.some((f) => form[f.name].trim() !== String(student[f.name] ?? ''))

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

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: form[f.name].trim() }), {})
    if (photoChanged) payload.image = photo // only sent when the photo was changed

    if (payload.name.length < 2) return setError('Enter the student’s full name.')
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) return setError('Enter a valid email address.')

    setSaving(true)
    try {
      const response = await fetch(`${API}/student/updatestudent/${student._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(json.error || json.message || 'Could not save changes. Try again.')
        setSaving(false)
        return
      }
      onSaved({ ...student, ...payload })
      if (showAlert) showAlert('Student details updated', 'success')
      onClose()
    } catch (err) {
      setError('Could not reach the server. Check your connection and try again.')
      setSaving(false)
    }
  }

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const label = isDark ? 'text-slate-300' : 'text-slate-700'
  const errorText = isDark ? 'text-rose-300' : 'text-rose-600'
  const avatarRing = isDark ? 'ring-slate-900' : 'ring-white'
  const avatarFallback = isDark ? 'bg-slate-800 text-slate-200' : 'bg-indigo-100 text-indigo-700'
  const linkBtn = isDark ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-700'
  const mutedBtn = isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
  const input = isDark
    ? 'bg-slate-800/80 text-slate-100 placeholder-slate-500 ring-1 ring-white/10'
    : 'bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300'
  const ghost = isDark
    ? 'text-slate-200 ring-1 ring-white/15 hover:bg-slate-800'
    : 'text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'
  const focus = 'outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/40'

  const initial = (form.name || student.name || '?').trim().charAt(0).toUpperCase()

  return (
    <form onSubmit={handleSave} noValidate>
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 pb-14 pt-6 text-white">
        <h2 id="edit-title" className="text-lg font-semibold tracking-tight">Update student</h2>
        <p className="mt-1 text-sm text-indigo-100">Edit the details below, then save.</p>
      </div>

      <div className="px-6 pb-6">
        {/* Photo picker */}
        <div className="text-center">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPhoto}
            className="hidden"
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => fileRef.current && fileRef.current.click()}
            disabled={saving}
            aria-label="Change photo"
            className={`group relative -mt-12 mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-3xl font-semibold ring-4 ${avatarRing} ${avatarFallback} ${focus}`}
          >
            {photo ? (
              <img src={photo} alt="Student photo" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-slate-950/50 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
            </span>
          </button>

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
                onClick={() => setPhoto(student.image || '')}
                disabled={saving}
                className={`rounded-lg px-1 transition ${mutedBtn} ${focus}`}
              >
                Undo
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f, i) => (
            <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
              <label htmlFor={`edit-${f.name}`} className={`mb-1.5 block text-sm font-medium ${label}`}>
                {f.label}
              </label>
              <input
                id={`edit-${f.name}`}
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={onField}
                disabled={saving}
                autoFocus={i === 0}
                className={`w-full rounded-2xl px-4 py-3 text-sm disabled:opacity-60 ${input} ${focus}`}
              />
            </div>
          ))}
        </div>

        <p role="alert" aria-live="polite" className={`mt-4 min-h-[1.25rem] text-sm ${errorText}`}>
          {error}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className={`h-11 rounded-2xl text-sm font-medium transition ${ghost} ${focus}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !changed}
            className={`h-11 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-medium text-white shadow-md shadow-indigo-600/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${focus}`}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default Editlist