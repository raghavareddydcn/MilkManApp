import { useEffect, useState, useCallback } from 'react'

/**
 * Hook to handle session timeout with warning
 * @param {number} timeoutMinutes - Minutes until auto-logout (default 30)
 * @param {number} warningMinutes - Minutes before timeout to show warning (default 2)
 * @param {function} onTimeout - Callback when session times out
 * @param {function} onWarning - Callback when warning should be shown
 * @param {boolean} enabled - Whether the timeout is active
 */
export const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 2,
  onTimeout,
  onWarning,
  enabled = true
}) => {
  const [showWarning, setShowWarning] = useState(false)
  const [timeoutId, setTimeoutId] = useState(null)
  const [warningTimeoutId, setWarningTimeoutId] = useState(null)

  const TIMEOUT_MS = timeoutMinutes * 60 * 1000
  const WARNING_MS = (timeoutMinutes - warningMinutes) * 60 * 1000

  const clearTimers = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    if (warningTimeoutId) {
      clearTimeout(warningTimeoutId)
      setWarningTimeoutId(null)
    }
    setShowWarning(false)
  }, [timeoutId, warningTimeoutId])

  const resetTimer = useCallback(() => {
    if (!enabled) return

    clearTimers()

    // Set warning timer
    const warningTimer = setTimeout(() => {
      setShowWarning(true)
      if (onWarning) {
        onWarning()
      }
    }, WARNING_MS)

    // Set logout timer
    const logoutTimer = setTimeout(() => {
      if (onTimeout) {
        onTimeout()
      }
    }, TIMEOUT_MS)

    setWarningTimeoutId(warningTimer)
    setTimeoutId(logoutTimer)
  }, [enabled, TIMEOUT_MS, WARNING_MS, onTimeout, onWarning, clearTimers])

  const dismissWarning = useCallback(() => {
    setShowWarning(false)
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    if (enabled) {
      resetTimer()
    } else {
      clearTimers()
    }

    return () => {
      clearTimers()
    }
  }, [enabled, resetTimer, clearTimers])

  return {
    showWarning,
    dismissWarning,
    resetTimer,
    clearTimers
  }
}
