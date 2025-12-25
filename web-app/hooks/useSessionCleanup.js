import { useEffect } from 'react'

/**
 * Hook to handle session cleanup when browser/tab closes
 * @param {boolean} clearOnClose - Whether to clear session on browser close
 */
export const useSessionCleanup = (clearOnClose = true) => {
  useEffect(() => {
    if (!clearOnClose) return

    const handleBeforeUnload = (e) => {
      // Clear session storage
      sessionStorage.clear()
      
      // Check if this is a page refresh or actual close
      // We keep localStorage for remember me functionality
      // but could add logic here to handle "remember me" preferences
      
      // Note: Modern browsers don't show custom messages anymore
      // but the handler is still needed for cleanup
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Save last activity time when user switches tabs
        localStorage.setItem('lastActivity', Date.now().toString())
      } else if (document.visibilityState === 'visible') {
        // Check if session should be invalidated when returning
        const lastActivity = localStorage.getItem('lastActivity')
        if (lastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
          const thirtyMinutes = 30 * 60 * 1000
          
          // If more than 30 minutes have passed, session should be considered expired
          if (timeSinceLastActivity > thirtyMinutes) {
            localStorage.setItem('sessionExpired', 'true')
          }
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [clearOnClose])
}
