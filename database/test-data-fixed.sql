-- MilkMan Test Data Script (Column Names Corrected)
-- All customer passwords are: admin (encrypted: qLW4HhIq71oAvgWWYfv8ew==)

SET search_path TO milkman;

-- ========================================
-- 1. CUSTOMERS
-- ========================================
INSERT INTO milkman.customers (customerid, firstname, lastname, pphone, sphone, emailid, dob, auth_pin, address, landmark, pincode, status, createdby, createdtime, updatedby, updatedtime) VALUES
('CUST001', 'John', 'Doe', '9876543210', '9876543211', 'john.doe@example.com', '1990-05-15', 'qLW4HhIq71oAvgWWYfv8ew==', '123 Main Street, Apartment 4B', 'Near Central Mall', '560001', 'ACTIVE', 'system', NOW(), 'system', NOW()),
('CUST002', 'Jane', 'Smith', '9876543212', '9876543213', 'jane.smith@example.com', '1985-08-22', 'qLW4HhIq71oAvgWWYfv8ew==', '456 Park Avenue, Building C', 'Opposite City Hospital', '560002', 'ACTIVE', 'system', NOW(), 'system', NOW()),
('CUST003', 'Robert', 'Johnson', '9876543214', '9876543215', 'robert.j@example.com', '1992-03-10', 'qLW4HhIq71oAvgWWYfv8ew==', '789 Lake View Road, Villa 12', 'Behind Police Station', '560003', 'ACTIVE', 'system', NOW(), 'system', NOW()),
('CUST004', 'Maria', 'Garcia', '9876543216', '9876543217', 'maria.garcia@example.com', '1988-11-30', 'qLW4HhIq71oAvgWWYfv8ew==', '321 Garden Street, House 5', 'Near School', '560004', 'ACTIVE', 'system', NOW(), 'system', NOW()),
('CUST005', 'David', 'Lee', '9876543218', '9876543219', 'david.lee@example.com', '1995-07-18', 'qLW4HhIq71oAvgWWYfv8ew==', '654 Pine Boulevard, Flat 22', 'Behind Shopping Complex', '560005', 'INACTIVE', 'system', NOW(), 'system', NOW()),
('CUST006', 'Sarah', 'Wilson', '9876543220', '9876543221', 'sarah.w@example.com', '1990-12-25', 'qLW4HhIq71oAvgWWYfv8ew==', '987 River Side Colony, Block A', 'Near Temple', '560006', 'ACTIVE', 'system', NOW(), 'system', NOW());

