using Backend.Dtos.Auth;

namespace Backend.Dtos.Auth
{
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public UtilisateurDto Utilisateur { get; set; } = null!;
    }

    public class DemanderResetMotDePasseDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetMotDePasseDto
    {
        public string Token { get; set; } = string.Empty;
        public string NouveauMotDePasse { get; set; } = string.Empty;
        public string ConfirmationMotDePasse { get; set; } = string.Empty;
    }
}