import { useEffect } from 'react'

/**
 * Hook to handle session cleanup when browser/tab closes
 * Since we're using sessionStorage, it automatically clears on browser close.
 * This hook is kept for potential future enhancements.
 * @param {boolean} clearOnClose - Whether to clear session on browser close
 */
export const useSessionCleanup = (clearOnClose = true) => {
  useEffect(() => {
    if (!clearOnClose) return

    const handleBeforeUnload = () => {
      // sessionStorage automatically clears when browser/tab closes
      // No additional cleanup needed
      console.log('Browser/tab closing - sessionStorage will be cleared automatically')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [clearOnClose])
}
