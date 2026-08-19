namespace Backend.Dtos.Menu
{
    public class CategorieMenuDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public int OrdreAffichage { get; set; }
        public List<PlatDto> Plats { get; set; } = new();
    }
}