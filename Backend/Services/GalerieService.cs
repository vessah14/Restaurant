using Backend.Data;
using Backend.Dtos.Galerie;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class GalerieService : IGalerieService
    {
        private static readonly string[] CategoriesValides =
            { "interieur", "plats", "ambiance", "details", "evenements" };

        private readonly RestaurantDbContext _context;

        public GalerieService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GalerieDto>> GetAllAsync(string langue, string? categorie = null)
        {
            langue = langue.ToLower() == "en" ? "en" : "fr";

            var query = _context.Galeries
                .Include(g => g.Traductions)
                .AsQueryable();

            if (!string.IsNullOrEmpty(categorie))
                query = query.Where(g => g.Categorie == categorie);

            var images = await query
                .OrderBy(g => g.OrdreAffichage)
                .ToListAsync();

            return images.Select(g => new GalerieDto
            {
                Id = g.Id,
                ImageUrl = g.ImageUrl,
                Categorie = g.Categorie,
                OrdreAffichage = g.OrdreAffichage,
                Titre = g.Traductions.FirstOrDefault(t => t.Langue == langue)?.Titre
            });
        }

        public async Task<GalerieDto> AjouterAsync(AjouterImageGalerieDto dto)
        {
            if (!CategoriesValides.Contains(dto.Categorie))
                throw new InvalidOperationException("Catégorie invalide.");

            var image = new Galerie
            {
                ImageUrl = dto.ImageUrl,
                Categorie = dto.Categorie,
                OrdreAffichage = dto.OrdreAffichage,
                DateAjout = DateTime.UtcNow,
                Traductions = new List<GalerieTraduction>
                {
                    new() { Langue = "fr", Titre = dto.TitreFr },
                    new() { Langue = "en", Titre = dto.TitreEn }
                }
            };

            _context.Galeries.Add(image);
            await _context.SaveChangesAsync();

            return new GalerieDto
            {
                Id = image.Id,
                ImageUrl = image.ImageUrl,
                Categorie = image.Categorie,
                OrdreAffichage = image.OrdreAffichage,
                Titre = dto.TitreFr
            };
        }

        public async Task<bool> SupprimerAsync(long id)
        {
            var image = await _context.Galeries.FindAsync(id);
            if (image is null) return false;

            _context.Galeries.Remove(image);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task ReorganiserAsync(ReorganiserGalerieDto dto)
        {
            var images = await _context.Galeries
                .Where(g => dto.OrdreImages.Contains(g.Id))
                .ToListAsync();

            for (int i = 0; i < dto.OrdreImages.Count; i++)
            {
                var image = images.FirstOrDefault(g => g.Id == dto.OrdreImages[i]);
                if (image is not null)
                    image.OrdreAffichage = i;
            }

            await _context.SaveChangesAsync();
        }
    }
}