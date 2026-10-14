import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AttendancenSApi from '../ContextAPi/AttendanceSApi'
import Alert from './Alerts.js'

const Navbar = () => {
  const context = useContext(AttendancenSApi)
  const { ModeChange, bgcolor, images, showAlert, darkimg, Navimage } = context

  const location = useLocation()
  const navigate = useNavigate()
  const isDark = bgcolor === 'dark'

  const [menuOpen, setMenuOpen] = useState(false) // mobile links
  const [userOpen, setUserOpen] = useState(false) // profile dropdown
  const userRef = useRef(null)

  const loggedIn = !!localStorage.getItem('token')
  const onHome = location.pathname === '/'
  const atRootPage =
    location.pathname === '/admindata' || location.pathname === '/studentdata'

  // Close dropdown when clicking outside or when the route changes
  useEffect(() => {
    const onDown = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => {
    setUserOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.clear()
    setUserOpen(false)
    showAlert('Logout Successfully', 'success')
    navigate('/')
  }

  const handleBack = () => {
    if (!atRootPage) navigate(-1)
  }

  // ---- theme classes (written out in full so Tailwind can see them) ----
  const navBg = isDark
    ? 'bg-slate-900/90 border-slate-700 text-slate-100'
    : 'bg-white/90 border-slate-200 text-slate-800'
  const linkCls = isDark
    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  const iconBtn = isDark
    ? 'hover:bg-slate-800 focus-visible:ring-slate-500'
    : 'hover:bg-slate-100 focus-visible:ring-slate-400'
  const barBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
  const arrowBtn = isDark
    ? 'bg-slate-800 text-slate-100 hover:bg-slate-700 disabled:hover:bg-slate-800'
    : 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100 disabled:hover:bg-white'
  const menuCls = isDark
    ? 'bg-slate-800 border-slate-700 text-slate-100'
    : 'bg-white border-slate-200 text-slate-800'

  return (
    <>
      <nav
        className={`sticky top-0 z-40 border-b backdrop-blur ${navBg}`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            {Navimage && (
              <img src={Navimage} alt="" className="h-10 w-auto object-contain" />
            )}
            <span className="text-lg font-semibold tracking-tight">Attendance</span>
          </Link>

          {/* Desktop links */}
          {onHome && (
            <ul className="ml-6 hidden items-center gap-1 md:flex">
              <li>
                <Link
                  to="/"
                  aria-current="page"
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/more"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${linkCls}`}
                >
                  Future Scope Object
                </Link>
              </li>
            </ul>
          )}

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1">
            {/* Dark / light toggle */}
            <button
              type="button"
              onClick={ModeChange}
              aria-label="Toggle dark mode"
              className={`flex h-10 w-10 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 ${iconBtn}`}
            >
              <i className={darkimg?.text} style={{ color: darkimg?.type }} />
            </button>

            {/* Profile dropdown */}
            {loggedIn && (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                  aria-label="Account menu"
                  className={`flex h-10 w-10 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 ${iconBtn}`}
                >
                  <img src={images} alt="" className="h-5 w-5 object-contain" />
                </button>

                {userOpen && (
                  <div
                    role="menu"
                    className={`absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border py-1 shadow-lg ${menuCls}`}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                        isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button (only when there are links to show) */}
            {onHome && (
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
                className={`flex h-10 w-10 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 md:hidden ${iconBtn}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen ? (
                    <path d="M6 6l12 12M18 6L6 18" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile links */}
        {onHome && menuOpen && (
          <ul className="space-y-1 px-4 pb-3 md:hidden">
            <li>
              <Link to="/" className={`block rounded-lg px-3 py-2 text-sm font-medium ${linkCls}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/more" className={`block rounded-lg px-3 py-2 text-sm font-medium ${linkCls}`}>
                Future Scope Object
              </Link>
            </li>
          </ul>
        )}
      </nav>

      {/* Back / Alert / Forward bar */}
      <div className={`flex items-center gap-3 border-b px-4 py-2 ${barBg}`}>
        <button
          type="button"
          onClick={handleBack}
          disabled={onHome || atRootPage}
          aria-label="Go back"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${arrowBtn}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <Alert />
        </div>

        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Go forward"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${arrowBtn}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default Navbar