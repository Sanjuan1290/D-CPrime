DROP DATABASE IF EXISTS dc_prime;
CREATE DATABASE dc_prime CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dc_prime;

-- =====================================================
-- USERS / SELLERS
-- =====================================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,

  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  contact_no VARCHAR(50),
  password_hash VARCHAR(255),

  role ENUM(
    'owner',
    'admin',
    'treasury',
    'broker',
    'manager',
    'agent',
    'client'
  ) NOT NULL,

  status ENUM('active', 'inactive') DEFAULT 'active',

  accreditation_date DATE,
  last_login DATETIME,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_supervisors (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,
  supervisor_id INT NOT NULL,

  status ENUM('active', 'inactive') DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (supervisor_id) REFERENCES users(id),

  UNIQUE (user_id, supervisor_id)
);

-- =====================================================
-- PROJECTS
-- =====================================================

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(150) NOT NULL,
  location VARCHAR(255),
  administrator VARCHAR(255),
  tax_declaration_no VARCHAR(255),
  pin VARCHAR(255),

  status ENUM('active', 'inactive') DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- LISTINGS / LOTS / UNITS
-- =====================================================

CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,

  project_id INT NOT NULL,

  cadastral_lot_no VARCHAR(100),
  administrator_group VARCHAR(100),

  unit_id VARCHAR(100) NOT NULL,
  reloc_unit_id VARCHAR(100),

  lot_type VARCHAR(100),

  lot_area_sqm DECIMAL(10,2),
  new_area_sqm DECIMAL(10,2),

  price_per_sqm DECIMAL(12,2),
  net_selling_price DECIMAL(12,2),

  legal_misc_rate DECIMAL(5,2) DEFAULT 10.00,
  legal_misc_fee DECIMAL(12,2),

  total_contract_price DECIMAL(12,2),

  reservation_fee DECIMAL(12,2) DEFAULT 0,
  promo_discount DECIMAL(12,2) DEFAULT 0,

  status ENUM(
    'available',
    'reserved',
    'hold',
    'sold',
    'inactive'
  ) DEFAULT 'available',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (project_id) REFERENCES projects(id),

  UNIQUE (project_id, unit_id)
);

-- =====================================================
-- CLIENTS
-- =====================================================

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,

  buyer_name VARCHAR(150) NOT NULL,
  spouse_co_owner_name VARCHAR(150),
  aif_administrator_name VARCHAR(150),

  email VARCHAR(150),
  contact_no VARCHAR(50),
  age INT,
  address TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- RESERVATIONS
-- One row = one reservation workflow before sale conversion
-- =====================================================

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,

  client_id INT NOT NULL,
  listing_id INT NOT NULL,
  reserved_by INT NOT NULL,

  reservation_fee DECIMAL(12,2) DEFAULT 0,
  reservation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,

  status ENUM(
    'pending',
    'confirmed',
    'converted',
    'cancelled',
    'expired'
  ) DEFAULT 'pending',

  remarks TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (reserved_by) REFERENCES users(id)
);

-- =====================================================
-- CLIENT UNITS / SALES ACCOUNT
-- One row = one converted client account for one listing
-- =====================================================

CREATE TABLE client_units (
  id INT AUTO_INCREMENT PRIMARY KEY,

  client_id INT NOT NULL,
  listing_id INT NOT NULL,
  reservation_id INT,

  assigned_agent_id INT,
  assigned_manager_id INT,

  reservation_date DATE,
  contract_date DATE,

  mode_of_payment ENUM('cash', 'installment') NOT NULL,

  contract_price DECIMAL(12,2),
  legal_misc_fee DECIMAL(12,2),
  total_contract_price DECIMAL(12,2),

  payment_terms_months INT,
  monthly_amortization DECIMAL(12,2),
  due_day INT,

  document_status ENUM('complete', 'incomplete') DEFAULT 'incomplete',

  account_status ENUM(
    'active',
    'cancelled',
    'closed'
  ) DEFAULT 'active',

  payment_status ENUM(
    'unpaid',
    'partially_paid',
    'complete_paid'
  ) DEFAULT 'unpaid',

  sales_status ENUM(
    'good_sale',
    'bad_sale',
    'cancelled'
  ) DEFAULT 'good_sale',

  remarks TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (reservation_id) REFERENCES reservations(id),
  FOREIGN KEY (assigned_agent_id) REFERENCES users(id),
  FOREIGN KEY (assigned_manager_id) REFERENCES users(id)
);

-- =====================================================
-- DOCUMENT MASTER CHECKLIST
-- =====================================================

CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(150) NOT NULL,
  description TEXT,

  is_required BOOLEAN DEFAULT TRUE,

  status ENUM('active', 'inactive') DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE project_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,

  project_id INT NOT NULL,
  document_id INT NOT NULL,

  is_required BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (document_id) REFERENCES documents(id),

  UNIQUE (project_id, document_id)
);

