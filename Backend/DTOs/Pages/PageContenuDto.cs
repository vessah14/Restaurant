namespace Backend.Dtos.Pages
{
    public class PageContenuDto
    {
        public string Slug { get; set; } = string.Empty;
        public string? Titre { get; set; }
        public string? Contenu { get; set; }
        public string? MetaTitre { get; set; }
        public string? MetaDescription { get; set; }
    }
}
