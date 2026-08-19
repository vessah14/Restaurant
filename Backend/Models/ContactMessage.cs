namespace Backend.Models
{
    public class ContactMessage
    {
        public long Id { get; set; }
        
        public string Nom { get; set; } = string.Empty;
        
        public string Email { get; set; } = string.Empty;
        
        public string? Telephone { get; set; }
        
        public string Sujet { get; set; } = string.Empty;
        
        public string Message { get; set; } = string.Empty;
        
        public string Statut { get; set; } = "nouveau"; // nouveau, lu, repondu
        
        public DateTime DateCreation { get; set; }
        
        public DateTime? DateLecture { get; set; }
        
        public DateTime? DateReponse { get; set; }
        
        public string? Reponse { get; set; }
    }
}