CREATE TABLE client_unit_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,

  client_unit_id INT NOT NULL,
  document_id INT NOT NULL,

  file_url TEXT,

  status ENUM(
    'not_submitted',
    'pending',
    'approved',
    'rejected'
  ) DEFAULT 'not_submitted',

  reviewed_by INT,
  reviewed_at DATETIME,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (client_unit_id) REFERENCES client_units(id),
  FOREIGN KEY (document_id) REFERENCES documents(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id),

  UNIQUE (client_unit_id, document_id)
);

-- =====================================================
-- PAYMENTS / COLLECTIONS
-- =====================================================

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,

  client_unit_id INT NOT NULL,

  payment_date DATE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,

  payment_type ENUM(
    'reservation',
    'downpayment',
    'monthly',
    'legal_misc',
    'full_payment',
    'other'
  ) NOT NULL,

  payment_method VARCHAR(100),
  bank_name VARCHAR(100),
  reference_no VARCHAR(150),

  status ENUM(
    'pending',
    'verified',
    'rejected'
  ) DEFAULT 'pending',

  verified_by INT,
  verified_at DATETIME,

  remarks TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (client_unit_id) REFERENCES client_units(id),
  FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- =====================================================
-- SOA / INSTALLMENT SCHEDULE
-- =====================================================

CREATE TABLE payment_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,

  client_unit_id INT NOT NULL,

  due_date DATE NOT NULL,
  description VARCHAR(150),

  due_amount DECIMAL(12,2) NOT NULL,
  penalty DECIMAL(12,2) DEFAULT 0,

  status ENUM(
    'unpaid',
    'partial',
    'paid',
    'overdue'
  ) DEFAULT 'unpaid',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (client_unit_id) REFERENCES client_units(id)
);

-- =====================================================
-- COMMISSION PLANS
-- =====================================================

CREATE TABLE commission_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,

  project_id INT NOT NULL,

  name VARCHAR(150) NOT NULL,

  direct_agent_rate DECIMAL(5,2) DEFAULT 7.00,
  distributed_agent_rate DECIMAL(5,2) DEFAULT 2.00,
  manager_rate DECIMAL(5,2) DEFAULT 5.00,

  status ENUM('active', 'inactive') DEFAULT 'active',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- =====================================================
-- COMMISSIONS
-- One row = commission earned by one seller/user
-- =====================================================

CREATE TABLE commissions (
  id INT AUTO_INCREMENT PRIMARY KEY,

  client_unit_id INT NOT NULL,
  user_id INT NOT NULL,

  commission_type ENUM(
    'agent',
    'manager',
    'broker'
  ) NOT NULL,

  sale_type ENUM(
    'direct',
    'distributed'
  ) DEFAULT 'distributed',

  rate DECIMAL(5,2) NOT NULL,
  gross_commission DECIMAL(12,2) NOT NULL,

  status ENUM(
    'pending',
    'approved',
    'partially_released',
    'released',
    'cancelled'
  ) DEFAULT 'pending',

  approved_by INT,
  approved_at DATETIME,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (client_unit_id) REFERENCES client_units(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),

  UNIQUE (client_unit_id, user_id, commission_type)
);

-- =====================================================
-- COMMISSION RELEASES
-- Supports 20%, 40%, 60%, 75%, retention, or manual release
-- =====================================================

CREATE TABLE commission_releases (
  id INT AUTO_INCREMENT PRIMARY KEY,

  commission_id INT NOT NULL,

  release_stage ENUM(
    'first_20',
    'second_40',
    'third_60',
    'fourth_75',
    'retention_25',
    'manual'
  ) NOT NULL,

  release_percentage DECIMAL(5,2),

  gross_release_amount DECIMAL(12,2) NOT NULL,
  cash_advance_deduction DECIMAL(12,2) DEFAULT 0,
  net_release_amount DECIMAL(12,2) NOT NULL,

  released_by INT NOT NULL,
  released_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  remarks TEXT,

  FOREIGN KEY (commission_id) REFERENCES commissions(id),
  FOREIGN KEY (released_by) REFERENCES users(id)
);

-- =====================================================
-- CASH ADVANCES
-- =====================================================

