import React, { useContext, useEffect, useMemo, useState } from 'react'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'
import {apiUrl} from '../../config'
const API = `${apiUrl}api/user`

const Icon = ({ children, className = 'h-4 w-4' }) => (
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
    {children}
  </svg>
)

const EditIcon = () => (
  <Icon>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
  </Icon>
)
const TrashIcon = () => (
  <Icon>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v5M14 11v5" />
  </Icon>
)
const SearchIcon = () => (
  <Icon className="h-5 w-5">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Icon>
)
const PhoneIcon = () => (
  <Icon className="h-3.5 w-3.5">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
  </Icon>
)
const MailIcon = () => (
  <Icon className="h-3.5 w-3.5">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Icon>
)

const AdminList = () => {
  const context = useContext(AttendancenSApi)
  const { bgcolor } = context
  const isDark = bgcolor === 'dark'

  const [Admin, setMyAdmin] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [me, setMe] = useState(null)

  const getinfo = async () => {
    try {
      const response = await fetch(`${API}/adminlist`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const json = await response.json()
      setMyAdmin(Array.isArray(json) ? json : [])
    } catch (err) {
      console.error('Could not load admin list', err)
    } finally {
      setLoading(false)
    }
  }

  // the currently logged-in admin (same endpoint your profile page uses)
  const getme = async () => {
    try {
      const response = await fetch(`${API}/getadmin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      })
      const json = await response.json()
      setMe(json)
    } catch (err) {
      console.error('Could not load current user', err)
    }
  }

  useEffect(() => {
    getinfo()
    getme()
    // eslint-disable-next-line
  }, [])

  // match on _id when available, otherwise fall back to email
  const isSelf = (admin) => {
    if (!me) return false
    if (me._id && admin._id) return me._id === admin._id
    return !!me.email && me.email === admin.email
  }

  const handeldelete = async (id) => {
    const target = Admin.find((a) => a._id === id)
    if (target && isSelf(target)) {
      setConfirmId(null)
      return
    }
    setDeleting(true)
    try {
      await fetch(`${API}/admindelete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      setMyAdmin((prev) => prev.filter((admin) => admin._id !== id))
    } catch (err) {
      console.error('Could not delete admin', err)
    } finally {
      setDeleting(false)
      setConfirmId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return Admin
    return Admin.filter((a) =>
      [a.name, a.email, a.mobile].some((v) => String(v ?? '').toLowerCase().includes(q))
    )
  }, [Admin, query])

  const toDelete = Admin.find((a) => a._id === confirmId)

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const panel = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const body = isDark ? 'text-slate-200' : 'text-slate-700'
  const divider = isDark ? 'divide-white/10' : 'divide-slate-100'
  const headRow = isDark ? 'bg-slate-800/60 text-slate-400' : 'bg-slate-50 text-slate-500'
  const rowHover = isDark ? 'hover:bg-slate-800/50' : 'hover:bg-indigo-50/60'
  const avatar = isDark ? 'bg-slate-800 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
  const skeleton = isDark ? 'bg-slate-700' : 'bg-slate-200'
  const countBadge = isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
  const input = isDark
    ? 'bg-slate-800/80 text-slate-100 placeholder-slate-500 ring-1 ring-white/10'
    : 'bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-200'
  const editBtn = isDark
    ? 'text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300'
    : 'text-slate-500 hover:bg-indigo-100 hover:text-indigo-700'
  const deleteBtn = isDark
    ? 'text-slate-300 hover:bg-rose-500/20 hover:text-rose-300'
    : 'text-slate-500 hover:bg-rose-100 hover:text-rose-600'
  const disabledBtn = isDark ? 'cursor-not-allowed text-slate-600' : 'cursor-not-allowed text-slate-300'
  const youBadge = isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
  const modalBg = isDark ? 'bg-slate-900 ring-1 ring-white/10' : 'bg-white ring-1 ring-slate-200'
  const cancelBtn = isDark
    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'

  const focusRing = 'outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/40'

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 py-10">
      {/* soft colour glows behind the card */}
      <div className={`pointer-events-none absolute -left-6 top-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>Admins</h1>
            {!loading && (
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${countBadge}`}>
                {Admin.length} total
              </span>
            )}
          </div>
          <p className={`mt-1 text-sm ${muted}`}>Manage everyone who has admin access.</p>
        </div>

        <label className="relative block w-full sm:w-72">
          <span className="sr-only">Search admins</span>
          <span className={`pointer-events-none absolute inset-y-0 left-3.5 flex items-center ${muted}`}>
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or number"
            className={`w-full rounded-2xl py-3 pl-11 pr-4 text-sm ${input} ${focusRing}`}
          />
        </label>
      </div>

      {/* Table card */}
      <div className={`overflow-hidden rounded-3xl ${panel}`}>
        <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className={`text-xs font-medium ${headRow}`}>
                <th scope="col" className="w-16 px-6 py-3.5">SN#</th>
                <th scope="col" className="px-6 py-3.5">Name</th>
                <th scope="col" className="px-6 py-3.5">Email</th>
                <th scope="col" className="px-6 py-3.5">Contact no.</th>
                <th scope="col" className="w-28 px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y ${divider}`}>
              {loading &&
                [0, 1, 2, 3].map((i) => (
                  <tr key={i} aria-hidden="true">
                    <td className="px-6 py-4"><div className={`h-4 w-6 animate-pulse rounded ${skeleton}`} /></td>
                    <td className="px-6 py-4"><div className={`h-4 w-36 animate-pulse rounded ${skeleton}`} /></td>
                    <td className="px-6 py-4"><div className={`h-4 w-48 animate-pulse rounded ${skeleton}`} /></td>
                    <td className="px-6 py-4"><div className={`h-4 w-28 animate-pulse rounded ${skeleton}`} /></td>
                    <td className="px-6 py-4"><div className={`ml-auto h-4 w-16 animate-pulse rounded ${skeleton}`} /></td>
                  </tr>
                ))}

              {!loading &&
                filtered.map((admin, index) => (
                  <tr key={admin._id ?? index} className={`transition ${rowHover}`}>
                    <td className={`px-6 py-4 tabular-nums ${muted}`}>{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatar}`}
                        >
                          {admin.name ? admin.name.trim().charAt(0).toUpperCase() : '?'}
                        </span>
                        <span className={`font-medium ${heading}`}>{admin.name}</span>
                        {isSelf(admin) && (
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${youBadge}`}>
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${body}`}>
                      <span className="inline-flex items-center gap-2">
                        <span className={muted}><MailIcon /></span>
                        {admin.email}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${body}`}>
                      <span className="inline-flex items-center gap-2">
                        <span className={muted}><PhoneIcon /></span>
                        {admin.mobile}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${admin.name}`}
                          title={isSelf(admin) ? 'Edit your own account from My Profile' : 'Edit'}
                          disabled={isSelf(admin)}
                          className={`rounded-xl p-2 transition ${
                            isSelf(admin) ? disabledBtn : editBtn
                          } ${focusRing}`}
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${admin.name}`}
                          title={isSelf(admin) ? "You can't delete your own account" : 'Delete'}
                          disabled={isSelf(admin)}
                          onClick={() => !isSelf(admin) && setConfirmId(admin._id)}
                          className={`rounded-xl p-2 transition ${
                            isSelf(admin) ? disabledBtn : deleteBtn
                          } ${focusRing}`}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex min-h-[12rem] flex-col items-center justify-center px-6 text-center">
            <p className={`text-base font-medium ${heading}`}>
              {Admin.length === 0 ? 'No admins yet' : 'No matching admins'}
            </p>
            <p className={`mt-1 text-sm ${muted}`}>
              {Admin.length === 0
                ? 'Admins you add will show up here.'
                : 'Try a different name, email or number.'}
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          onClick={() => !deleting && setConfirmId(null)}
        >
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl ${modalBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-title" className={`text-lg font-semibold ${heading}`}>
              Delete {toDelete?.name || 'this admin'}?
            </h2>
            <p className={`mt-2 text-sm ${muted}`}>
              They will lose admin access. This can't be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                disabled={deleting}
                className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${cancelBtn} ${focusRing}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handeldelete(confirmId)}
                disabled={deleting}
                className={`rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-rose-600/30 transition hover:bg-rose-500 disabled:opacity-60 ${focusRing}`}
              >
                {deleting ? 'Deleting…' : 'Delete admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminList