DROP DATABASE IF EXISTS dc_prime;
CREATE DATABASE dc_prime CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dc_prime;

-- Core ERD tables

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'treasury', 'manager', 'broker', 'agent', 'client') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role_status (role, status)
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(255),
  administrator VARCHAR(255) NOT NULL,
  tax_declaration_no VARCHAR(255) NOT NULL,
  pin VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_projects_status (status)
);

CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  unit_id VARCHAR(50) NOT NULL,
  lot_type VARCHAR(100),
  lot_area_sqm DECIMAL(10,2) NOT NULL,
  price_per_sqm DECIMAL(12,2) NOT NULL,
  reservation_fee DECIMAL(12,2) DEFAULT 0,
  legal_misc_fee DECIMAL(12,2) DEFAULT 0,
  net_selling_price DECIMAL(12,2) NOT NULL,
  status ENUM('available', 'reserved', 'sold', 'inactive') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_listings_project FOREIGN KEY (project_id) REFERENCES projects(id),
  UNIQUE KEY uq_listings_project_unit (project_id, unit_id),
  INDEX idx_listings_status (status)
);

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  contact_no VARCHAR(50),
  address TEXT,
  assigned_seller_id INT,
  status ENUM('lead', 'reserved', 'active', 'completed', 'cancelled') DEFAULT 'lead',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_clients_assigned_seller FOREIGN KEY (assigned_seller_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_clients_status (status),
  INDEX idx_clients_seller (assigned_seller_id)
);

CREATE TABLE client_units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  listing_id INT NOT NULL,
  assigned_seller_id INT NOT NULL,
  reservation_date DATE,
  contract_date DATE,
  selling_price DECIMAL(12,2),
  downpayment DECIMAL(12,2),
  balance DECIMAL(12,2),
  status ENUM('reserved', 'active', 'fully_paid', 'cancelled') DEFAULT 'reserved',
  CONSTRAINT fk_client_units_client FOREIGN KEY (client_id) REFERENCES clients(id),
  CONSTRAINT fk_client_units_listing FOREIGN KEY (listing_id) REFERENCES listings(id),
  CONSTRAINT fk_client_units_seller FOREIGN KEY (assigned_seller_id) REFERENCES users(id),
  UNIQUE KEY uq_client_units_client_listing (client_id, listing_id),
  INDEX idx_client_units_status (status),
  INDEX idx_client_units_seller (assigned_seller_id)
);

CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT TRUE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_documents_status (status)
);

CREATE TABLE client_unit_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_unit_id INT NOT NULL,
  document_id INT NOT NULL,
  file_url TEXT,
  status ENUM('missing', 'submitted', 'approved', 'rejected', 'not_required') DEFAULT 'missing',
  remarks TEXT,
  submitted_at DATETIME,
  reviewed_by INT,
  reviewed_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_client_unit_documents_client_unit FOREIGN KEY (client_unit_id) REFERENCES client_units(id),
  CONSTRAINT fk_client_unit_documents_document FOREIGN KEY (document_id) REFERENCES documents(id),
  CONSTRAINT fk_client_unit_documents_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_client_unit_documents (client_unit_id, document_id),
  INDEX idx_client_unit_documents_status (status)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_unit_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_type ENUM('reservation', 'downpayment', 'monthly', 'full_payment', 'legal_misc', 'other') NOT NULL,
  payment_method VARCHAR(100),
  bank_name VARCHAR(100),
  reference_no VARCHAR(150),
  remarks TEXT,
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  verified_by INT,
  verified_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_client_unit FOREIGN KEY (client_unit_id) REFERENCES client_units(id),
  CONSTRAINT fk_payments_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_payments_client_unit (client_unit_id),
  INDEX idx_payments_status_date (status, payment_date)
);

CREATE TABLE payment_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_unit_id INT NOT NULL,
  due_date DATE NOT NULL,
  amount_due DECIMAL(12,2) NOT NULL,
  amount_paid DECIMAL(12,2) DEFAULT 0,
  balance DECIMAL(12,2) DEFAULT 0,
  status ENUM('unpaid', 'partial', 'paid', 'overdue') DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_schedules_client_unit FOREIGN KEY (client_unit_id) REFERENCES client_units(id),
  INDEX idx_payment_schedules_due_status (due_date, status)
);

CREATE TABLE commission_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  agent_rate DECIMAL(5,2) DEFAULT 0,
  broker_rate DECIMAL(5,2) DEFAULT 0,
  manager_rate DECIMAL(5,2) DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_commission_plans_project FOREIGN KEY (project_id) REFERENCES projects(id),
  INDEX idx_commission_plans_status (status)
);

CREATE TABLE commissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_unit_id INT NOT NULL,
  user_id INT NOT NULL,
  commission_type ENUM('agent', 'broker', 'manager') NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status ENUM('pending', 'approved', 'released', 'cancelled') DEFAULT 'pending',
  approved_by INT,
  approved_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_commissions_client_unit FOREIGN KEY (client_unit_id) REFERENCES client_units(id),
  CONSTRAINT fk_commissions_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_commissions_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_commissions_user_status (user_id, status),
  INDEX idx_commissions_client_unit (client_unit_id)
);

