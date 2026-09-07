-- Création de l'administrateur par défaut
-- Nom: admin
-- Mot de passe: Admin123
-- Email: Admin28@gmail.com
-- Téléphone: 673054260

-- Supprimer l'admin existant s'il y en a un (pour éviter les doublons)
DELETE FROM Utilisateurs WHERE Role = 'admin';

-- Insérer l'admin par défaut
INSERT INTO Utilisateurs (Nom, Prenom, Email, MotDePasseHash, Telephone, Role, Actif, DateCreation)
VALUES (
    'admin',
    'Admin',
    'Admin28@gmail.com',
    '$2a$11$W0ly9VieYXL5mil1LG5yW.3AIBwmrj/aA1HQAd1EdtM/571j7tskK',
    '673054260',
    'admin',
    true,
    NOW()
);

-- Note: Le hash BCrypt ci-dessus correspond au mot de passe "Admin123"
