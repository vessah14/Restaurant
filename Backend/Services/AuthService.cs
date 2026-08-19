using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Backend.Data;
using Backend.Dtos.Auth;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly RestaurantDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;

        public AuthService(RestaurantDbContext context, IConfiguration config, IEmailService emailService, INotificationService notificationService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
            _notificationService = notificationService;
        }

        public async Task<LoginResponseDto?> ConnexionAsync(LoginDto dto)
        {
            var utilisateur = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Actif);

            if (utilisateur is null)
                return null;

            bool motDePasseValide = BCrypt.Net.BCrypt.Verify(dto.MotDePasse, utilisateur.MotDePasseHash);
            if (!motDePasseValide)
                return null;

            var (token, expiration) = GenererToken(utilisateur);

            return new LoginResponseDto
            {
                Token = token,
                Expiration = expiration,
                Utilisateur = new UtilisateurDto
                {
                    Id = utilisateur.Id,
                    Prenom = utilisateur.Prenom,
                    Nom = utilisateur.Nom,
                    Email = utilisateur.Email,
                    Telephone = utilisateur.Telephone,
                    Actif = utilisateur.Actif,
                    DateCreation = utilisateur.DateCreation,
                    Role = utilisateur.Role
                }
            };
        }

        public async Task DemanderResetMotDePasseAsync(DemanderResetMotDePasseDto dto)
        {
            var utilisateur = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Actif);

            if (utilisateur is null)
                return;

            var token = GenererTokenSecurise();
            utilisateur.ResetPasswordToken = token;
            utilisateur.ResetPasswordExpiration = DateTime.UtcNow.AddHours(1);
            await _context.SaveChangesAsync();

            var lienReset = $"{_config["FrontendUrl"]}/reinitialiser-mot-de-passe?token={token}";
            await _emailService.EnvoyerEmailResetMotDePasseAsync(
                utilisateur.Email, utilisateur.Prenom, lienReset);
        }

        public async Task<bool> ResetMotDePasseAsync(ResetMotDePasseDto dto)
        {
            if (dto.NouveauMotDePasse != dto.ConfirmationMotDePasse)
                throw new InvalidOperationException("Les mots de passe ne correspondent pas.");

            if (!MotDePasseEstSuffisammentFort(dto.NouveauMotDePasse)) // 👈 ajoute cette vérification
                throw new InvalidOperationException(
                    "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");

            var utilisateur = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.ResetPasswordToken == dto.Token);

            if (utilisateur is null)
                return false;

            if (utilisateur.ResetPasswordExpiration is null ||
                utilisateur.ResetPasswordExpiration < DateTime.UtcNow)
                return false;

            utilisateur.MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(dto.NouveauMotDePasse);
            utilisateur.ResetPasswordToken = null;
            utilisateur.ResetPasswordExpiration = null;
            utilisateur.DateModification = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<LoginResponseDto?> CreerAdminAsync(CreerUtilisateurDto dto)
        {
            // Vérifier si un admin existe déjà
            var adminExiste = await _context.Utilisateurs
                .AnyAsync(u => u.Role == "admin");

            if (adminExiste)
                throw new InvalidOperationException("Un administrateur existe déjà.");

            // Vérifier si l'email existe
            var emailExiste = await _context.Utilisateurs
                .AnyAsync(u => u.Email == dto.Email);

            if (emailExiste)
                throw new InvalidOperationException("Cet email est déjà utilisé.");

            // Vérifier la force du mot de passe
            if (!MotDePasseEstSuffisammentFort(dto.MotDePasse))
                throw new InvalidOperationException(
                    "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");

            var utilisateur = new Models.Utilisateur
            {
                Prenom = dto.Prenom,
                Nom = dto.Nom,
                Email = dto.Email,
                MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse),
                Telephone = dto.Telephone,
                Role = "admin",
                Actif = true,
                DateCreation = DateTime.UtcNow
            };

            _context.Utilisateurs.Add(utilisateur);
            await _context.SaveChangesAsync();

            var (token, expiration) = GenererToken(utilisateur);

            return new LoginResponseDto
            {
                Token = token,
                Expiration = expiration,
                Utilisateur = new UtilisateurDto
                {
                    Id = utilisateur.Id,
                    Prenom = utilisateur.Prenom,
                    Nom = utilisateur.Nom,
                    Email = utilisateur.Email,
                    Telephone = utilisateur.Telephone,
                    Actif = utilisateur.Actif,
                    DateCreation = utilisateur.DateCreation,
                    Role = utilisateur.Role
                }
            };
        }

        public async Task<LoginResponseDto?> InscriptionAsync(CreerUtilisateurDto dto)
        {
            // Vérifier si l'email existe
            var emailExiste = await _context.Utilisateurs
                .AnyAsync(u => u.Email == dto.Email);

            if (emailExiste)
                throw new InvalidOperationException("Cet email est déjà utilisé.");

            // Vérifier la force du mot de passe
            if (!MotDePasseEstSuffisammentFort(dto.MotDePasse))
                throw new InvalidOperationException(
                    "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");

            var utilisateur = new Models.Utilisateur
            {
                Prenom = dto.Prenom,
                Nom = dto.Nom,
                Email = dto.Email,
                MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse),
                Telephone = dto.Telephone,
                Role = "client",
                Actif = true,
                DateCreation = DateTime.UtcNow
            };

            _context.Utilisateurs.Add(utilisateur);
            await _context.SaveChangesAsync();

            // Créer une notification pour l'admin
            await _notificationService.CreerAsync(new Backend.Dtos.Notification.CreerNotificationDto
            {
                Type = "inscription",
                Titre = "Nouvelle inscription",
                Message = $"{utilisateur.Prenom} {utilisateur.Nom} ({utilisateur.Email}) s'est inscrit sur le site.",
                TypeEntite = "utilisateur",
                EntiteId = utilisateur.Id,
                RoleCible = "admin"
            });

            var (token, expiration) = GenererToken(utilisateur);

            return new LoginResponseDto
            {
                Token = token,
                Expiration = expiration,
                Utilisateur = new UtilisateurDto
                {
                    Id = utilisateur.Id,
                    Prenom = utilisateur.Prenom,
                    Nom = utilisateur.Nom,
                    Email = utilisateur.Email,
                    Telephone = utilisateur.Telephone,
                    Actif = utilisateur.Actif,
                    DateCreation = utilisateur.DateCreation,
                    Role = utilisateur.Role
                }
            };
        }

        private static bool MotDePasseEstSuffisammentFort(string motDePasse)
        {
            if (motDePasse.Length < 8) return false;
            if (!System.Text.RegularExpressions.Regex.IsMatch(motDePasse, @"[A-Z]")) return false;
            if (!System.Text.RegularExpressions.Regex.IsMatch(motDePasse, @"[0-9]")) return false;
            return true;
        }
        private (string Token, DateTime Expiration) GenererToken(Models.Utilisateur utilisateur)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, utilisateur.Id.ToString()),
                new(ClaimTypes.Role, utilisateur.Role),
                new(ClaimTypes.Email, utilisateur.Email),
                new(ClaimTypes.GivenName, utilisateur.Prenom)
            };

            var cle = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(cle, SecurityAlgorithms.HmacSha256);

            var expiration = DateTime.UtcNow.AddHours(2);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expiration,
                signingCredentials: credentials
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expiration);
        }

        private static string GenererTokenSecurise()
        {
            var bytes = RandomNumberGenerator.GetBytes(32);
            return Convert.ToBase64String(bytes)
                .Replace("+", "-").Replace("/", "_").Replace("=", "");
        }
    }
}