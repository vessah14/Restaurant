namespace Backend.Models
{
    public class Avis
    {
        public long Id { get; set; }

        public int? UtilisateurId { get; set; }

        public string NomAffiche { get; set; } = string.Empty;

        public byte Note { get; set; }

        public string Commentaire { get; set; } = string.Empty;

        public string Statut { get; set; } = "en_attente";

        public DateOnly? DateAvis { get; set; }

        public DateTime DateCreation { get; set; }
    }
}