# MilkMan Admin/User Testing Guide

## What Was Fixed

### 1. **Role-Based Authentication**
   - Backend returns `role` field in authentication response
   - Frontend now stores and uses `role` from backend
   - Admin detection changed from hardcoded IDs to dynamic `role === 'ADMIN'`

### 2. **Protected Routes**
   - Created `AdminRoute` component for admin-only pages
   - Customers page now restricted to admins only
   - Non-admins redirected to home page if they try to access admin pages

### 3. **Token Refresh**
   - Token refresh now maintains user role information
   - User data stays consistent across token refreshes

## Database Setup - Creating Admin User

You need to manually set a user as admin in the database:

```sql
-- Connect to PostgreSQL
psql -h localhost -p 5433 -U postgres -d milkman

-- Update an existing user to be admin
UPDATE milkman.customers 
SET role = 'ADMIN' 
WHERE customerid = 'YOUR_CUSTOMER_ID';

-- OR create a new admin user
INSERT INTO milkman.customers (
    customerid, firstname, lastname, pphone, emailid, auth_pin, role, status
) VALUES (
    'ADMIN001', 'Admin', 'User', '9999999999', 'admin@milkman.com', 
    'ENCRYPTED_PIN_HERE', 'ADMIN', 'ACTIVE'
);
```

## Testing Instructions

### Test 1: Admin User Login
1. Start the application: `docker-compose up -d`
2. Navigate to `http://localhost:3001`
3. Login with admin credentials (user with `role = 'ADMIN'`)
4. **Expected Results:**
   - Redirected to **Admin Dashboard**
   - See "Admin Dashboard" title
   - Navigation shows "Customers" link
   - Can access `/customers` page
   - Stats show: Total Customers, Products, Active Orders, Subscriptions

### Test 2: Regular User Login
1. Login with regular user credentials (user with `role = 'USER'` or no role)
2. **Expected Results:**
   - Redirected to **User Home**
   - See "Welcome back, [Name]!" message
   - Navigation shows "Profile" link (not "Customers")
   - Stats show: My Orders, Subscriptions
   - Cannot access `/customers` (redirected to home if attempted)

### Test 3: Navigation Menu Differences

**Admin User Should See:**
- Home
- Customers ✓
- Products
- Orders
- Subscriptions

**Regular User Should See:**
- Home
- Profile ✓
- Products
- Orders
- Subscriptions

### Test 4: Token Refresh Maintains Role
1. Login as admin
2. Wait for session (or trigger token refresh)
3. **Expected:** Still recognized as admin after token refresh

### Test 5: Direct URL Access Protection
1. Login as regular user
2. Try to access `http://localhost:3001/customers` directly
3. **Expected:** Redirected back to home page

## Quick Test Commands

### Check User Roles in Database
```sql
SELECT customerid, firstname, lastname, role 
FROM milkman.customers 
WHERE role IS NOT NULL;
```

### Update Existing User to Admin
```sql
UPDATE milkman.customers 
SET role = 'ADMIN' 
WHERE pphone = '1234567890';  -- Replace with actual phone number
```

### Check JWT Token Role
Open browser console after login and run:
```javascript
// Decode JWT to see role
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Role in token:', payload.role);

// Check stored user data
const user = JSON.parse(localStorage.getItem('user'));
console.log('User data:', user);
```

## Troubleshooting

### Issue: All users see admin dashboard
- **Check:** User data in localStorage has `role` field
- **Fix:** Clear localStorage and login again

### Issue: Admin can't access customers page
- **Check:** Database has `role = 'ADMIN'` for that user
- **Fix:** Update database role field

### Issue: Navigation doesn't update
- **Check:** Browser console for errors
- **Fix:** Hard refresh (Ctrl+Shift+R) or clear cache

## Component Changes Summary

1. **AuthContext.jsx**
   - Stores `role` from authentication response
   - `isAdmin()` checks `user.role === 'ADMIN'`

2. **api.js**
   - Token refresh maintains role in user data

3. **AdminRoute.jsx** (NEW)
   - Protects admin-only routes
   - Redirects non-admins to home

4. **App.jsx**
   - Uses `AdminRoute` for `/customers` page
   - Proper route protection

5. **Layout.jsx**
   - Shows different nav items based on admin status

## Expected Behavior

| Feature | Admin | User |
|---------|-------|------|
| Home Page | AdminHome | UserHome |
| Can view all customers | ✓ | ✗ |
| Can view products | ✓ | ✓ |
| Can view own orders | ✓ | ✓ |
| Can view own subscriptions | ✓ | ✓ |
| Can view own profile | ✓ | ✓ |
| "Customers" in nav | ✓ | ✗ |
| "Profile" in nav | ✗ | ✓ |

## Quick Verification Script

Run in browser console after login:
```javascript
const verify = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const payload = JSON.parse(atob(token.split('.')[1]));
  
  console.log('=== Role Verification ===');
  console.log('User data:', user);
  console.log('Role in user:', user?.role);
  console.log('Role in token:', payload.role);
  console.log('Is Admin:', user?.role === 'ADMIN');
  console.log('========================');
};
verify();
```

## Success Criteria

- ✅ Admin users see AdminHome dashboard
- ✅ Regular users see UserHome dashboard
- ✅ Admin can access /customers page
- ✅ Regular user redirected from /customers
- ✅ Navigation menu shows correct items per role
- ✅ Role persists through token refresh
- ✅ Role stored in JWT and localStorage
