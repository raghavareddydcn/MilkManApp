-- Admin User Setup Script for MilkMan Application
-- Run this script to create/update admin users

-- Check current users and their roles
SELECT customerid, firstname, lastname, pphone, emailid, role, status
FROM milkman.customers
ORDER BY role DESC, customerid;

-- Add role column if it doesn't exist (should already exist)
-- ALTER TABLE milkman.customers ADD COLUMN IF NOT EXISTS role VARCHAR(50);

-- Option 1: Update an existing user to be admin
-- Replace 'CUST001' with the actual customer ID you want to make admin
UPDATE milkman.customers 
SET role = 'ADMIN'
WHERE customerid = 'CUST001';

-- Option 2: Update by phone number
-- UPDATE milkman.customers 
-- SET role = 'ADMIN'
-- WHERE pphone = '1234567890';

-- Option 3: Update by email
-- UPDATE milkman.customers 
-- SET role = 'ADMIN'
-- WHERE emailid = 'user@example.com';

-- Option 4: Set all regular users to 'USER' role (if they have NULL)
UPDATE milkman.customers 
SET role = 'USER'
WHERE role IS NULL;

-- Verify the changes
SELECT customerid, firstname, lastname, pphone, emailid, role, status
FROM milkman.customers
WHERE role = 'ADMIN';

-- Sample admin user insert (if needed)
-- NOTE: You'll need to encrypt the auth_pin using the application's encryption
-- For testing, you can copy the auth_pin from an existing user
/*
INSERT INTO milkman.customers (
    customerid, 
    firstname, 
    lastname, 
    pphone, 
    sphone,
    emailid, 
    auth_pin, 
    role, 
    status,
    createdby,
    createdtime,
    address,
    pincode
) VALUES (
    'ADMIN001',
    'Admin',
    'User',
    '9999999999',
    NULL,
    'admin@milkman.com',
    'COPY_ENCRYPTED_PIN_FROM_EXISTING_USER', -- Replace with encrypted PIN
    'ADMIN',
    'ACTIVE',
    'SYSTEM',
    CURRENT_TIMESTAMP,
    'Admin Office',
    '000000'
);
*/

-- Quick check: Count users by role
SELECT role, COUNT(*) as user_count
FROM milkman.customers
GROUP BY role;
