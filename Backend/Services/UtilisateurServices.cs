using Backend.Data;
using Backend.Dtos.Auth;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Backend.Services
{
    public class UtilisateurService : IUtilisateurService
    {
        private readonly RestaurantDbContext _context;
        private readonly INotificationService _notificationService;

        public UtilisateurService(RestaurantDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<UtilisateurDto?> GetByIdAsync(int id)
        {
            var utilisateur = await _context.Utilisateurs
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            return utilisateur == null
                ? null
                : MapVersDto(utilisateur);
        }

        public async Task<UtilisateurDto?> GetByEmailAsync(string email)
        {
            var utilisateur = await _context.Utilisateurs
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);

            return utilisateur == null
                ? null
                : MapVersDto(utilisateur);
        }

        public async Task<IEnumerable<UtilisateurDto>> GetAllAsync(
     bool inclureInactifs = false)
        {
            var query = _context.Utilisateurs
                .Where(u => u.Role.ToLower() == "client");

            if (!inclureInactifs)
            {
                query = query.Where(u => u.Actif);
            }

            return await query
                .GroupJoin(
                    _context.Reservations,
                    u => u.Id,
                    r => r.UtilisateurId,
                    (u, reservations) => new UtilisateurDto
                    {
                        Id = u.Id,
                        Prenom = u.Prenom,
                        Nom = u.Nom,
                        Email = u.Email,
                        Telephone = u.Telephone,
                        Actif = u.Actif,
                        DateCreation = u.DateCreation,
                        Role = u.Role,
                        NombreReservations = reservations.Count(),
                        DernierAcces = reservations
                            .OrderByDescending(r => r.DateReservation)
                            .Select(r => r.DateReservation.ToDateTime(TimeOnly.MinValue))
                            .FirstOrDefault()
                    })
                .ToListAsync();
        }

        public async Task<UtilisateurDto> CreerAsync(
            CreerUtilisateurDto dto)
        {
            if (!MotDePasseEstSuffisammentFort(dto.MotDePasse))
            {
                throw new InvalidOperationException(
                    "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre."
                );
            }

            bool emailExiste = await EmailExisteAsync(dto.Email);

            if (emailExiste)
            {
                throw new InvalidOperationException(
                    "Cet email est déjà utilisé."
                );
            }

            var utilisateur = new Utilisateur
            {
                Prenom = dto.Prenom,
                Nom = dto.Nom,
                Email = dto.Email,
                MotDePasseHash =
                    BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse),
                Telephone = dto.Telephone,
                Role = "client",
                Actif = true,
                DateCreation = DateTime.UtcNow
            };

            _context.Utilisateurs.Add(utilisateur);

            await _context.SaveChangesAsync();

            return MapVersDto(utilisateur);
        }

        public async Task<UtilisateurDto?> ModifierAsync(
            int id,
            ModifierUtilisateurDto dto)
        {
            var utilisateur = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Id == id);

            if (utilisateur == null)
            {
                return null;
            }

            utilisateur.Prenom = string.IsNullOrWhiteSpace(dto.Prenom)
                ? utilisateur.Prenom
                : dto.Prenom.Trim();

            utilisateur.Nom = string.IsNullOrWhiteSpace(dto.Nom)
                ? utilisateur.Nom
                : dto.Nom.Trim();

            utilisateur.Telephone = string.IsNullOrWhiteSpace(dto.Telephone)
                ? utilisateur.Telephone
                : dto.Telephone.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Email) &&
                !string.Equals(utilisateur.Email, dto.Email.Trim(), StringComparison.OrdinalIgnoreCase))
            {
                var emailExiste = await _context.Utilisateurs
                    .AnyAsync(u => u.Id != id && u.Email == dto.Email.Trim());

                if (emailExiste)
                {
                    throw new InvalidOperationException("Cet email est déjà utilisé.");
                }

                utilisateur.Email = dto.Email.Trim();
            }

            if (!string.IsNullOrWhiteSpace(dto.MotDePasse))
            {
                if (!MotDePasseEstSuffisammentFort(dto.MotDePasse))
                {
                    throw new InvalidOperationException(
                        "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre."
                    );
                }

                utilisateur.MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse);
            }

            utilisateur.DateModification = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Créer une notification pour l'admin
            await _notificationService.CreerAsync(new Backend.Dtos.Notification.CreerNotificationDto
            {
                Type = "modification_profil",
                Titre = "Profil modifié",
                Message = $"{utilisateur.Prenom} {utilisateur.Nom} ({utilisateur.Email}) a modifié ses informations de profil.",
                TypeEntite = "utilisateur",
                EntiteId = utilisateur.Id,
                RoleCible = "admin"
            });

            return MapVersDto(utilisateur);
        }

        public async Task<bool> DesactiverAsync(int id)
        {
            var utilisateur = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Id == id);

            if (utilisateur == null)
            {
                return false;
            }

            utilisateur.Actif = false;
            utilisateur.DateModification = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ReactiverAsync(int id)
        {
            var utilisateur = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Id == id);

            if (utilisateur == null)
            {
                return false;
            }

            utilisateur.Actif = true;
            utilisateur.DateModification = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> EmailExisteAsync(string email)
        {
            return await _context.Utilisateurs
                .AnyAsync(u => u.Email == email);
        }

        private static UtilisateurDto MapVersDto(Utilisateur u)
        {
            return new UtilisateurDto
            {
                Id = u.Id,
                Prenom = u.Prenom,
                Nom = u.Nom,
                Email = u.Email,
                Telephone = u.Telephone,
                Actif = u.Actif,
                DateCreation = u.DateCreation,
                Role = u.Role
            };
        }

        private static bool MotDePasseEstSuffisammentFort(
            string motDePasse)
        {
            if (string.IsNullOrEmpty(motDePasse))
            {
                return false;
            }

            if (motDePasse.Length < 8)
            {
                return false;
            }

            if (!Regex.IsMatch(motDePasse, @"[A-Z]"))
            {
                return false;
            }

            if (!Regex.IsMatch(motDePasse, @"[0-9]"))
            {
                return false;
            }

            return true;
        }
    }
}