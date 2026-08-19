-- Script de seed pour les informations de contact et les horaires d'ouverture
-- À exécuter si tu veux initialiser les données directement en base sans passer par l'API.

INSERT INTO ContactInfos (Id, Adresse, Telephone, Email, Latitude, Longitude, DateMaj)
VALUES (
    1,
    '2, rue de la Colombe, 75004 Paris',
    '+33 (0)1 46 33 37 08',
    'contact@lesdeuxcolombes.fr',
    48.8530,
    2.3499,
    NOW()
)
ON DUPLICATE KEY UPDATE
    Adresse = VALUES(Adresse),
    Telephone = VALUES(Telephone),
    Email = VALUES(Email),
    Latitude = VALUES(Latitude),
    Longitude = VALUES(Longitude),
    DateMaj = NOW();

INSERT INTO ContactInfosTraductions (Langue, Horaires, ContactInfosId)
VALUES
    (
        'fr',
        'Lundi: 12:00–14:30 · 19:00–22:00\nMardi: 12:00–14:30 · 19:00–22:00\nMercredi: 12:00–14:30 · 19:00–22:00\nJeudi: 12:00–14:30 · 19:00–22:00\nVendredi: 12:00–14:30 · 19:00–22:30\nSamedi: 12:00–14:30 · 19:00–22:30\nDimanche: Fermé toute la journée',
        1
    ),
    (
        'en',
        'Monday: 12:00–14:30 · 19:00–22:00\nTuesday: 12:00–14:30 · 19:00–22:00\nWednesday: 12:00–14:30 · 19:00–22:00\nThursday: 12:00–14:30 · 19:00–22:00\nFriday: 12:00–14:30 · 19:00–22:30\nSaturday: 12:00–14:30 · 19:00–22:30\nSunday: Closed all day',
        1
    )
ON DUPLICATE KEY UPDATE
    Horaires = VALUES(Horaires),
    ContactInfosId = VALUES(ContactInfosId);

-- Si tu veux réécrire uniquement les horaires en français :
-- UPDATE ContactInfosTraductions
-- SET Horaires = 'Lundi: ...\nMardi: ...'
-- WHERE Langue = 'fr';
