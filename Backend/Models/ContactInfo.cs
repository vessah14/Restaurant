namespace Backend.Models
{
    public class ContactInfos
    {
        public byte Id { get; set; } = 1; // toujours 1, une seule ligne en base

        public string? Adresse { get; set; }

        public string? Telephone { get; set; }

        public string? Email { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        public DateTime DateMaj { get; set; }

        public List<ContactInfosTraduction> Traductions { get; set; } = new();
    }
}