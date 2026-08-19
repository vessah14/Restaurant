namespace Backend.Dtos.Notification
{
    public class NotificationDto
    {
        public long Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Titre { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? TypeEntite { get; set; }
        public long? EntiteId { get; set; }
        public bool EstLu { get; set; }
        public DateTime DateCreation { get; set; }
        public DateTime? DateLecture { get; set; }
        public string? RoleCible { get; set; }
    }
}
