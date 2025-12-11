-- Drop tables if they exist (safe re-run)
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS warehouse;

-- Warehouse table
CREATE TABLE warehouse (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    location      VARCHAR(100),
    max_capacity  INTEGER NOT NULL
);

-- Item (shirt) table
CREATE TABLE item (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,
    sku           VARCHAR(50),
    description   TEXT,
    size          VARCHAR(10),
    quantity      INTEGER NOT NULL,
    image_url     VARCHAR(255),
    warehouse_id  BIGINT REFERENCES warehouse(id)
);

-- Seed Data for Warehouses
INSERT INTO warehouse (name, location, max_capacity)
VALUES
  ('Main Warehouse', 'Greensboro, NC', 500),
  ('Overflow Warehouse', 'Charlotte, NC', 300),
  ('Local Warehouse', 'Jamestown, NC', 400),
  ('External Local Warehouse', 'HighPoint, NC', 200);

-- Seed Data for Items
INSERT INTO item (name, sku, description, size, quantity, image_url, warehouse_id)
VALUES
  ('Jehovah Jireh Definition Tee - Black', 'GV-JJ-BLK-M',
   'Bible verse "Jehovah Jireh" definition shirt, size M', 'M', 20,
   'https://example.com/images/jj-black-m.png', 1),
  ('El Shaddai Definition Tee - White', 'GV-ES-WHT-L',
   'El Shaddai name of God definition shirt, size L', 'L', 15,
   'https://example.com/images/es-white-l.png', 1);