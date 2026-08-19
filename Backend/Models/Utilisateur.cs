using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Utilisateur
    {
        public int Id { get; set; }

        public string Prenom { get; set; } = string.Empty;

        public string Nom { get; set; } = string.Empty;

        [MaxLength(191)]
        public string Email { get; set; } = string.Empty;

        public string MotDePasseHash { get; set; } = string.Empty;

        public string? Telephone { get; set; }

        public string Role { get; set; } = "client";

        public bool Actif { get; set; } = true;

        public DateTime DateCreation { get; set; }

        public DateTime? DateModification { get; set; }

        public string? ResetPasswordToken { get; set; }

        public DateTime? ResetPasswordExpiration { get; set; }
    }
}
