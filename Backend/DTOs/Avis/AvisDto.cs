namespace Backend.Dtos.Avis
{
    public class AvisDto
    {
        public long Id { get; set; }
        public string NomAffiche { get; set; } = string.Empty;
        public byte Note { get; set; }
        public string Commentaire { get; set; } = string.Empty;
        public string Statut { get; set; } = string.Empty;
        public DateOnly? DateAvis { get; set; }
        public DateTime DateCreation { get; set; }
    }
}