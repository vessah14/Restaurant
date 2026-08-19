namespace Backend.Dtos.Statistiques
{
    public class EnregistrerVisiteDto
    {
        public string SessionId { get; set; } = string.Empty;
        public string? Source { get; set; }
        public string? Page { get; set; }
    }
}
