-- MilkMan Test Data Script
-- All customer passwords are: admin (encrypted: qLW4HhIq71oAvgWWYfv8ew==)
-- This script inserts comprehensive test data for all controllers

SET search_path TO milkman;

-- Clean existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM milkman.product_subscriptions;
-- DELETE FROM milkman.product_orders;
-- DELETE FROM milkman.subscriptions;
-- DELETE FROM milkman.orders;
-- DELETE FROM milkman.customers;
-- DELETE FROM milkman.products;

-- ========================================
-- 1. CUSTOMERS TEST DATA (CustomerController)
-- ========================================
-- All passwords are 'admin' (encrypted)
INSERT INTO milkman.customers (
    customerid, firstname, lastname, pphone, sphone, emailid, dob, 
    auth_pin, address, landmark, pincode, status, 
    createdby, createdtime, updatedby, updatedtime
) VALUES 
-- Customer 1: John Doe
('CUST001', 'John', 'Doe', '9876543210', '9876543211', 'john.doe@example.com', 
 '1990-05-15', 'qLW4HhIq71oAvgWWYfv8ew==', 
 '123 Main Street, Apartment 4B', 'Near Central Mall', '560001', 'ACTIVE',
 'system', NOW(), 'system', NOW()),

-- Customer 2: Jane Smith
('CUST002', 'Jane', 'Smith', '9876543212', '9876543213', 'jane.smith@example.com',
 '1985-08-22', 'qLW4HhIq71oAvgWWYfv8ew==',
 '456 Park Avenue, Building C', 'Opposite City Hospital', '560002', 'ACTIVE',
 'system', NOW(), 'system', NOW()),

-- Customer 3: Robert Johnson
('CUST003', 'Robert', 'Johnson', '9876543214', '9876543215', 'robert.j@example.com',
 '1992-03-10', 'qLW4HhIq71oAvgWWYfv8ew==',
 '789 Lake View Road, Villa 12', 'Behind Police Station', '560003', 'ACTIVE',
 'system', NOW(), 'system', NOW()),

-- Customer 4: Maria Garcia
('CUST004', 'Maria', 'Garcia', '9876543216', '9876543217', 'maria.garcia@example.com',
 '1988-11-30', 'qLW4HhIq71oAvgWWYfv8ew==',
 '321 Garden Street, House 5', 'Near School', '560004', 'ACTIVE',
 'system', NOW(), 'system', NOW()),

-- Customer 5: David Lee
('CUST005', 'David', 'Lee', '9876543218', '9876543219', 'david.lee@example.com',
 '1995-07-18', 'qLW4HhIq71oAvgWWYfv8ew==',
 '654 Beach Road, Flat 8A', 'Next to Temple', '560005', 'ACTIVE',
 'system', NOW(), 'system', NOW()),

-- Customer 6: Sarah Wilson (Inactive for testing)
('CUST006', 'Sarah', 'Wilson', '9876543220', '9876543221', 'sarah.w@example.com',
 '1993-02-14', 'qLW4HhIq71oAvgWWYfv8ew==',
 '987 Hill Station, Tower B', 'Above Supermarket', '560006', 'INACTIVE',
 'system', NOW(), 'system', NOW())

ON CONFLICT (customerid) DO NOTHING;

-- ========================================
-- 2. PRODUCTS TEST DATA (ProductController)
-- ========================================
INSERT INTO milkman.products (
    productid, productname, productdescription, productprice, 
    status, createdby, createdtime, updatedby, updatedtime
) VALUES 
-- Existing products (updated descriptions)
('PROD001', 'Full Cream Milk 1L', 'Fresh full cream milk delivered daily - Rich and creamy', 45.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW()),

('PROD002', 'Toned Milk 1L', 'Healthy toned milk - Perfect balance of taste and health', 40.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW()),

('PROD003', 'Skimmed Milk 1L', 'Low fat skimmed milk - Ideal for fitness enthusiasts', 42.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW()),

('PROD004', 'Buffalo Milk 1L', 'Rich buffalo milk - High fat content for traditional recipes', 55.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW()),

-- Additional products
('PROD005', 'Full Cream Milk 500ml', 'Half liter full cream milk', 25.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW()),

('PROD006', 'Organic Milk 1L', 'Certified organic farm fresh milk', 65.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW()),

('PROD007', 'Flavored Milk 200ml - Chocolate', 'Kids favorite chocolate milk', 20.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW()),

