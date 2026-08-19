namespace Backend.Dtos.Auth
{
    public class UtilisateurDto
    {
        public int Id { get; set; }
        public string Prenom { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telephone { get; set; }
        public bool Actif { get; set; }
        public DateTime DateCreation { get; set; }
        public int NombreReservations { get; set; } = 0;
        public DateTime? DernierAcces { get; set; }
        public string Role { get; set; } = "client";
    }
}