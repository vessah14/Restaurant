using Backend.Data;
using Backend.Dtos.Menu;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class PlatService : IPlatService
    {
        private readonly RestaurantDbContext _context;

        public PlatService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategorieMenuDto>> GetCarteAsync(string langue)
        {
            langue = langue.ToLower() == "en" ? "en" : "fr";

            var categories = await _context.CategoriesMenu
                .Include(c => c.Traductions)
                .Include(c => c.Plats).ThenInclude(p => p.Traductions)
                .OrderBy(c => c.OrdreAffichage)
                .ToListAsync();

            return categories.Select(c => new CategorieMenuDto
            {
                Id = c.Id,
                Code = c.Code,
                OrdreAffichage = c.OrdreAffichage,
                Nom = c.Traductions.FirstOrDefault(t => t.Langue == langue)?.Nom ?? c.Code,
                Plats = c.Plats
                    .Where(p => p.Disponible)
                    .OrderBy(p => p.OrdreAffichage)
                    .Select(p => MapVersDto(p, langue, c.Code))
                    .ToList()
            });
        }

        public async Task<IEnumerable<PlatDto>> GetAllAsync(string langue)
        {
            langue = langue.ToLower() == "en" ? "en" : "fr";

            var plats = await _context.Plats
                .Include(p => p.Traductions)
                .Include(p => p.Categorie)
                .OrderBy(p => p.OrdreAffichage)
                .ToListAsync();

            return plats.Select(p => MapVersDto(p, langue, p.Categorie?.Code ?? string.Empty));
        }

        public async Task<PlatDto?> GetByIdAsync(long id, string langue)
        {
            langue = langue.ToLower() == "en" ? "en" : "fr";

            var plat = await _context.Plats
                .Include(p => p.Traductions)
                .Include(p => p.Categorie)
                .FirstOrDefaultAsync(p => p.Id == id);

            return plat is null ? null : MapVersDto(plat, langue, plat.Categorie?.Code ?? string.Empty);
        }

        public async Task<PlatDto> CreerAsync(CreerPlatDto dto)
        {
            var categorieExiste = await _context.CategoriesMenu
                .AnyAsync(c => c.Id == dto.CategorieId);

            if (!categorieExiste)
                throw new InvalidOperationException("La catégorie du plat est introuvable.");

            var plat = new Plat
            {
                CategorieId = dto.CategorieId,
                Prix = dto.Prix,
                ImageUrl = dto.ImageUrl,
                Disponible = true,
                OrdreAffichage = dto.OrdreAffichage,
                DateCreation = DateTime.UtcNow,
                DateMaj = DateTime.UtcNow,
                Traductions = new List<PlatTraduction>
                {
                    new() { Langue = "fr", Nom = dto.NomFr, Description = dto.DescriptionFr },
                    new() { Langue = "en", Nom = dto.NomEn, Description = dto.DescriptionEn }
                }
            };

            _context.Plats.Add(plat);
            await _context.SaveChangesAsync();

            return new PlatDto
            {
                Id = plat.Id,
                Nom = dto.NomFr,
                Description = dto.DescriptionFr,
                Prix = plat.Prix,
                ImageUrl = plat.ImageUrl,
                Disponible = plat.Disponible,
                OrdreAffichage = plat.OrdreAffichage
            };
        }

        public async Task<PlatDto?> ModifierAsync(long id, ModifierPlatDto dto)
        {
            var plat = await _context.Plats
                .Include(p => p.Traductions)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plat is null) return null;

            plat.Prix = dto.Prix;
            plat.ImageUrl = dto.ImageUrl;
            plat.Disponible = dto.Disponible;
            plat.OrdreAffichage = dto.OrdreAffichage;
            plat.DateMaj = DateTime.UtcNow;

            var trFr = plat.Traductions.FirstOrDefault(t => t.Langue == "fr");
            if (trFr is not null)
            {
                trFr.Nom = dto.NomFr;
                trFr.Description = dto.DescriptionFr;
            }

            var trEn = plat.Traductions.FirstOrDefault(t => t.Langue == "en");
            if (trEn is not null)
            {
                trEn.Nom = dto.NomEn;
                trEn.Description = dto.DescriptionEn;
            }

            await _context.SaveChangesAsync();

            return new PlatDto
            {
                Id = plat.Id,
                Nom = dto.NomFr,
                Description = dto.DescriptionFr,
                Prix = plat.Prix,
                ImageUrl = plat.ImageUrl,
                Disponible = plat.Disponible,
                OrdreAffichage = plat.OrdreAffichage
            };
        }

        public async Task<bool> SupprimerAsync(long id)
        {
            var plat = await _context.Plats.FindAsync(id);
            if (plat is null) return false;

            _context.Plats.Remove(plat);
            await _context.SaveChangesAsync();
            return true;
        }

        private static PlatDto MapVersDto(Plat p, string langue, string categorieCode)
        {
            var traduction = p.Traductions.FirstOrDefault(t => t.Langue == langue);

            return new PlatDto
            {
                Id = p.Id,
                CategorieCode = categorieCode,
                Nom = traduction?.Nom ?? string.Empty,
                Description = traduction?.Description,
                Prix = p.Prix,
                ImageUrl = p.ImageUrl,
                Disponible = p.Disponible,
                OrdreAffichage = p.OrdreAffichage
            };
        }
    }
}