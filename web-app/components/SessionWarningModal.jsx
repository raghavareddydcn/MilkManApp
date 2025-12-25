import React from 'react'

const SessionWarningModal = ({ show, onDismiss, onLogout, minutesRemaining = 2 }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-900">
            Session Timeout Warning
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Your session will expire in <span className="font-semibold">{minutesRemaining} minutes</span> due to inactivity. 
          You will be automatically logged out for security reasons.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onDismiss}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Continue Session
          </button>
          <button
            onClick={onLogout}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Logout Now
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Any activity will automatically extend your session.
        </p>
      </div>
    </div>
  )
}

export default SessionWarningModal
