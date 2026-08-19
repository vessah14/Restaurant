using System.ComponentModel.DataAnnotations;
namespace Backend.Dtos.Auth
{
    public class CreerUtilisateurDto
    {
        [Required, StringLength(100, MinimumLength = 1)]
         public string Prenom { get; set; } = string.Empty;
        [Required, StringLength(100, MinimumLength = 1)]
        public string Nom { get; set; } = string.Empty;
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required, MinLength(8, ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères.")]
        public string MotDePasse { get; set; } = string.Empty;
        [Phone]
        public string? Telephone { get; set; }
    }
}