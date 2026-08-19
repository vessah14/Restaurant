namespace Backend.Dtos.Galerie
{
    public class ReorganiserGalerieDto
    {
        // Liste ordonnée des id d'images — l'index dans la liste devient le nouvel OrdreAffichage
        public List<long> OrdreImages { get; set; } = new();
    }
}