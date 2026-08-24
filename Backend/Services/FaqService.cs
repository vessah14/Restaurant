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
        private readonly ITranslationService _translationService;

        public FaqService(RestaurantDbContext context, ITranslationService translationService)
        {
            _context = context;
            _translationService = translationService;
        }

        public async Task<IEnumerable<FaqDto>> GetAllAsync(string langue)
        {
            langue = langue.ToLower() == "en" ? "en" : "fr"; // repli sur FR si valeur inattendue

            var faqs = await _context.Faqs
                .Include(f => f.Traductions)
                .OrderBy(f => f.OrdreAffichage)
                .ToListAsync();

            var resultats = new List<FaqDto>();
            foreach (var faq in faqs)
            {
                var francais = faq.Traductions.FirstOrDefault(t => t.Langue == "fr");
                var traduction = faq.Traductions.FirstOrDefault(t => t.Langue == langue);
                var question = traduction?.Question;
                var reponse = traduction?.Reponse;

                if (langue == "en")
                {
                    question = string.IsNullOrWhiteSpace(question)
                        ? await _translationService.TraduireAsync(francais?.Question ?? string.Empty, "en")
                        : question;
                    reponse = string.IsNullOrWhiteSpace(reponse)
                        ? await _translationService.TraduireAsync(francais?.Reponse ?? string.Empty, "en")
                        : reponse;
                }

                resultats.Add(new FaqDto
                {
                    Id = faq.Id,
                    OrdreAffichage = faq.OrdreAffichage,
                    Question = question ?? string.Empty,
                    Reponse = reponse ?? string.Empty
                });
            }

            return resultats;
        }

        public async Task<FaqDto> CreerAsync(CreerFaqDto dto)
        {
            var faq = new Faq
            {
                OrdreAffichage = dto.OrdreAffichage,
                DateMaj = DateTime.UtcNow,
                Traductions = new List<FaqTraduction>
                {
                    new() { Langue = "fr", Question = dto.QuestionFr, Reponse = dto.ReponseFr }
                }
            };

            if (!string.IsNullOrWhiteSpace(dto.QuestionEn) || !string.IsNullOrWhiteSpace(dto.ReponseEn))
            {
                faq.Traductions.Add(new FaqTraduction
                {
                    Langue = "en",
                    Question = dto.QuestionEn,
                    Reponse = dto.ReponseEn
                });
            }

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