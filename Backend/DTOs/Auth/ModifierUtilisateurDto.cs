namespace Backend.Dtos.Auth
{
    public class ModifierUtilisateurDto
    {
        public string Prenom { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string? Telephone { get; set; }
        public string? Email { get; set; }
        public string? MotDePasse { get; set; }
    }
}