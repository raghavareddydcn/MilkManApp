# Session Management Testing Guide

## Changes Implemented

All authentication data now uses **sessionStorage** instead of localStorage:
- JWT access token
- JWT refresh token  
- User data (customerId, customerName, role)
- Last activity timestamp

## Expected Behavior

### ✅ Session Ends When:
1. **Browser closes** - All tabs closed
2. **Tab closes** - Individual tab closed
3. **Browser crashes** - Unexpected close

### ✅ Session Persists During:
1. **Page refresh** (F5 or Ctrl+R)
2. **Navigate between pages** within the app
3. **Open new tabs** to other sites (original tab keeps session)

## Testing Steps

### Test 1: Browser Close Clears Session
1. Login to the app at http://localhost:3001
2. Verify you can access protected pages (orders, subscriptions)
3. **Close all browser windows**
4. Reopen browser and go to http://localhost:3001
5. **Expected**: Redirected to login page

### Test 2: Tab Close Clears Session
1. Login to the app in Tab 1
2. Open a new tab (Tab 2) and go to http://localhost:3001
3. **Expected**: Tab 2 shows login page (session not shared between tabs)
4. Close Tab 1
5. Refresh Tab 2
6. **Expected**: Still shows login page

### Test 3: Page Refresh Preserves Session
1. Login to the app
2. Navigate to Orders or Subscriptions page
3. **Press F5 or Ctrl+R to refresh**
4. **Expected**: Still logged in, page content loads

### Test 4: Navigation Preserves Session
1. Login to the app
2. Click through different pages: Home → Orders → Subscriptions → Profile
3. **Expected**: Session persists, no need to re-login

### Test 5: Token Refresh Works
1. Login to the app
2. Wait for 20-25 minutes (access token expires in 30 min)
3. Make an API call (create order, view subscriptions)
4. **Expected**: Token refreshes automatically in sessionStorage, request succeeds

## Technical Details

### Files Modified:
- `web-app/src/context/AuthContext.jsx` - Login/logout using sessionStorage
- `web-app/src/services/api.js` - Token retrieval/storage using sessionStorage
- `web-app/src/hooks/useSessionCleanup.js` - Simplified (sessionStorage auto-clears)

### Storage Keys:
- `sessionStorage.token` - JWT access token
- `sessionStorage.refreshToken` - JWT refresh token
- `sessionStorage.user` - JSON string with user data
- `sessionStorage.lastActivity` - Timestamp (if activity tracking enabled)

### Browser DevTools Check:
1. Open DevTools (F12)
2. Go to **Application** → **Session Storage** → http://localhost:3001
3. After login: Should see `token`, `refreshToken`, `user` keys
4. Close tab and reopen: Session Storage should be **empty**

## Difference from Previous Behavior

| Scenario | Before (localStorage) | Now (sessionStorage) |
|----------|---------------------|---------------------|
| Close browser | Session persists | ✅ Session cleared |
| Close tab | Session persists | ✅ Session cleared |
| Page refresh | Session persists | Session persists |
| New tab same site | Shares session | ✅ Separate session |
| Expires in | 7 days (refresh token) | Browser close |

## Troubleshooting

### Issue: Still logged in after browser close
- **Cause**: Browser might have session restore enabled
- **Solution**: Use Incognito/Private mode for testing

### Issue: Logged out after page refresh
- **Cause**: sessionStorage not properly set
- **Check**: DevTools → Console for errors during login
- **Verify**: sessionStorage keys exist after successful login

### Issue: Token refresh fails
- **Cause**: Refresh token not found in sessionStorage
- **Check**: Console logs showing "No token found in sessionStorage"
- **Solution**: Ensure backend is running and returns valid tokens

## Security Improvements

✅ **Better security**: Session ends when user closes browser (can't be hijacked later)  
✅ **Tab isolation**: Each tab has its own session (prevents cross-tab attacks)  
✅ **No persistent storage**: Tokens don't survive browser crash/close  
✅ **Simpler cleanup**: Browser handles cleanup automatically  

## Notes

- Users must login each time they open the browser (enhanced security)
- Multiple tabs require separate logins (tab isolation)
- Session timeout (30 min inactivity) still works if enabled in AuthContext
- Refresh token logic still functions, but expires on browser close
