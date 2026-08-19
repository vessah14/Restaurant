namespace Backend.Dtos.Notification
{
    public class CreerNotificationDto
    {
        public string Type { get; set; } = string.Empty;
        public string Titre { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? TypeEntite { get; set; }
        public long? EntiteId { get; set; }
        public string? RoleCible { get; set; }
    }
}
