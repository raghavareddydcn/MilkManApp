import { useEffect, useRef } from 'react'

/**
 * Hook to track user activity (mouse, keyboard, touch events)
 * Returns the last activity timestamp
 */
export const useActivityTracker = (onActivity) => {
  const lastActivityRef = useRef(Date.now())

  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now()
      if (onActivity) {
        onActivity()
      }
    }

    // Track various user interactions
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'wheel'
    ]

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, updateActivity, true)
    })

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity, true)
      })
    }
  }, [onActivity])

  return lastActivityRef
}