CREATE TABLE cash_advances (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,

  client_unit_id INT,
  commission_id INT,

  amount DECIMAL(12,2) NOT NULL,
  reason TEXT,

  status ENUM(
    'pending',
    'approved',
    'partially_deducted',
    'deducted',
    'disapproved'
  ) DEFAULT 'pending',

  approved_by INT,
  approved_at DATETIME,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (client_unit_id) REFERENCES client_units(id),
  FOREIGN KEY (commission_id) REFERENCES commissions(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- =====================================================
-- CASH ADVANCE DEDUCTIONS
-- Tracks which cash advance was deducted from which commission release
-- =====================================================

CREATE TABLE cash_advance_deductions (
  id INT AUTO_INCREMENT PRIMARY KEY,

  cash_advance_id INT NOT NULL,
  commission_release_id INT NOT NULL,

  deducted_amount DECIMAL(12,2) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (cash_advance_id) REFERENCES cash_advances(id),
  FOREIGN KEY (commission_release_id) REFERENCES commission_releases(id),

  UNIQUE (cash_advance_id, commission_release_id)
);

-- =====================================================
-- ROLE / FEATURE ACCESS
-- =====================================================

CREATE TABLE app_features (
  id INT AUTO_INCREMENT PRIMARY KEY,

  feature_key VARCHAR(100) NOT NULL UNIQUE,
  module_name VARCHAR(100) NOT NULL,
  display_name VARCHAR(150) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_feature_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,

  role ENUM(
    'owner',
    'admin',
    'treasury',
    'broker',
    'manager',
    'agent',
    'client'
  ) NOT NULL,

  feature_id INT NOT NULL,
  can_access BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (feature_id) REFERENCES app_features(id),

  UNIQUE (role, feature_id)
);

CREATE TABLE user_feature_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,
  feature_id INT NOT NULL,

  can_access BOOLEAN NOT NULL,
  granted_by INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (feature_id) REFERENCES app_features(id),
  FOREIGN KEY (granted_by) REFERENCES users(id),

  UNIQUE (user_id, feature_id)
);

-- =====================================================
-- SYSTEM SETTINGS
-- =====================================================

CREATE TABLE system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,

  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  module_group VARCHAR(100) NOT NULL,

  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  user_id INT,

  action VARCHAR(150) NOT NULL,
  module_name VARCHAR(100),
  entity_table VARCHAR(100),
  entity_id INT,

  old_values JSON,
  new_values JSON,

  ip_address VARCHAR(45),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_reservations_listing_status ON reservations(listing_id, status);
CREATE INDEX idx_reservations_client_status ON reservations(client_id, status);
CREATE INDEX idx_client_units_listing_status ON client_units(listing_id, account_status);
CREATE INDEX idx_client_units_status ON client_units(account_status, payment_status);
CREATE INDEX idx_payments_client_status ON payments(client_unit_id, status);
CREATE INDEX idx_payment_schedules_due ON payment_schedules(due_date, status);
CREATE INDEX idx_commissions_user_status ON commissions(user_id, status);
CREATE INDEX idx_cash_advances_user_status ON cash_advances(user_id, status);

-- =====================================================
-- FEATURE SEED DATA
-- =====================================================

INSERT INTO app_features
(feature_key, module_name, display_name)
VALUES
('dashboard', 'Dashboard', 'Dashboard'),

('projects', 'Management', 'Projects'),
('listings', 'Management', 'Listings'),
('reservations', 'Management', 'Reservations'),

('clients_view', 'Clients', 'Clients: View'),
('clients_manage', 'Clients', 'Clients: Manage'),

('payments_view', 'Finance', 'Payments: View'),
('payments_record', 'Finance', 'Payments: Record'),
('payments_verify', 'Finance', 'Payments: Verify'),

('commissions_view', 'Finance', 'Commissions: View'),
('commissions_approve', 'Finance', 'Commissions: Approve'),
('commissions_release', 'Finance', 'Commissions: Release'),

('cash_advances_view', 'Finance', 'Cash Advances: View'),
('cash_advances_manage', 'Finance', 'Cash Advances: Manage'),

('documents_view', 'Compliance', 'Documents: View'),
('documents_upload', 'Compliance', 'Documents: Upload'),
('documents_approve', 'Compliance', 'Documents: Approve'),

('soa_view', 'Records', 'SOA: View'),
('balances_view', 'Records', 'Balances'),

('reports_view', 'Records', 'Reports'),
('audit_logs_view', 'Administration', 'Audit Logs'),
('user_management', 'Administration', 'User Management'),
('settings', 'Administration', 'Settings'),
('lookups', 'Administration', 'Lookup Tables');

-- OWNER DEFAULT ACCESS
INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'owner', id, TRUE
FROM app_features;

-- ADMIN DEFAULT ACCESS
INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'admin', id, TRUE
FROM app_features;

-- TREASURY DEFAULT ACCESS
INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'treasury', id, TRUE
FROM app_features
WHERE feature_key IN (
  'dashboard',

  'clients_view',

  'payments_view',
  'payments_record',
  'payments_verify',

  'commissions_view',
  'commissions_approve',
  'commissions_release',

  'cash_advances_view',
  'cash_advances_manage',

  'documents_view',
  'documents_approve',

  'soa_view',
  'balances_view',

  'reports_view'
);

-- MANAGER DEFAULT ACCESS
INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'manager', id, TRUE
FROM app_features
WHERE feature_key IN (
  'dashboard',

  'projects',
  'listings',
  'reservations',

  'clients_view',
  'clients_manage',

  'payments_view',

  'commissions_view',
  'commissions_approve',

  'cash_advances_view',

  'documents_view',
  'documents_approve',

  'soa_view',
  'balances_view',

  'reports_view'
);

-- BROKER DEFAULT ACCESS
INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'broker', id, TRUE
FROM app_features
WHERE feature_key IN (
  'dashboard',

  'listings',
  'reservations',

  'clients_view',

  'payments_view',

  'commissions_view',
  'cash_advances_view',

  'documents_view',

  'soa_view',
  'balances_view'
);

-- AGENT DEFAULT ACCESS
INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'agent', id, TRUE
FROM app_features
WHERE feature_key IN (
  'dashboard',

  'listings',
  'reservations',

  'clients_view',

  'payments_view',

  'commissions_view',
  'cash_advances_view',

  'documents_view',
  'documents_upload',

  'soa_view',
  'balances_view'
);

-- CLIENT DEFAULT ACCESS
INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'client', id, TRUE
FROM app_features
WHERE feature_key IN (
  'dashboard',

  'payments_view',

  'documents_view',
  'documents_upload',

  'soa_view',
  'balances_view'
);

-- =====================================================
-- VIEWS
-- =====================================================

CREATE VIEW v_client_balances AS
SELECT
  cu.id AS client_unit_id,
  c.buyer_name,
  c.spouse_co_owner_name,
  l.unit_id,
  p.name AS project_name,

  cu.total_contract_price,

  COALESCE(
    SUM(
      CASE 
        WHEN pay.status = 'verified' THEN pay.amount 
        ELSE 0 
      END
    ),
    0
  ) AS total_paid,

  cu.total_contract_price - COALESCE(
    SUM(
      CASE 
        WHEN pay.status = 'verified' THEN pay.amount 
        ELSE 0 
      END
    ),
    0
  ) AS balance,

  cu.mode_of_payment,
  cu.payment_status,
  cu.account_status

FROM client_units cu
JOIN clients c ON c.id = cu.client_id
JOIN listings l ON l.id = cu.listing_id
JOIN projects p ON p.id = l.project_id
LEFT JOIN payments pay ON pay.client_unit_id = cu.id

GROUP BY
  cu.id,
  c.buyer_name,
  c.spouse_co_owner_name,
  l.unit_id,
  p.name,
  cu.total_contract_price,
  cu.mode_of_payment,
  cu.payment_status,
  cu.account_status;

CREATE VIEW v_commission_summary AS
SELECT
  com.id AS commission_id,
  cu.id AS client_unit_id,
  seller.full_name AS seller_name,
  seller.role AS seller_role,

  com.commission_type,
  com.sale_type,
  com.rate,
  com.gross_commission,

  COALESCE(SUM(cr.gross_release_amount), 0) AS total_gross_released,
  COALESCE(SUM(cr.cash_advance_deduction), 0) AS total_cash_advance_deduction,
  COALESCE(SUM(cr.net_release_amount), 0) AS total_net_released,

  com.gross_commission - COALESCE(SUM(cr.gross_release_amount), 0) AS remaining_commission,

  com.status

FROM commissions com
JOIN users seller ON seller.id = com.user_id
JOIN client_units cu ON cu.id = com.client_unit_id
LEFT JOIN commission_releases cr ON cr.commission_id = com.id

GROUP BY
  com.id,
  cu.id,
  seller.full_name,
  seller.role,
  com.commission_type,
  com.sale_type,
  com.rate,
  com.gross_commission,
  com.status;

CREATE VIEW v_cash_advance_balances AS
SELECT
  ca.id AS cash_advance_id,
  ca.user_id,
  u.full_name AS user_name,
  u.role,

  ca.amount AS cash_advance_amount,

  COALESCE(SUM(cad.deducted_amount), 0) AS total_deducted,

  ca.amount - COALESCE(SUM(cad.deducted_amount), 0) AS remaining_balance,

  ca.status,
  ca.reason,
  ca.created_at

FROM cash_advances ca
JOIN users u ON u.id = ca.user_id
LEFT JOIN cash_advance_deductions cad ON cad.cash_advance_id = ca.id

GROUP BY
  ca.id,
  ca.user_id,
  u.full_name,
  u.role,
  ca.amount,
  ca.status,
  ca.reason,
  ca.created_at;