('PROD008', 'Flavored Milk 200ml - Strawberry', 'Delicious strawberry flavored milk', 20.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW()),

('PROD009', 'Paneer 250g', 'Fresh homemade paneer', 80.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW()),

('PROD010', 'Curd 500ml', 'Fresh curd made from full cream milk', 30.00, 
 'ACTIVE', 'system', NOW(), 'system', NOW())

ON CONFLICT (productid) DO UPDATE SET
    productname = EXCLUDED.productname,
    productdescription = EXCLUDED.productdescription,
    productprice = EXCLUDED.productprice,
    updatedby = EXCLUDED.updatedby,
    updatedtime = EXCLUDED.updatedtime;

-- ========================================
-- 3. ORDERS TEST DATA (OrderController)
-- ========================================
INSERT INTO milkman.orders (
    orderid, customerid, customername, pphone, emailid, address, pincode, landmark,
    orderdatetime, deliverydate, deliverytimeslot, deliveryfrequency, orderstatus,
    deliverycharge, ordertotal, status, createdby, createdtime, updatedby, updatedtime
) VALUES 
-- Order 1: John's morning delivery
('ORD001', 'CUST001', 'John Doe', '9876543210', 'john.doe@example.com',
 '123 Main Street, Apartment 4B', '560001', 'Near Central Mall',
 NOW() - INTERVAL '5 days', CURRENT_DATE + INTERVAL '1 day', 'Morning (6AM-8AM)', 'One-time',
 'ORDER PLACED', 20.00, 135.00, 'ACTIVE', 'CUST001', NOW(), 'CUST001', NOW()),

-- Order 2: Jane's evening delivery (in progress)
('ORD002', 'CUST002', 'Jane Smith', '9876543212', 'jane.smith@example.com',
 '456 Park Avenue, Building C', '560002', 'Opposite City Hospital',
 NOW() - INTERVAL '3 days', CURRENT_DATE, 'Evening (5PM-7PM)', 'One-time',
 'IN PROGRESS', 20.00, 165.00, 'ACTIVE', 'CUST002', NOW(), 'CUST002', NOW()),

-- Order 3: Robert's delivered order
('ORD003', 'CUST003', 'Robert Johnson', '9876543214', 'robert.j@example.com',
 '789 Lake View Road, Villa 12', '560003', 'Behind Police Station',
 NOW() - INTERVAL '7 days', CURRENT_DATE - INTERVAL '2 days', 'Morning (6AM-8AM)', 'One-time',
 'DELIVERED', 20.00, 225.00, 'ACTIVE', 'CUST003', NOW(), 'CUST003', NOW()),

-- Order 4: Maria's urgent order
('ORD004', 'CUST004', 'Maria Garcia', '9876543216', 'maria.garcia@example.com',
 '321 Garden Street, House 5', '560004', 'Near School',
 NOW() - INTERVAL '1 day', CURRENT_DATE, 'Afternoon (12PM-2PM)', 'One-time',
 'ORDER PLACED', 20.00, 180.00, 'ACTIVE', 'CUST004', NOW(), 'CUST004', NOW()),

-- Order 5: David's weekend order
('ORD005', 'CUST005', 'David Lee', '9876543218', 'david.lee@example.com',
 '654 Beach Road, Flat 8A', '560005', 'Next to Temple',
 NOW() - INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days', 'Morning (6AM-8AM)', 'One-time',
 'ORDER PLACED', 20.00, 150.00, 'ACTIVE', 'CUST005', NOW(), 'CUST005', NOW())

ON CONFLICT (orderid) DO NOTHING;

