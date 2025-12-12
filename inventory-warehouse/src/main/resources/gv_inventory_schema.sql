-- =========================================================
-- God’s Vessel Inventory Schema
-- Drops tables, Recreates, Reseeds
-- =========================================================

-- ==================================================
-- 1. Drop tables in FK order (child first)
-- ==================================================
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS warehouse;

-- =========================
-- 2. Warehouse table
-- =========================
CREATE TABLE warehouse (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    location     VARCHAR(100),
    max_capacity INTEGER      NOT NULL
);

-- ==================================================
-- 3. Item (shirt) table
-- Each row = specific inventory batch @ ONE warehouse.
-- Same design at multiple warehouses = separate rows with same SKU or related name.
-- ==================================================
CREATE TABLE item (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(150) NOT NULL,
    sku          VARCHAR(50)  NOT NULL,
    description  TEXT,
    size         VARCHAR(10),
    quantity     INTEGER      NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    image_url    TEXT,
    warehouse_id BIGINT       NOT NULL,
    CONSTRAINT fk_item_warehouse
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouse(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_item_sku_warehouse UNIQUE (sku, warehouse_id)
);

-- =========================
-- 4. Product table (master catalog)
-- =========================
CREATE TABLE IF NOT EXISTS product (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    sku         VARCHAR(50)  NOT NULL UNIQUE,
    description TEXT,
    image_url    VARCHAR(255)
);

-- =========================================================
-- Seed Data: Warehouses
-- =========================================================
INSERT INTO warehouse (name, location, max_capacity)
VALUES
    ('Main Warehouse',          'Greensboro,', 500),
    ('Overflow Warehouse',      'Charlotte,',  300),
    ('Local Warehouse',         'Jamestown,',  200),
    ('External Local Warehouse','HighPoint,',  200);

-- =========================================================
-- Seed Data: Items (Shirts / Hoodies)
-- Each row is a physical stock batch at ONE warehouse.
-- =========================================================
INSERT INTO item (name, sku, description, size, quantity, image_url, warehouse_id)
VALUES
    -- Main Warehouse stock
    ('Jehovah Jireh Definition Tee - Black',
     'GV-JJ-BLK-M',
     'Bible verse "Jehovah Jireh" definition shirt, size M',
     'M',
     20,
     'https://example.com/images/jj-black-m.png',
     1),

    ('El Shaddai Definition Tee - White',
     'GV-ES-WHT-L',
     'El Shaddai name of God definition shirt, size L',
     'L',
     25,
     'https://example.com/images/es-white-l.png',
     1),

    ('Hosanna Hoodie - Grey',
     'GV-HS-GRY-XL',
     'Hosanna hoodie, cozy and bold, size XL',
     'XL',
     1,
     'https://example.com/images/hosanna-grey-xl.png',
     1),

    -- Overflow Warehouse stock
    ('Agape Love Tee - Black',
     'GV-AG-BLK-L',
     'Agape love of God themed shirt, size L',
     'L',
     8,
     'https://example.com/images/agape-black-l.png',
     2),

    -- Local Warehouse stock
    ('Grace Upon Grace Tee - White',
     'GV-GR-WHT-M',
     'Grace upon grace themed shirt, size M',
     'M',
     3,
     'https://example.com/images/grace-white-m.png',
     3);


-- =========================================================
-- Seed data for product catalog
-- =========================================================
INSERT INTO product (name, sku, description, image_url) VALUES
  ('Jehovah Jireh Definition Tee', 'GV-JJ-BLK-M',
   'Bible verse "Jehovah Jireh" definition shirt',
   'https://example.com/images/jj-black-m.png'),
   
  ('El Shaddai Definition Tee', 'GV-ES-WHT-L',
   'El Shaddai name of God definition shirt',
   'https://example.com/images/es-white-l.png'),
   
  ('Agape Love Tee', 'GV-AG-BLK-L',
   'Love of God themed shirt',
   'https://example.com/images/agape-black-l.png'),
   
  ('Grace Upon Grace Tee', 'GV-GR-WHT-M',
   'Grace upon grace shirt',
   'https://example.com/images/grace-white-m.png'),
   
  ('Hosanna Hoodie', 'GV-HS-GRY-XL',
   'Hosanna hoodie', 'https://example.com/images/hosanna-grey-xl.png');

