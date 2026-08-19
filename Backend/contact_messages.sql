-- Table pour stocker les messages de contact
CREATE TABLE ContactMessages (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    Nom VARCHAR(255) NOT NULL,
    Email VARCHAR(191) NOT NULL,
    Telephone VARCHAR(50) NULL,
    Sujet VARCHAR(255) NOT NULL,
    Message TEXT NOT NULL,
    Statut VARCHAR(50) DEFAULT 'nouveau' COMMENT 'nouveau, lu, repondu',
    DateCreation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DateLecture DATETIME NULL,
    DateReponse DATETIME NULL,
    Reponse TEXT NULL,
    INDEX idx_statut (Statut),
    INDEX idx_date_creation (DateCreation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
