-- Table pour stocker les notifications
CREATE TABLE IF NOT EXISTS Notifications (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(50) NOT NULL COMMENT 'inscription, message, reservation, modification_profil',
    Titre VARCHAR(255) NOT NULL,
    Message TEXT NOT NULL,
    TypeEntite VARCHAR(50) NULL COMMENT 'utilisateur, contact_message, reservation',
    EntiteId BIGINT NULL,
    EstLu TINYINT(1) NOT NULL DEFAULT 0,
    DateCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DateLecture DATETIME NULL,
    RoleCible VARCHAR(50) NULL DEFAULT 'admin' COMMENT 'admin, client',
    INDEX idx_type (Type),
    INDEX idx_est_lu (EstLu),
    INDEX idx_date_creation (DateCreation),
    INDEX idx_role_cible (RoleCible)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;