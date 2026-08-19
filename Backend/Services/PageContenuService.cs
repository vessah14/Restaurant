using Backend.Data;
using Backend.Dtos.Pages;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class PageContenuService : IPageContenuService
    {
        private readonly RestaurantDbContext _context;

        public PageContenuService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<PageContenuDto?> GetBySlugAsync(string slug, string langue)
        {
            langue = langue.ToLower() == "en" ? "en" : "fr";

            var page = await _context.Pages
                .Include(p => p.Contenus)
                .FirstOrDefaultAsync(p => p.Slug == slug);

            if (page is null) return null;

            var contenu = page.Contenus.FirstOrDefault(c => c.Langue == langue);

            return new PageContenuDto
            {
                Slug = page.Slug,
                Titre = contenu?.Titre,
                Contenu = contenu?.Contenu,
                MetaTitre = contenu?.MetaTitre,
                MetaDescription = contenu?.MetaDescription
            };
        }

        public async Task<IEnumerable<PageContenuDto>> GetAllAsync(string langue)
        {
            langue = langue.ToLower() == "en" ? "en" : "fr";

            var pages = await _context.Pages
                .Include(p => p.Contenus)
                .ToListAsync();

            return pages.Select(p =>
            {
                var contenu = p.Contenus.FirstOrDefault(c => c.Langue == langue);
                return new PageContenuDto
                {
                    Slug = p.Slug,
                    Titre = contenu?.Titre,
                    Contenu = contenu?.Contenu,
                    MetaTitre = contenu?.MetaTitre,
                    MetaDescription = contenu?.MetaDescription
                };
            });
        }

        public async Task<PageContenuDto?> ModifierAsync(string slug, ModifierPageContenuDto dto)
        {
            var page = await _context.Pages
                .Include(p => p.Contenus)
                .FirstOrDefaultAsync(p => p.Slug == slug);

            if (page is null) return null;

            var trFr = page.Contenus.FirstOrDefault(c => c.Langue == "fr");
            if (trFr is null)
            {
                trFr = new PageContenu { PageId = page.Id, Langue = "fr" };
                _context.PagesContenu.Add(trFr);
            }
            trFr.Titre = dto.TitreFr;
            trFr.Contenu = dto.ContenuFr;
            trFr.MetaTitre = dto.MetaTitreFr;
            trFr.MetaDescription = dto.MetaDescriptionFr;
            trFr.DateMaj = DateTime.UtcNow;

            var trEn = page.Contenus.FirstOrDefault(c => c.Langue == "en");
            if (trEn is null)
            {
                trEn = new PageContenu { PageId = page.Id, Langue = "en" };
                _context.PagesContenu.Add(trEn);
            }
            trEn.Titre = dto.TitreEn;
            trEn.Contenu = dto.ContenuEn;
            trEn.MetaTitre = dto.MetaTitreEn;
            trEn.MetaDescription = dto.MetaDescriptionEn;
            trEn.DateMaj = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new PageContenuDto
            {
                Slug = page.Slug,
                Titre = dto.TitreFr,
                Contenu = dto.ContenuFr,
                MetaTitre = dto.MetaTitreFr,
                MetaDescription = dto.MetaDescriptionFr
            };
        }
    }
}