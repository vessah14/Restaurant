namespace Backend.Models
{
    public class Reservation
    {
        public long Id { get; set; }

        public int? UtilisateurId { get; set; }

        public string Nom { get; set; } = string.Empty;

        public string Prenom { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Telephone { get; set; } = string.Empty;

        public short NombrePersonnes { get; set; }

        public DateOnly DateReservation { get; set; }

        public TimeOnly HeureReservation { get; set; }

        public string? Message { get; set; }

        public string Statut { get; set; } = "en_attente";

        public DateTime DateCreation { get; set; }

        public DateTime? DateModification { get; set; }
    }
}