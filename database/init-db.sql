-- Initialize milkman schema
CREATE SCHEMA IF NOT EXISTS milkman;

-- Set default schema
SET search_path TO milkman;

-- milkman.customers definition
CREATE TABLE IF NOT EXISTS milkman.customers (
	id serial4 NOT NULL,
	customerid varchar NULL,
	firstname varchar NULL,
	lastname varchar NULL,
	pphone varchar NULL,
	sphone varchar NULL,
	emailid varchar NULL,
	dob timestamp NULL,
	auth_pin varchar NULL,
	address varchar NULL,
	landmark varchar NULL,
	pincode varchar NULL,
	createdby varchar NULL,
	createdtime timestamp NULL,
	updatedby varchar NULL,
	updatedtime timestamp NULL,
	status varchar NULL,
	CONSTRAINT customers_pkey PRIMARY KEY (id)
);

-- milkman.products definition
CREATE TABLE IF NOT EXISTS milkman.products (
	productid varchar NOT NULL,
	productname varchar NULL,
	productdescription varchar NULL,
	productprice numeric NOT NULL,
	createdby varchar NULL,
	createdtime timestamp NULL,
	updatedby varchar NULL,
	updatedtime timestamp NULL,
	status varchar NULL,
	CONSTRAINT products_pk PRIMARY KEY (productid)
);

-- milkman.orders definition
CREATE TABLE IF NOT EXISTS milkman.orders (
	orderid varchar NOT NULL,
	customerid varchar NULL,
	customername varchar NULL,
	pphone varchar NULL,
	emailid varchar NULL,
	address varchar NULL,
	pincode varchar NULL,
	landmark varchar NULL,
	orderdatetime timestamp NULL,
	deliverydate date NULL,
	deliverytimeslot varchar NULL,
	deliveryfrequency varchar NULL,
	orderstatus varchar NULL,
	createdby varchar NULL,
	createdtime timestamp NULL,
	updatedby varchar NULL,
	updatedtime timestamp NULL,
	status varchar NULL,
	deliverycharge numeric NULL,
	ordertotal numeric NULL,
	CONSTRAINT orders_pk PRIMARY KEY (orderid)
);

-- milkman.subscriptions definition
CREATE TABLE IF NOT EXISTS milkman.subscriptions (
	subscriptionid varchar NOT NULL,
	customerid varchar NOT NULL,
	customername varchar NOT NULL,
	pphone varchar NULL,
	emailid varchar NULL,
	address varchar NOT NULL,
	pincode varchar NOT NULL,
	landmark varchar NULL,
	orderdatetime timestamp NULL,
	deliverystartdate date NULL,
	deliveryenddate date NULL,
	deliverytimeslot varchar NULL,
	deliveryfrequency varchar NULL,
	deliverydays varchar NULL,
	orderstatus varchar NULL,
    deliverycharge numeric NULL,
	ordertotal numeric NULL,
	createdby varchar NULL,
	createdtime timestamp NULL,
	updatedby varchar NULL,
	updatedtime timestamp NULL,
	status varchar NULL,
	CONSTRAINT subscriptions_pk PRIMARY KEY (subscriptionid)
);

-- milkman.product_orders definition
CREATE TABLE IF NOT EXISTS milkman.product_orders (
	product_order_id varchar NOT NULL,
	orderid varchar NOT NULL,
	productid varchar NULL,
	productname varchar NULL,
	productprice numeric NOT NULL,
	quantity int4 NOT NULL,
	createdby varchar NULL,
	createdtime timestamp NULL,
	updatedby varchar NULL,
	updatedtime timestamp NULL,
	status varchar NULL,
	CONSTRAINT product_orders_fk FOREIGN KEY (orderid) REFERENCES milkman.orders(orderid),
	CONSTRAINT product_orders_fk_1 FOREIGN KEY (productid) REFERENCES milkman.products(productid)
);

-- milkman.product_subscriptions definition
CREATE TABLE IF NOT EXISTS milkman.product_subscriptions (
	product_subscription_id varchar NOT NULL,
	subscriptionid varchar NOT NULL,
	productid varchar NULL,
	productname varchar NULL,
	productprice numeric NOT NULL,
	quantity int4 NOT NULL,
	createdby varchar NULL,
	createdtime timestamp NULL,
	updatedby varchar NULL,
	updatedtime timestamp NULL,
	status varchar NULL
);

-- Insert sample products
INSERT INTO milkman.products (productid, productname, productdescription, productprice, status, createdby, createdtime) 
VALUES 
    ('PROD001', 'Full Cream Milk 1L', 'Fresh full cream milk delivered daily', 45.00, 'ACTIVE', 'system', NOW()),
    ('PROD002', 'Toned Milk 1L', 'Healthy toned milk', 40.00, 'ACTIVE', 'system', NOW()),
    ('PROD003', 'Skimmed Milk 1L', 'Low fat skimmed milk', 42.00, 'ACTIVE', 'system', NOW()),
    ('PROD004', 'Buffalo Milk 1L', 'Rich buffalo milk', 55.00, 'ACTIVE', 'system', NOW())
ON CONFLICT (productid) DO NOTHING;
