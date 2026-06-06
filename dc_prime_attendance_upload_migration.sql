USE dc_prime;

-- Barcode attendance and user media
ALTER TABLE users ADD COLUMN barcode_value VARCHAR(255) UNIQUE NULL;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL;

CREATE TABLE attendance_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  barcode_value VARCHAR(255) NOT NULL,
  type ENUM('time_in', 'time_out') NOT NULL,
  scanned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_by INT NULL,
  edited_at DATETIME NULL,
  original_time DATETIME NULL,
  notes TEXT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (edited_by) REFERENCES users(id),
  INDEX idx_attendance_logs_date (scanned_at),
  INDEX idx_attendance_logs_user_date (user_id, scanned_at)
);

-- Password reset flow
CREATE TABLE password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_password_reset_token (token),
  INDEX idx_password_reset_user (user_id, used, expires_at)
);

-- Cloudinary-backed receipts and document file identifiers
ALTER TABLE payments ADD COLUMN receipt_url VARCHAR(500) NULL;
ALTER TABLE payments ADD COLUMN receipt_public_id VARCHAR(255) NULL;
ALTER TABLE client_unit_documents ADD COLUMN file_public_id VARCHAR(255) NULL;

-- Feature seed for attendance access
INSERT INTO app_features (feature_key, module_name, display_name)
VALUES ('attendance', 'People', 'Attendance')
AS new_feature
ON DUPLICATE KEY UPDATE
  module_name = new_feature.module_name,
  display_name = new_feature.display_name;

INSERT INTO role_feature_permissions (role, feature_id, can_access)
SELECT role_name.role, f.id, TRUE
FROM app_features f
JOIN (
  SELECT 'owner' AS role
  UNION SELECT 'admin'
  UNION SELECT 'manager'
  UNION SELECT 'treasury'
) role_name
WHERE f.feature_key = 'attendance'
ON DUPLICATE KEY UPDATE can_access = TRUE;