-- ========================================
-- 4. PRODUCT ORDERS (Order Items)
-- ========================================
INSERT INTO milkman.product_orders (
    product_order_id, orderid, productid, productname, productprice, quantity,
    status, createdby, createdtime, updatedby, updatedtime
) VALUES 
-- ORD001 items (John's order)
('PO001', 'ORD001', 'PROD001', 'Full Cream Milk 1L', 45.00, 2, 'ACTIVE', 'CUST001', NOW(), 'CUST001', NOW()),
('PO002', 'ORD001', 'PROD010', 'Curd 500ml', 30.00, 1, 'ACTIVE', 'CUST001', NOW(), 'CUST001', NOW()),
('PO003', 'ORD001', 'PROD005', 'Full Cream Milk 500ml', 25.00, 1, 'ACTIVE', 'CUST001', NOW(), 'CUST001', NOW()),

-- ORD002 items (Jane's order)
('PO004', 'ORD002', 'PROD002', 'Toned Milk 1L', 40.00, 2, 'ACTIVE', 'CUST002', NOW(), 'CUST002', NOW()),
('PO005', 'ORD002', 'PROD006', 'Organic Milk 1L', 65.00, 1, 'ACTIVE', 'CUST002', NOW(), 'CUST002', NOW()),
('PO006', 'ORD002', 'PROD007', 'Flavored Milk 200ml - Chocolate', 20.00, 2, 'ACTIVE', 'CUST002', NOW(), 'CUST002', NOW()),

-- ORD003 items (Robert's order)
('PO007', 'ORD003', 'PROD004', 'Buffalo Milk 1L', 55.00, 3, 'ACTIVE', 'CUST003', NOW(), 'CUST003', NOW()),
('PO008', 'ORD003', 'PROD009', 'Paneer 250g', 80.00, 1, 'ACTIVE', 'CUST003', NOW(), 'CUST003', NOW()),
('PO009', 'ORD003', 'PROD010', 'Curd 500ml', 30.00, 1, 'ACTIVE', 'CUST003', NOW(), 'CUST003', NOW()),

-- ORD004 items (Maria's order)
('PO010', 'ORD004', 'PROD001', 'Full Cream Milk 1L', 45.00, 2, 'ACTIVE', 'CUST004', NOW(), 'CUST004', NOW()),
('PO011', 'ORD004', 'PROD003', 'Skimmed Milk 1L', 42.00, 2, 'ACTIVE', 'CUST004', NOW(), 'CUST004', NOW()),
('PO012', 'ORD004', 'PROD008', 'Flavored Milk 200ml - Strawberry', 20.00, 2, 'ACTIVE', 'CUST004', NOW(), 'CUST004', NOW()),

-- ORD005 items (David's order)
('PO013', 'ORD005', 'PROD006', 'Organic Milk 1L', 65.00, 2, 'ACTIVE', 'CUST005', NOW(), 'CUST005', NOW()),
('PO014', 'ORD005', 'PROD007', 'Flavored Milk 200ml - Chocolate', 20.00, 1, 'ACTIVE', 'CUST005', NOW(), 'CUST005', NOW())

ON CONFLICT DO NOTHING;

-- ========================================
-- 5. SUBSCRIPTIONS TEST DATA (SubscribeController)
-- ========================================
INSERT INTO milkman.subscriptions (
    subscriptionid, customerid, customername, pphone, emailid, address, pincode, landmark,
    orderdatetime, deliverystartdate, deliveryenddate, deliverytimeslot, deliveryfrequency,
    deliverydays, orderstatus, deliverycharge, ordertotal, status,
    createdby, createdtime, updatedby, updatedtime
) VALUES 
-- Subscription 1: John's daily morning milk
('SUB001', 'CUST001', 'John Doe', '9876543210', 'john.doe@example.com',
 '123 Main Street, Apartment 4B', '560001', 'Near Central Mall',
 NOW() - INTERVAL '10 days', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days',
 'Morning (6AM-8AM)', 'Daily', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
 'IN PROGRESS', 0.00, 1350.00, 'ACTIVE',
 'CUST001', NOW(), 'CUST001', NOW()),

-- Subscription 2: Jane's alternate day subscription
('SUB002', 'CUST002', 'Jane Smith', '9876543212', 'jane.smith@example.com',
 '456 Park Avenue, Building C', '560002', 'Opposite City Hospital',
 NOW() - INTERVAL '15 days', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days',
 'Evening (5PM-7PM)', 'Alternate Days', 'Mon,Wed,Fri',
 'IN PROGRESS', 0.00, 720.00, 'ACTIVE',
 'CUST002', NOW(), 'CUST002', NOW()),

-- Subscription 3: Robert's weekend only subscription
('SUB003', 'CUST003', 'Robert Johnson', '9876543214', 'robert.j@example.com',
 '789 Lake View Road, Villa 12', '560003', 'Behind Police Station',
 NOW() - INTERVAL '20 days', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days',
 'Morning (6AM-8AM)', 'Weekends', 'Sat,Sun',
 'IN PROGRESS', 0.00, 440.00, 'ACTIVE',
 'CUST003', NOW(), 'CUST003', NOW()),

-- Subscription 4: Maria's completed subscription
('SUB004', 'CUST004', 'Maria Garcia', '9876543216', 'maria.garcia@example.com',
 '321 Garden Street, House 5', '560004', 'Near School',
 NOW() - INTERVAL '60 days', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '1 day',
 'Afternoon (12PM-2PM)', 'Daily', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
 'DELIVERED', 0.00, 1260.00, 'ACTIVE',
 'CUST004', NOW(), 'CUST004', NOW()),

-- Subscription 5: David's upcoming subscription
('SUB005', 'CUST005', 'David Lee', '9876543218', 'david.lee@example.com',
 '654 Beach Road, Flat 8A', '560005', 'Next to Temple',
 NOW(), CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '35 days',
 'Morning (6AM-8AM)', 'Daily', 'Mon,Tue,Wed,Thu,Fri',
 'ORDER PLACED', 0.00, 1050.00, 'ACTIVE',
 'CUST005', NOW(), 'CUST005', NOW())

ON CONFLICT (subscriptionid) DO NOTHING;

-- ========================================
-- 6. PRODUCT SUBSCRIPTIONS (Subscription Items)
-- ========================================
INSERT INTO milkman.product_subscriptions (
    product_subscription_id, subscriptionid, productid, productname, productprice, quantity,
    status, createdby, createdtime, updatedby, updatedtime
) VALUES 
-- SUB001 items (John's daily milk)
('PS001', 'SUB001', 'PROD001', 'Full Cream Milk 1L', 45.00, 1, 'ACTIVE', 'CUST001', NOW(), 'CUST001', NOW()),

-- SUB002 items (Jane's alternate day)
('PS002', 'SUB002', 'PROD002', 'Toned Milk 1L', 40.00, 2, 'ACTIVE', 'CUST002', NOW(), 'CUST002', NOW()),

-- SUB003 items (Robert's weekend)
('PS003', 'SUB003', 'PROD004', 'Buffalo Milk 1L', 55.00, 1, 'ACTIVE', 'CUST003', NOW(), 'CUST003', NOW()),

-- SUB004 items (Maria's completed)
('PS004', 'SUB004', 'PROD003', 'Skimmed Milk 1L', 42.00, 1, 'ACTIVE', 'CUST004', NOW(), 'CUST004', NOW()),

-- SUB005 items (David's upcoming)
('PS005', 'SUB005', 'PROD001', 'Full Cream Milk 1L', 45.00, 1, 'ACTIVE', 'CUST005', NOW(), 'CUST005', NOW()),
('PS006', 'SUB005', 'PROD005', 'Full Cream Milk 500ml', 25.00, 1, 'ACTIVE', 'CUST005', NOW(), 'CUST005', NOW())

ON CONFLICT DO NOTHING;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Uncomment to verify data after insertion

-- SELECT COUNT(*) as customer_count FROM milkman.customers;
-- SELECT COUNT(*) as product_count FROM milkman.products;
-- SELECT COUNT(*) as order_count FROM milkman.orders;
-- SELECT COUNT(*) as subscription_count FROM milkman.subscriptions;
-- SELECT COUNT(*) as product_order_count FROM milkman.product_orders;
-- SELECT COUNT(*) as product_subscription_count FROM milkman.product_subscriptions;

-- Show all customers with login info
-- SELECT customerid, firstname, lastname, pphone, emailid, status 
-- FROM milkman.customers 
-- ORDER BY customerid;

-- Show all active products
-- SELECT productid, productname, productprice, status 
-- FROM milkman.products 
-- WHERE status = 'ACTIVE'
-- ORDER BY productid;

-- Show all orders with their items
-- SELECT o.orderid, o.customername, o.orderstatus, o.deliverydate, 
--        po.productname, po.quantity, po.productprice
-- FROM milkman.orders o
-- JOIN milkman.product_orders po ON o.orderid = po.orderid
-- ORDER BY o.orderid, po.product_order_id;

-- Show all subscriptions with their items
-- SELECT s.subscriptionid, s.customername, s.orderstatus, s.deliverystartdate, s.deliveryenddate,
--        ps.productname, ps.quantity, ps.productprice
-- FROM milkman.subscriptions s
-- JOIN milkman.product_subscriptions ps ON s.subscriptionid = ps.subscriptionid
-- ORDER BY s.subscriptionid, ps.product_subscription_id;
