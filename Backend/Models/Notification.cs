namespace Backend.Models
{
    public class Notification
    {
        public long Id { get; set; }
        
        public string Type { get; set; } = string.Empty; // inscription, message, reservation, modification_profil
        public string Titre { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        
        public string? TypeEntite { get; set; } // utilisateur, contact_message, reservation
        public long? EntiteId { get; set; }
        
        public bool EstLu { get; set; }
        public DateTime DateCreation { get; set; }
        public DateTime? DateLecture { get; set; }
        
        // Pour les notifications ciblées (optionnel)
        public string? RoleCible { get; set; } // admin, client
    }
}
