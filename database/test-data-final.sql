-- MilkMan Complete Test Data
-- All customer passwords: admin (encrypted: qLW4HhIq71oAvgWWYfv8ew==)

SET search_path TO milkman;

-- Products (PROD001 already exists from init-db.sql, skip it)
INSERT INTO milkman.products (productid, productname, productdescription, productprice, createdby, createdtime, updatedby, updatedtime, status) VALUES
('PROD002', 'Toned Milk 1L', 'Toned milk with balanced nutrition', 50.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD003', 'Skimmed Milk 1L', 'Low fat skimmed milk', 48.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD004', 'Buffalo Milk 1L', 'Rich and creamy buffalo milk', 75.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD006', 'Paneer 200g', 'Fresh cottage cheese', 90.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD007', 'Curd 500ml', 'Fresh homemade style curd', 35.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD008', 'Butter 100g', 'Pure butter', 55.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD009', 'Ghee 500ml', 'Pure cow ghee', 450.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PROD010', 'Lassi 200ml', 'Sweet traditional lassi', 25.00, 'system', NOW(), 'system', NOW(), 'ACTIVE');

-- Orders
INSERT INTO milkman.orders (orderid, customerid, customername, pphone, emailid, address, pincode, landmark, orderdatetime, deliverydate, deliverytimeslot, deliveryfrequency, orderstatus, createdby, createdtime, updatedby, updatedtime, status, deliverycharge, ordertotal) VALUES
('ORD001', 'CUST001', 'John Doe', '9876543210', 'john.doe@example.com', '123 Main Street, Apartment 4B', '560001', 'Near Central Mall', NOW(), CURRENT_DATE + 1, '06:00-08:00 AM', 'Once', 'ORDER_PLACED', 'system', NOW(), 'system', NOW(), 'ACTIVE', 20.00, 170.00),
('ORD002', 'CUST002', 'Jane Smith', '9876543212', 'jane.smith@example.com', '456 Park Avenue, Building C', '560002', 'Opposite City Hospital', NOW() - INTERVAL '1 day', CURRENT_DATE, '06:00-08:00 AM', 'Once', 'IN_PROGRESS', 'system', NOW(), 'system', NOW(), 'ACTIVE', 20.00, 210.00),
('ORD003', 'CUST003', 'Robert Johnson', '9876543214', 'robert.j@example.com', '789 Lake View Road, Villa 12', '560003', 'Behind Police Station', NOW() - INTERVAL '2 days', CURRENT_DATE - 1, '07:00-09:00 AM', 'Once', 'DELIVERED', 'system', NOW(), 'system', NOW(), 'ACTIVE', 20.00, 195.00);

-- Product Orders (need product_order_id + productname)
INSERT INTO milkman.product_orders (product_order_id, orderid, productid, productname, quantity, productprice, createdby, createdtime, updatedby, updatedtime, status) VALUES
('PO001', 'ORD001', 'PROD001', 'Full Cream Milk 1L', 2, 60.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PO002', 'ORD001', 'PROD007', 'Curd 500ml', 1, 35.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PO003', 'ORD002', 'PROD002', 'Toned Milk 1L', 2, 50.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PO004', 'ORD002', 'PROD006', 'Paneer 200g', 1, 90.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PO005', 'ORD003', 'PROD004', 'Buffalo Milk 1L', 1, 75.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PO006', 'ORD003', 'PROD003', 'Skimmed Milk 1L', 2, 48.00, 'system', NOW(), 'system', NOW(), 'ACTIVE');

-- Subscriptions (orderstatus not subscriptionstatus)
INSERT INTO milkman.subscriptions (subscriptionid, customerid, customername, pphone, emailid, address, pincode, landmark, orderdatetime, deliverystartdate, deliveryenddate, deliverytimeslot, deliveryfrequency, orderstatus, createdby, createdtime, updatedby, updatedtime, status, deliverycharge, ordertotal) VALUES
('SUB001', 'CUST001', 'John Doe', '9876543210', 'john.doe@example.com', '123 Main Street, Apartment 4B', '560001', 'Near Central Mall', NOW(), CURRENT_DATE, CURRENT_DATE + 30, '06:00-08:00 AM', 'Daily', 'ACTIVE', 'system', NOW(), 'system', NOW(), 'ACTIVE', 0.00, 1800.00),
('SUB002', 'CUST002', 'Jane Smith', '9876543212', 'jane.smith@example.com', '456 Park Avenue, Building C', '560002', 'Opposite City Hospital', NOW() - INTERVAL '5 days', CURRENT_DATE - 5, CURRENT_DATE + 25, '06:00-08:00 AM', 'Daily', 'ACTIVE', 'system', NOW(), 'system', NOW(), 'ACTIVE', 0.00, 1500.00),
('SUB003', 'CUST003', 'Robert Johnson', '9876543214', 'robert.j@example.com', '789 Lake View Road, Villa 12', '560003', 'Behind Police Station', NOW() - INTERVAL '10 days', CURRENT_DATE - 10, CURRENT_DATE + 20, '07:00-09:00 AM', 'Alternate Days', 'ACTIVE', 'system', NOW(), 'system', NOW(), 'ACTIVE', 0.00, 900.00);

-- Product Subscriptions (need product_subscription_id + productname)
INSERT INTO milkman.product_subscriptions (product_subscription_id, subscriptionid, productid, productname, quantity, productprice, createdby, createdtime, updatedby, updatedtime, status) VALUES
('PS001', 'SUB001', 'PROD001', 'Full Cream Milk 1L', 1, 60.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PS002', 'SUB002', 'PROD002', 'Toned Milk 1L', 1, 50.00, 'system', NOW(), 'system', NOW(), 'ACTIVE'),
('PS003', 'SUB003', 'PROD004', 'Buffalo Milk 1L', 1, 75.00, 'system', NOW(), 'system', NOW(), 'ACTIVE');
