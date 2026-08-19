using Backend.Data;
using Backend.Dtos.Faq;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class FaqService : IFaqService
    {
        private readonly RestaurantDbContext _context;

        public FaqService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FaqDto>> GetAllAsync(string langue)
        {
            langue = langue.ToLower() == "en" ? "en" : "fr"; // repli sur FR si valeur inattendue

            return await _context.Faqs
                .Include(f => f.Traductions)
                .OrderBy(f => f.OrdreAffichage)
                .Select(f => new FaqDto
                {
                    Id = f.Id,
                    OrdreAffichage = f.OrdreAffichage,
                    Question = f.Traductions
                        .Where(t => t.Langue == langue)
                        .Select(t => t.Question)
                        .FirstOrDefault() ?? string.Empty,
                    Reponse = f.Traductions
                        .Where(t => t.Langue == langue)
                        .Select(t => t.Reponse)
                        .FirstOrDefault() ?? string.Empty
                })
                .ToListAsync();
        }

        public async Task<FaqDto> CreerAsync(CreerFaqDto dto)
        {
            var faq = new Faq
            {
                OrdreAffichage = dto.OrdreAffichage,
                DateMaj = DateTime.UtcNow,
                Traductions = new List<FaqTraduction>
                {
                    new() { Langue = "fr", Question = dto.QuestionFr, Reponse = dto.ReponseFr },
                    new() { Langue = "en", Question = dto.QuestionEn, Reponse = dto.ReponseEn }
                }
            };

            _context.Faqs.Add(faq);
            await _context.SaveChangesAsync();

            return new FaqDto
            {
                Id = faq.Id,
                OrdreAffichage = faq.OrdreAffichage,
                Question = dto.QuestionFr,
                Reponse = dto.ReponseFr
            };
        }

        public async Task<FaqDto?> ModifierAsync(long id, ModifierFaqDto dto)
        {
            var faq = await _context.Faqs
                .Include(f => f.Traductions)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (faq is null) return null;

            faq.OrdreAffichage = dto.OrdreAffichage;
            faq.DateMaj = DateTime.UtcNow;

            var trFr = faq.Traductions.FirstOrDefault(t => t.Langue == "fr");
            if (trFr is not null)
            {
                trFr.Question = dto.QuestionFr;
                trFr.Reponse = dto.ReponseFr;
            }

            var trEn = faq.Traductions.FirstOrDefault(t => t.Langue == "en");
            if (trEn is not null)
            {
                trEn.Question = dto.QuestionEn;
                trEn.Reponse = dto.ReponseEn;
            }

            await _context.SaveChangesAsync();

            return new FaqDto
            {
                Id = faq.Id,
                OrdreAffichage = faq.OrdreAffichage,
                Question = dto.QuestionFr,
                Reponse = dto.ReponseFr
            };
        }

        public async Task<bool> SupprimerAsync(long id)
        {
            var faq = await _context.Faqs.FindAsync(id);
            if (faq is null) return false;

            _context.Faqs.Remove(faq); // les traductions liées partent avec (cascade)
            await _context.SaveChangesAsync();
            return true;
        }
    }
}