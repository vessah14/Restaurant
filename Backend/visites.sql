-- Table de comptage des visiteurs uniques par session et par jour.
-- Le backend empêche les doublons pour une même session le même jour.

CREATE TABLE IF NOT EXISTS Visites (
    Id BIGINT NOT NULL AUTO_INCREMENT,
    SessionId VARCHAR(128) NOT NULL,
    Source VARCHAR(100) NULL,
    Page VARCHAR(200) NULL,
    DateVisite DATETIME(6) NOT NULL,
    PRIMARY KEY (Id),
    INDEX IX_Visites_SessionId_DateVisite (SessionId, DateVisite),
    INDEX IX_Visites_DateVisite (DateVisite),
    INDEX IX_Visites_Source (Source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
