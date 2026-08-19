namespace Backend.Dtos.Contact
{
    public class ModifierContactInfosDto
    {
        public string? Adresse { get; set; }
        public string? Telephone { get; set; }
        public string? Email { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        public string? HorairesFr { get; set; }
        public string? HorairesEn { get; set; }
    }
}