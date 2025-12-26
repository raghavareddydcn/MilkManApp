# Testing Guide - MilkMan Customer Features

## 🔧 Changes Made

### 1. Fixed Profile Page ✅
**Issue:** Profile was failing to load with "Unauthorized" error
**Root Cause:** Used `/customer/getAll` endpoint which requires ADMIN role
**Fix:** Changed to use `/customer/{customerId}` endpoint which is accessible to all authenticated users
**File:** [web-app/src/pages/Profile.jsx](web-app/src/pages/Profile.jsx)

### 2. Created Debug UI ✅
**Location:** [http://localhost:3001/debug.html](http://localhost:3001/debug.html)
**Features:**
- Test login with any phone/PIN combination
- View authentication response including role
- Display localStorage contents
- Quick test buttons for all API endpoints
- Pretty formatting with status indicators

## 🧪 Testing Instructions

### Step 1: Test with Debug UI

1. **Open Debug Page:**
   ```
   http://localhost:3001/debug.html
   ```

2. **Test Customer Login:**
   - Phone: `9876543210`
   - PIN: `admin`
   - Click "🔐 Login"
   - Verify you see:
     - Customer ID: CUST001
     - Role: USER
     - Token displayed

3. **Test Admin Login:**
   - Phone: `9566085621` (or admin phone from DB)
   - PIN: `admin`
   - Click "🔐 Login"
   - Verify Role: ADMIN

4. **Test API Endpoints (while logged in as customer):**
   - Click "Get Customer Profile" → Should show CUST001 details
   - Click "Get Products" → Should show 4 products
   - Click "Get Orders" → Should show all orders
   - Click "Get All Customers (Admin)" → Should fail for USER role ✅

### Step 2: Test Customer Web UI

1. **Login:**
   ```
   http://localhost:3001
   ```
   - Phone: `9876543210`
   - PIN: `admin`

2. **Test Dashboard:**
   - Should show "Welcome back, John!" (or customer name)
   - Should show quick stats
   - Should have navigation to Products, Orders, Subscriptions, Profile

3. **Test Profile Page:**
   - Click "Profile" in navigation
   - Should show:
     - First Name: John
     - Last Name: Doe
     - Phone: 9876543210
     - Email: john.doe@example.com
     - Address: 123 Main Street, Apartment 4B
   - Click "Edit Profile" button
   - Make changes
   - Click "Save Changes"
   - Verify success message

4. **Test Order Products:**
   - Click "Products" in navigation
   - Should see 4 products (Full Cream, Toned, Skimmed, Buffalo Milk)
   - Click "Add to Cart" on any product
   - Adjust quantity using +/- buttons
   - Should see cart summary at top
   - Click "Place Order"
   - Should redirect to Orders page

5. **Test View Orders:**
   - Click "Orders" in navigation
   - Should show list of orders with:
     - Order ID
     - Date
     - Total amount
     - Status
     - Products ordered

6. **Test Subscriptions:**
   - Click "Subscriptions" in navigation
   - Should show active subscriptions
   - Click "Create Subscription" button
   - Fill in:
     - Select products
     - Choose delivery days (Mon, Wed, Fri, etc.)
     - Select time slot (Morning/Evening)
   - Click "Create Subscription"
   - Should show success message

## 🐛 Known Issues

### Issue: "customer drop and nothing is selected"
**Status:** Unclear what this refers to
**Possibilities:**
1. Might be in admin page trying to select customer for order creation
2. Might be a validation message from backend
3. Might be console error

**To Debug:**
1. Open browser console (F12)
2. Look for error messages
3. Try the action that causes this error
4. Share the console logs

### API Endpoint Structure

**Customer Endpoints:**
```
GET /milkman/customer/{customerId} - ✅ Accessible by USER
GET /milkman/customer/getAll - ❌ ADMIN only
POST /milkman/customer/authenticate - Public
PUT /milkman/customer/update - ✅ Accessible by USER
```

**Product Endpoints:**
```
GET /milkman/product/getProducts - ✅ Accessible by all
POST /milkman/product/add - ❌ ADMIN only
```

**Order Endpoints:**
```
GET /milkman/order/getAllOrders - ✅ Accessible by all (filter on frontend)
POST /milkman/order/add - ✅ Accessible by USER
```

**Subscription Endpoints:**
```
GET /milkman/subscribe/getAllSubscriptions - ✅ Accessible by all
POST /milkman/subscribe/add - ✅ Accessible by USER
```

## 📝 API Request Format

### Create Order
```json
{
  "customerId": "CUST001",
  "productOrderReqs": [
    {"productId": "PROD001", "quantity": 2},
    {"productId": "PROD002", "quantity": 1}
  ],
  "deliveryDate": "2025-12-26",
  "deliveryTimeSlot": "MORNING",
  "orderStatus": "PENDING",
  "deliveryCharge": 0
}
```

### Create Subscription
```json
{
  "customerId": "CUST001",
  "productOrderReqs": [
    {"productId": "PROD001", "quantity": 1}
  ],
  "deliveryDays": "MON,WED,FRI",
  "deliveryTimeSlot": "MORNING",
  "orderStatus": "ACTIVE"
}
```

## 🔍 Debugging Tips

### Check Browser Console
```
F12 → Console tab
```
Look for:
- 👤 Profile messages
- 🛒 Order messages  
- 📦 API response logs
- ❌ Error messages

### Check Backend Logs
```powershell
docker logs milkman-app --tail 50
```
Look for:
- Authentication attempts
- Role authorization warnings
- Order/subscription creation logs
- Any ERROR or WARN messages

### Check localStorage
Open debug.html and click "🔄 Refresh LocalStorage" to see:
- Token
- Refresh token
- User details (customerId, customerName, role)
- Session tracking data

## 📊 Test Users

| Phone | PIN | Role | Customer ID | Name |
|-------|-----|------|-------------|------|
| 9876543210 | admin | USER | CUST001 | John Doe |
| 9566085621 | admin | ADMIN | CUST007 | Vijitha E |

## ✅ Testing Checklist

- [ ] Debug UI shows login response correctly
- [ ] Profile page loads customer details
- [ ] Profile edit and save works
- [ ] Products page shows all products
- [ ] Add to cart functionality works
- [ ] Order placement succeeds
- [ ] Orders page shows order history
- [ ] Subscription creation works
- [ ] Subscriptions page shows active subscriptions
- [ ] Admin/Customer roles route correctly

## 🆘 If Something Doesn't Work

1. **Check browser console** for error messages
2. **Open debug.html** and test the specific API endpoint
3. **Check backend logs** with `docker logs milkman-app --tail 50`
4. **Verify you're logged in** with the correct role
5. **Clear localStorage** and login again
6. **Share the error message** so I can help fix it

## 🎯 Next Steps

After testing, please report:
1. Which features work ✅
2. Which features fail ❌
3. Any error messages from console
4. What "customer drop and nothing is selected" refers to

The more specific information you provide, the faster I can fix any remaining issues!
