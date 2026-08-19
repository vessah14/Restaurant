namespace Backend.Dtos.Avis
{
    public class CreerAvisDto
    {
        public string NomAffiche { get; set; } = string.Empty;
        public byte Note { get; set; }
        public string Commentaire { get; set; } = string.Empty;
    }
}