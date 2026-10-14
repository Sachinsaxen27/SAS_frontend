import React, { useContext, useEffect, useState } from 'react'
import QRCode from 'qrcode.react'
import Tablelist from './Tablelist'
import AttendancenSApi from '../../ContextAPi/AttendanceSApi'
import Editlist from './EditList'
const API = 'http://localhost:5000/api'
const COLUMNS = [
  'SN#', 'Photo', 'Name', 'Email', 'Roll No.', 'Course', 'Branch', 'Year',
  'Update', 'Delete', 'Bar Code', 'Download',
]

/* Simple accessible modal: closes on Esc and on backdrop click */
const Modal = ({ open, onClose, labelId, panelClass, children }) => {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className={`max-h-[90vh] w-full max-w-sm overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-3xl ${panelClass}`}
      >
        {children}
      </div>
    </div>
  )
}

const Studentlist = () => {
  const { bgcolor, showAlert } = useContext(AttendancenSApi)
  const isDark = bgcolor === 'dark'

  const [student, setMystudent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const [qrValue, setQrValue] = useState(null) // QR modal
  const [cardStudent, setCardStudent] = useState(null) // ID card modal
  const [deleteTarget, setDeleteTarget] = useState(null) // delete confirm modal
  const [deleting, setDeleting] = useState(false)
  const [editStudent, setEditStudent] = useState(null)


  useEffect(() => {
    const controller = new AbortController()
    const getinfo = async () => {
      try {
        const response = await fetch(`${API}/user/detstudent`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        })
        const json = await response.json()
        console.log(json)
        setMystudent(Array.isArray(json) ? json : [])
      } catch (err) {
        if (err.name === 'AbortError') return
        setError('Could not load students. Check that the server is running and try again.')
      }
      setLoading(false)
    }
    getinfo()
    return () => controller.abort()
  }, [])

  /* ---- handlers passed to <Tablelist /> (same names as before) ---- */
  const handleUpdate = (studentdet) => setEditStudent(studentdet)
  const handeldelete = (id) => {
    setDeleteTarget(student.find((s) => s._id === id) || { _id: id })
  }
  const HandleQr = (mobile) => setQrValue(String(mobile))
  const handeldownload = (studentdet) => setCardStudent(studentdet)

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const response = await fetch(`${API}/student/deletestudent/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' },
      })
      const json = await response.json()
      showAlert(json, 'success')
      setMystudent((prev) => prev.filter((s) => s._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err) {
      showAlert('Could not delete the student', 'danger')
    }
    setDeleting(false)
  }

  /* ---- search (client side) ---- */
  const q = query.trim().toLowerCase()
  const visible = q
    ? student.filter((s) => `${s.name || ''} ${s.email || ''}`.toLowerCase().includes(q))
    : student
  const total = student.length

  // ---- theme classes (full strings so Tailwind can detect them) ----
  const panel = isDark
    ? 'bg-slate-900/70 ring-1 ring-white/10 shadow-2xl shadow-indigo-950/60 backdrop-blur-xl'
    : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-indigo-200/60'
  const modalPanel = isDark
    ? 'bg-slate-900 ring-1 ring-white/10 shadow-2xl shadow-black/50'
    : 'bg-white ring-1 ring-slate-200 shadow-2xl'
  const heading = isDark ? 'text-white' : 'text-slate-900'
  const muted = isDark ? 'text-slate-400' : 'text-slate-500'
  const accent = isDark ? 'text-indigo-300' : 'text-indigo-600'
  const danger = isDark ? 'text-red-400' : 'text-red-600'
  const gradient =
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
  const ghost = isDark
    ? 'text-slate-200 ring-1 ring-white/15 hover:bg-slate-800'
    : 'text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100'
  const searchBox = isDark
    ? 'bg-slate-900/70 text-slate-300 ring-1 ring-white/10 backdrop-blur-xl focus-within:ring-indigo-400'
    : 'bg-white text-slate-500 ring-1 ring-slate-300 focus-within:ring-indigo-500'
  const searchInput = isDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
  const thead = isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-500'
  const rowText = isDark ? 'text-slate-200' : 'text-slate-700'
  const rowLine = isDark ? 'border-white/5' : 'border-slate-100'
  const rowHover = isDark ? 'hover:bg-slate-800/60' : 'hover:bg-indigo-50/60'
  const skeleton = isDark ? 'bg-slate-700' : 'bg-slate-200'
  const divider = isDark ? 'divide-white/10' : 'divide-slate-200'
  const avatarRing = isDark ? 'ring-slate-900' : 'ring-white'
  const avatarFallback = isDark ? 'bg-slate-800 text-slate-200' : 'bg-indigo-100 text-indigo-700'
  const blobA = isDark ? 'bg-indigo-600/30' : 'bg-indigo-300/50'
  const blobB = isDark ? 'bg-fuchsia-600/20' : 'bg-sky-300/50'

  const btn =
    'inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium outline-none transition ' +
    'focus-visible:ring-4 focus-visible:ring-indigo-500/40'

  const cardInitial = cardStudent?.name ? cardStudent.name.trim().charAt(0).toUpperCase() : ''

  return (
    <div className="relative isolate mx-auto max-w-7xl px-4 py-10">
      {/* soft colour glows behind the cards */}
      <div className={`pointer-events-none absolute -left-6 top-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobA}`} />
      <div className={`pointer-events-none absolute -right-6 bottom-6 -z-10 h-72 w-72 rounded-full blur-3xl ${blobB}`} />

      {/* Title row */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-semibold tracking-tight ${heading}`}>Students</h1>
          <p className={`mt-1 text-sm ${muted}`} aria-live="polite">
            {loading
              ? 'Loading students…'
              : q
                ? `${visible.length} of ${total} students`
                : `${total} ${total === 1 ? 'student' : 'students'} enrolled`}
          </p>
        </div>

        <label className={`flex h-10 w-full items-center gap-2 rounded-2xl px-3.5 sm:w-72 ${searchBox}`}>
          <i className="fa-solid fa-magnifying-glass text-sm" aria-hidden="true"></i>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            aria-label="Search students"
            className={`w-full bg-transparent text-sm outline-none ${searchInput}`}
          />
        </label>
      </div>

      {/* Table card */}
      <section className={`overflow-hidden rounded-3xl ${panel}`}>
        <div className="max-h-[75vh] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full border-collapse text-left text-[0.925rem]">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    scope="col"
                    key={col}
                    className={`sticky top-0 z-10 whitespace-nowrap px-4 py-4 text-xs font-semibold tracking-wide ${thead}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading &&
                [0, 1, 2, 3, 4, 5].map((i) => (
                  <tr key={`sk-${i}`} aria-hidden="true">
                    <td colSpan={COLUMNS.length} className="px-4 py-3">
                      <div className={`h-5 animate-pulse rounded ${skeleton}`} />
                    </td>
                  </tr>
                ))}

              {!loading &&
                visible.map((students, index) => (
                  <tr
                    key={students._id || index}
                    className={`border-b transition last:border-0 ${rowText} ${rowLine} ${rowHover}
                                [&>*]:whitespace-nowrap [&>*]:px-4 [&>*]:py-3 [&>*]:align-middle
                                [&_img]:h-10 [&_img]:w-10 [&_img]:rounded-full [&_img]:object-cover
                                [&>*:nth-child(3)]:font-medium`}
                  >
                    <Tablelist
                      handleUpdate={handleUpdate}
                      handeldelete={handeldelete}
                      students={students}
                      index={index}
                      HandleQr={HandleQr}
                      handeldownload={handeldownload}
                    />
                  </tr>
                ))}

              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length}>
                    <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
                      <i
                        className={`text-3xl ${error ? `fa-solid fa-triangle-exclamation ${danger}` : `fa-solid fa-user-graduate ${accent}`
                          }`}
                        aria-hidden="true"
                      ></i>
                      <p className={`max-w-md text-sm ${muted}`}>
                        {error || (q ? `No students match “${query}”.` : 'No students have been added yet.')}
                      </p>
                      {q && !error && (
                        <button type="button" onClick={() => setQuery('')} className={`${btn} mt-2 ${ghost}`}>
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {/* Update Modal   */}
      {/* <button
        type="button"
        disabled={isSelf(admin)}
        onClick={() => !isSelf(admin) && openEdit(admin)}
      >
        <Editlist />
      </button> */}
      <Modal
        open={editStudent !== null}
        onClose={() => setEditStudent(null)}
        labelId="edit-title"
        panelClass={modalPanel}
        widthClass="max-w-lg"
      >
        {editStudent && (
          <Editlist
            key={editStudent._id}
            student={editStudent}
            isDark={isDark}
            showAlert={showAlert}
            onClose={() => setEditStudent(null)}
            onSaved={(updated) =>
              setMystudent((prev) => prev.map((s) => (s._id === updated._id ? updated : s)))
            }
          />
        )}
      </Modal>

      {/* QR code modal */}
      <Modal open={qrValue !== null} onClose={() => setQrValue(null)} labelId="qr-title" panelClass={modalPanel}>
        <div className="p-6 text-center">
          <h2 id="qr-title" className={`text-lg font-semibold ${heading}`}>Student QR code</h2>
          <p className={`mt-1 text-sm ${muted}`}>Scan this code to mark attendance.</p>
          {/* white tile keeps the code scannable in dark mode */}
          <div className="mx-auto mt-5 inline-block rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <QRCode value={qrValue || ''} size={200} fgColor="#000000" bgColor="#ffffff" />
          </div>
          <button type="button" autoFocus onClick={() => setQrValue(null)} className={`${btn} mt-6 w-full ${gradient} hover:brightness-110`}>
            Close
          </button>
        </div>
      </Modal>

      {/* ID card modal */}
      <Modal open={cardStudent !== null} onClose={() => setCardStudent(null)} labelId="idcard-title" panelClass={modalPanel}>
        {cardStudent && (
          <div>
            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 pb-14 pt-6 text-center text-white">
              <p className="text-sm font-medium text-indigo-100">College Name</p>
              <h2 id="idcard-title" className="text-lg font-semibold tracking-tight">ID Card</h2>
            </div>
            <div className="px-6 pb-6 text-center">
              <div
                className={`-mt-12 mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-4 ${avatarRing} ${avatarFallback}`}
              >
                {cardStudent.image ? (
                  <img src={cardStudent.image} alt={cardStudent.name || 'Student'} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-semibold">{cardInitial}</span>
                )}
              </div>
              <h3 className={`mt-4 text-xl font-semibold ${heading}`}>{cardStudent.name}</h3>

              <dl className={`mt-5 divide-y text-left text-sm ${divider}`}>
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className={muted}>Course</dt>
                  <dd className={`font-medium ${heading}`}>{cardStudent.currentedu}</dd>
                </div>
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className={muted}>Branch</dt>
                  <dd className={`font-medium ${heading}`}>{cardStudent.stdbranch}</dd>
                </div>
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className={muted}>Year</dt>
                  <dd className={`font-medium ${heading}`}>{cardStudent.currentyear}</dd>
                </div>
              </dl>

              <button type="button" autoFocus onClick={() => setCardStudent(null)} className={`${btn} mt-6 w-full ${gradient} hover:brightness-110`}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal open={deleteTarget !== null} onClose={() => !deleting && setDeleteTarget(null)} labelId="delete-title" panelClass={modalPanel}>
        <div className="p-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDark ? 'bg-red-500/15' : 'bg-red-50'}`}>
            <i className={`fa-solid fa-trash text-lg ${danger}`} aria-hidden="true"></i>
          </div>
          <h2 id="delete-title" className={`mt-4 text-lg font-semibold ${heading}`}>Delete this student?</h2>
          <p className={`mt-1 text-sm ${muted}`}>
            {deleteTarget?.name ? `${deleteTarget.name} will be removed permanently.` : 'This student will be removed permanently.'}{' '}
            This can’t be undone.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className={`${btn} ${ghost}`}>
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={confirmDelete}
              className={`${btn} bg-red-600 text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Studentlist