-- ========================================
-- 2. PRODUCTS
-- ========================================
INSERT INTO milkman.products (productid, productname, productdescription, productprice, createdby, createdtime, updatedby, updatedtime, status) VALUES
('PROD001', 'Full Cream Milk 1L', 'Fresh full cream milk, high in fat content', 60.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD002', 'Toned Milk 1L', 'Toned milk with balanced nutrition', 50.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD003', 'Skimmed Milk 1L', 'Low fat skimmed milk', 48.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD004', 'Buffalo Milk 1L', 'Rich and creamy buffalo milk', 75.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD005', 'Cow Milk 500ml', 'Fresh cow milk in half liter pack', 30.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD006', 'Paneer 200g', 'Fresh cottage cheese made from pure milk', 90.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD007', 'Curd 500ml', 'Fresh homemade style curd', 35.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD008', 'Butter 100g', 'Pure butter made from cream', 55.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD009', 'Ghee 500ml', 'Pure cow ghee', 450.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD010', 'Lassi 200ml', 'Sweet traditional lassi', 25.00, 'system', NOW(), 'system', NOW(), 'ACTIVE');

-- ========================================
-- 3. ORDERS
-- ========================================
INSERT INTO milkman.orders (orderid, customerid, customername, pphone, emailid, address, pincode, landmark, orderdatetime, deliverydate, deliverytimeslot, deliveryfrequency, orderstatus, createdby, createdtime, updatedby, updatedtime, status, deliverycharge, ordertotal) VALUES
('ORD001', 'CUST001', 'John Doe', '9876543210', 'john.doe@example.com', '123 Main Street, Apartment 4B', '560001', 'Near Central Mall', NOW(), CURRENT_DATE + 1, '06:00-08:00 AM', 'Once', 'ORDER_PLACED', 'system', NOW(), 'system', NOW(), 'ACTIVE', 20.00, 170.00),
('ORD002', 'CUST002', 'Jane Smith', '9876543212', 'jane.smith@example.com', '456 Park Avenue, Building C', '560002', 'Opposite City Hospital', NOW() - INTERVAL '1 day', CURRENT_DATE, '06:00-08:00 AM', 'Once', 'IN_PROGRESS', 'system', NOW(), 'system', NOW(), 'ACTIVE', 20.00, 210.00),
('ORD003', 'CUST003', 'Robert Johnson', '9876543214', 'robert.j@example.com', '789 Lake View Road, Villa 12', '560003', 'Behind Police Station', NOW() - INTERVAL '2 days', CURRENT_DATE - 1, '07:00-09:00 AM', 'Once', 'DELIVERED', 'system', NOW(), 'system', NOW(), 'ACTIVE', 20.00, 195.00),
('ORD004', 'CUST004', 'Maria Garcia', '9876543216', 'maria.garcia@example.com', '321 Garden Street, House 5', '560004', 'Near School', NOW(), CURRENT_DATE + 2, '06:00-08:00 AM', 'Once', 'ORDER_PLACED', 'system', NOW(), 'system', NOW(), 'ACTIVE', 20.00, 260.00),
('ORD005', 'CUST006', 'Sarah Wilson', '9876543220', 'sarah.w@example.com', '987 River Side Colony, Block A', '560006', 'Near Temple', NOW() - INTERVAL '3 days', CURRENT_DATE - 2, '08:00-10:00 AM', 'Once', 'DELIVERED', 'system', NOW(), 'system', NOW(), 'ACTIVE', 20.00, 125.00);

-- ========================================
-- 4. PRODUCT_ORDERS (Order Line Items)
-- ========================================
INSERT INTO milkman.product_orders (orderid, productid, quantity, productprice, createdby, createdtime, updatedby, updatedtime, status) VALUES
-- ORD001 items (Total: 150)
('ORD001', 'PROD001', 2, 60.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('ORD001', 'PROD007', 1, 35.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
-- ORD002 items (Total: 190)
('ORD002', 'PROD002', 2, 50.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('ORD002', 'PROD006', 1, 90.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
-- ORD003 items (Total: 175)
('ORD003', 'PROD004', 1, 75.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('ORD003', 'PROD003', 2, 48.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
-- ORD004 items (Total: 240)
('ORD004', 'PROD001', 1, 60.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('ORD004', 'PROD004', 1, 75.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('ORD004', 'PROD006', 1, 90.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
-- ORD005 items (Total: 105)
('ORD005', 'PROD002', 1, 50.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('ORD005', 'PROD007', 1, 35.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('ORD005', 'PROD010', 1, 25.00, 'system', NOW(), 'system', NOW(), 'ACTIVE');

-- ========================================
-- 5. SUBSCRIPTIONS
-- ========================================
INSERT INTO milkman.subscriptions (subscriptionid, customerid, customername, pphone, emailid, address, pincode, landmark, orderdatetime, deliverystartdate, deliveryenddate, deliverytimeslot, deliveryfrequency, subscriptionstatus, createdby, createdtime, updatedby, updatedtime, status, deliverycharge, ordertotal) VALUES
('SUB001', 'CUST001', 'John Doe', '9876543210', 'john.doe@example.com', '123 Main Street, Apartment 4B', '560001', 'Near Central Mall', NOW(), CURRENT_DATE, CURRENT_DATE + 30, '06:00-08:00 AM', 'Daily', 'ACTIVE', 'system', NOW(), 'system', NOW(), 'ACTIVE', 0.00, 1800.00),
('SUB002', 'CUST002', 'Jane Smith', '9876543212', 'jane.smith@example.com', '456 Park Avenue, Building C', '560002', 'Opposite City Hospital', NOW() - INTERVAL '5 days', CURRENT_DATE - 5, CURRENT_DATE + 25, '06:00-08:00 AM', 'Daily', 'ACTIVE', 'system', NOW(), 'system', NOW(), 'ACTIVE', 0.00, 1500.00),
('SUB003', 'CUST003', 'Robert Johnson', '9876543214', 'robert.j@example.com', '789 Lake View Road, Villa 12', '560003', 'Behind Police Station', NOW() - INTERVAL '10 days', CURRENT_DATE - 10, CURRENT_DATE + 20, '07:00-09:00 AM', 'Alternate Days', 'ACTIVE', 'system', NOW(), 'system', NOW(), 'ACTIVE', 0.00, 900.00),
('SUB004', 'CUST004', 'Maria Garcia', '9876543216', 'maria.garcia@example.com', '321 Garden Street, House 5', '560004', 'Near School', NOW(), CURRENT_DATE, CURRENT_DATE + 60, '06:00-08:00 AM', 'Daily', 'ACTIVE', 'system', NOW(), 'system', NOW(), 'ACTIVE', 0.00, 2700.00),
('SUB005', 'CUST006', 'Sarah Wilson', '9876543220', 'sarah.w@example.com', '987 River Side Colony, Block A', '560006', 'Near Temple', NOW() - INTERVAL '7 days', CURRENT_DATE - 7, CURRENT_DATE + 23, '08:00-10:00 AM', 'Weekend Only', 'ACTIVE', 'system', NOW(), 'system', NOW(), 'ACTIVE', 0.00, 720.00);

-- ========================================
-- 6. PRODUCT_SUBSCRIPTIONS (Subscription Line Items)
-- ========================================
INSERT INTO milkman.product_subscriptions (subscriptionid, productid, quantity, productprice, createdby, createdtime, updatedby, updatedtime, status) VALUES
-- SUB001 items (Daily Full Cream Milk)
('SUB001', 'PROD001', 1, 60.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
-- SUB002 items (Daily Toned Milk)
('SUB002', 'PROD002', 1, 50.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
-- SUB003 items (Alternate Days Buffalo Milk)
('SUB003', 'PROD004', 1, 75.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
-- SUB004 items (Daily Full Cream Milk + Curd)
('SUB004', 'PROD001', 1, 60.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('SUB004', 'PROD007', 1, 35.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
-- SUB005 items (Weekend Toned Milk)
('SUB005', 'PROD002', 1, 50.00, 'system', NOW(), 'system', NOW(), 'ACTIVE');
