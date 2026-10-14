import React, { useContext } from 'react'
import AttendancenSApi from '../ContextAPi/AttendanceSApi'

const icons = {
  success: <path d="M5 13l4 4L19 7" />,
  danger: <path d="M12 8v5m0 3.5v.01M10.3 4.2L2.6 17.5A2 2 0 004.3 20.5h15.4a2 2 0 001.7-3L13.7 4.2a2 2 0 00-3.4 0z" />,
  warning: <path d="M12 8v5m0 3.5v.01M10.3 4.2L2.6 17.5A2 2 0 004.3 20.5h15.4a2 2 0 001.7-3L13.7 4.2a2 2 0 00-3.4 0z" />,
  info: <path d="M12 11v5m0-8.5v.01M12 21a9 9 0 100-18 9 9 0 000 18z" />,
}

// Full class strings so Tailwind can detect them
const styles = {
  light: {
    success: 'bg-green-50 text-green-800 ring-green-200',
    danger: 'bg-red-50 text-red-800 ring-red-200',
    warning: 'bg-amber-50 text-amber-800 ring-amber-200',
    info: 'bg-blue-50 text-blue-800 ring-blue-200',
  },
  dark: {
    success: 'bg-green-500/10 text-green-300 ring-green-500/30',
    danger: 'bg-red-500/10 text-red-300 ring-red-500/30',
    warning: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
    info: 'bg-blue-500/10 text-blue-300 ring-blue-500/30',
  },
}

const Alerts = () => {
  const context = useContext(AttendancenSApi)
  const { alert, bgcolor } = context

  const theme = bgcolor === 'dark' ? styles.dark : styles.light
  const type = theme[alert?.type] ? alert.type : 'info'

  return (
    // Fixed-height wrapper so the page doesn't jump when an alert appears
    <div className="flex min-h-[2.75rem] items-center justify-center" aria-live="polite">
      {alert?.msg && (
        <div
          role="alert"
          className={`flex w-full max-w-xl items-center gap-2.5 rounded-xl px-4 py-2 text-sm font-medium shadow-sm ring-1 ${theme[type]}`}
        >
          <svg
            className="h-5 w-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {icons[type]}
          </svg>
          <span className="min-w-0 flex-1 break-words">{alert.msg}</span>
        </div>
      )}
    </div>
  )
}

export default Alerts