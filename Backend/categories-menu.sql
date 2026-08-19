-- Initialise les quatre categories attendues par l'administration.
-- Script idempotent : peut etre execute plusieurs fois.

INSERT INTO CategoriesMenu (Id, Code, OrdreAffichage)
VALUES
    (1, 'entrees', 1),
    (2, 'plats', 2),
    (3, 'desserts', 3),
    (4, 'boissons', 4)
ON DUPLICATE KEY UPDATE
    Code = VALUES(Code),
    OrdreAffichage = VALUES(OrdreAffichage);

DELETE FROM CategoriesMenuTraductions;

INSERT INTO CategoriesMenuTraductions (CategorieId, Langue, Nom)
VALUES
    (1, 'fr', 'Entrees'),
    (1, 'en', 'Starters'),
    (2, 'fr', 'Plats'),
    (2, 'en', 'Main courses'),
    (3, 'fr', 'Desserts'),
    (3, 'en', 'Desserts'),
    (4, 'fr', 'Boissons'),
    (4, 'en', 'Drinks')
ON DUPLICATE KEY UPDATE
    Nom = VALUES(Nom);