CREATE TABLE cash_advances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  reason TEXT,
  status ENUM('pending', 'approved', 'deducted', 'rejected') DEFAULT 'pending',
  approved_by INT,
  approved_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cash_advances_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_cash_advances_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_cash_advances_user_status (user_id, status)
);

CREATE TABLE commission_releases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commission_id INT NOT NULL,
  cash_advance_id INT,
  gross_amount DECIMAL(12,2) NOT NULL,
  cash_advance_deduction DECIMAL(12,2) DEFAULT 0,
  net_released_amount DECIMAL(12,2) NOT NULL,
  released_by INT NOT NULL,
  released_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  remarks TEXT,
  CONSTRAINT fk_commission_releases_commission FOREIGN KEY (commission_id) REFERENCES commissions(id),
  CONSTRAINT fk_commission_releases_cash_advance FOREIGN KEY (cash_advance_id) REFERENCES cash_advances(id) ON DELETE SET NULL,
  CONSTRAINT fk_commission_releases_released_by FOREIGN KEY (released_by) REFERENCES users(id),
  INDEX idx_commission_releases_released_at (released_at)
);

-- Admin access-control tables

CREATE TABLE app_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature_key VARCHAR(80) NOT NULL UNIQUE,
  module VARCHAR(80) NOT NULL,
  label VARCHAR(120) NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE role_feature_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role ENUM('admin', 'treasury', 'manager', 'broker', 'agent', 'client') NOT NULL,
  feature_id INT NOT NULL,
  can_access BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_role_feature_permissions_feature FOREIGN KEY (feature_id) REFERENCES app_features(id) ON DELETE CASCADE,
  UNIQUE KEY uq_role_feature_permissions (role, feature_id)
);

CREATE TABLE user_feature_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  feature_id INT NOT NULL,
  is_allowed BOOLEAN NOT NULL,
  granted_by INT,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_feature_permissions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_feature_permissions_feature FOREIGN KEY (feature_id) REFERENCES app_features(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_feature_permissions_granted_by FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_user_feature_permissions (user_id, feature_id)
);

CREATE TABLE user_project_access (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_id INT NOT NULL,
  access_level ENUM('view', 'manage', 'admin') DEFAULT 'view',
  granted_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_project_access_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_project_access_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_project_access_granted_by FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_user_project_access (user_id, project_id)
);

CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(120) NOT NULL,
  module VARCHAR(80) NOT NULL,
  entity_table VARCHAR(80),
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_logs_user_date (user_id, created_at),
  INDEX idx_audit_logs_module_date (module, created_at)
);

-- Starter admin and default feature access

INSERT INTO users (full_name, email, password_hash, role, status)
VALUES ('System Admin', 'admin@dcprime.test', 'replace_with_bcrypt_hash', 'admin', 'active');

INSERT INTO app_features (feature_key, module, label) VALUES
('dashboard', 'dashboard', 'Dashboard'),
('projects', 'projects', 'Projects'),
('listings', 'listings', 'Listings'),
('clients_view', 'clients', 'Clients: View'),
('clients_manage', 'clients', 'Clients: Manage'),
('payments_view', 'payments', 'Payments: View'),
('payments_record', 'payments', 'Payments: Record'),
('payments_verify', 'payments', 'Payments: Verify'),
('commissions_view', 'commissions', 'Commissions: View'),
('commissions_approve', 'commissions', 'Commissions: Approve'),
('commissions_release', 'commissions', 'Commissions: Release'),
('documents_view', 'documents', 'Documents: View'),
('documents_upload', 'documents', 'Documents: Upload'),
('documents_approve', 'documents', 'Documents: Approve'),
('soa_view', 'soa', 'SOA: View'),
('reports_view', 'reports', 'Reports'),
('audit_logs', 'audit_logs', 'Audit Logs'),
('user_management', 'users', 'User Management'),
('settings', 'settings', 'Settings');

INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'admin', id, TRUE FROM app_features;

INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'treasury', id, TRUE FROM app_features
WHERE feature_key IN (
  'dashboard', 'clients_view', 'payments_view', 'payments_record',
  'payments_verify', 'documents_view', 'soa_view', 'reports_view'
);

INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'manager', id, TRUE FROM app_features
WHERE feature_key IN (
  'dashboard', 'projects', 'listings', 'clients_view', 'clients_manage',
  'payments_view', 'commissions_view', 'commissions_approve',
  'documents_view', 'documents_approve', 'soa_view', 'reports_view'
);

INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'broker', id, TRUE FROM app_features
WHERE feature_key IN (
  'dashboard', 'listings', 'clients_view', 'payments_view',
  'commissions_view', 'documents_view', 'soa_view'
);

INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'agent', id, TRUE FROM app_features
WHERE feature_key IN (
  'dashboard', 'listings', 'clients_view', 'payments_view',
  'commissions_view', 'documents_view', 'documents_upload', 'soa_view'
);

INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT 'client', id, TRUE FROM app_features
WHERE feature_key IN (
  'dashboard', 'payments_view', 'documents_view', 'documents_upload', 'soa_view'
);

-- Joined views for the admin system

CREATE OR REPLACE VIEW v_effective_user_permissions AS
SELECT
  u.id AS user_id,
  u.full_name,
  u.email,
  u.role,
  u.status AS user_status,
  f.feature_key,
  f.module,
  f.label,
  COALESCE(ufp.is_allowed, rfp.can_access, FALSE) AS can_access,
  CASE
    WHEN ufp.id IS NOT NULL THEN 'user_override'
    WHEN rfp.id IS NOT NULL THEN 'role_default'
    ELSE 'no_access'
  END AS permission_source
FROM users u
CROSS JOIN app_features f
LEFT JOIN role_feature_permissions rfp
  ON rfp.role = u.role AND rfp.feature_id = f.id
LEFT JOIN user_feature_permissions ufp
  ON ufp.user_id = u.id AND ufp.feature_id = f.id
WHERE f.status = 'active';

CREATE OR REPLACE VIEW v_client_accounts AS
SELECT
  cu.id AS client_unit_id,
  c.id AS client_id,
  c.full_name AS client_name,
  c.email,
  c.contact_no,
  seller.id AS seller_id,
  seller.full_name AS assigned_seller,
  p.id AS project_id,
  p.name AS project_name,
  p.location AS project_location,
  l.id AS listing_id,
  l.unit_id,
  l.lot_type,
  l.lot_area_sqm,
  cu.reservation_date,
  cu.contract_date,
  cu.selling_price,
  cu.downpayment,
  COALESCE(SUM(CASE WHEN pay.status = 'verified' THEN pay.amount ELSE 0 END), 0) AS verified_payments,
  cu.balance,
  cu.status AS account_status
FROM client_units cu
JOIN clients c ON c.id = cu.client_id
JOIN listings l ON l.id = cu.listing_id
JOIN projects p ON p.id = l.project_id
JOIN users seller ON seller.id = cu.assigned_seller_id
LEFT JOIN payments pay ON pay.client_unit_id = cu.id
GROUP BY
  cu.id, c.id, seller.id, p.id, l.id;

CREATE OR REPLACE VIEW v_document_checklist AS
SELECT
  cud.id AS client_unit_document_id,
  cu.id AS client_unit_id,
  c.full_name AS client_name,
  l.unit_id,
  d.name AS document_name,
  d.is_required,
  cud.status,
  cud.file_url,
  cud.remarks,
  cud.submitted_at,
  reviewer.full_name AS reviewed_by,
  cud.reviewed_at
FROM client_unit_documents cud
JOIN client_units cu ON cu.id = cud.client_unit_id
JOIN clients c ON c.id = cu.client_id
JOIN listings l ON l.id = cu.listing_id
JOIN documents d ON d.id = cud.document_id
LEFT JOIN users reviewer ON reviewer.id = cud.reviewed_by;

CREATE OR REPLACE VIEW v_payment_ledger AS
SELECT
  pay.id AS payment_id,
  cu.id AS client_unit_id,
  c.full_name AS client_name,
  l.unit_id,
  p.name AS project_name,
  pay.payment_date,
  pay.payment_type,
  pay.amount,
  pay.payment_method,
  pay.bank_name,
  pay.reference_no,
  pay.status,
  verifier.full_name AS verified_by,
  pay.verified_at
FROM payments pay
JOIN client_units cu ON cu.id = pay.client_unit_id
JOIN clients c ON c.id = cu.client_id
JOIN listings l ON l.id = cu.listing_id
JOIN projects p ON p.id = l.project_id
LEFT JOIN users verifier ON verifier.id = pay.verified_by;

CREATE OR REPLACE VIEW v_commission_releases AS
SELECT
  cr.id AS release_id,
  com.id AS commission_id,
  earner.full_name AS commission_earner,
  com.commission_type,
  com.rate,
  com.amount AS commission_amount,
  cr.gross_amount,
  cr.cash_advance_deduction,
  cr.net_released_amount,
  releaser.full_name AS released_by,
  cr.released_at,
  c.full_name AS client_name,
  l.unit_id,
  p.name AS project_name
FROM commission_releases cr
JOIN commissions com ON com.id = cr.commission_id
JOIN users earner ON earner.id = com.user_id
JOIN users releaser ON releaser.id = cr.released_by
JOIN client_units cu ON cu.id = com.client_unit_id
JOIN clients c ON c.id = cu.client_id
JOIN listings l ON l.id = cu.listing_id
JOIN projects p ON p.id = l.project_id;

