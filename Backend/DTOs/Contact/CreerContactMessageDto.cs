namespace Backend.Dtos.Contact
{
    public class CreerContactMessageDto
    {
        public string Nom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telephone { get; set; }
        public string Sujet { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
