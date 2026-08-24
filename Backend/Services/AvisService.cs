using Backend.Data;
using Backend.Dtos.Avis;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AvisService : IAvisService
    {
        private readonly RestaurantDbContext _context;
        private readonly ITranslationService _translationService;

        public AvisService(RestaurantDbContext context, ITranslationService translationService)
        {
            _context = context;
            _translationService = translationService;
        }

        public async Task<IEnumerable<AvisDto>> GetPubliesAsync(string langue)
        {
            langue = langue.ToLowerInvariant() == "en" ? "en" : "fr";
            var avisPublies = await _context.Avis
                .Where(a => a.Statut == "publie")
                .OrderByDescending(a => a.DateAvis)
                .ToListAsync();

            var resultats = new List<AvisDto>();
            foreach (var avis in avisPublies)
            {
                var dto = MapVersDto(avis);
                if (langue == "en")
                    dto.Commentaire = await _translationService.TraduireAsync(dto.Commentaire, "en");

                resultats.Add(dto);
            }

            return resultats;
        }

        public async Task<IEnumerable<AvisDto>> GetAllAsync(string? statut = null)
        {
            var query = _context.Avis.AsQueryable();

            if (!string.IsNullOrEmpty(statut))
                query = query.Where(a => a.Statut == statut);

            return await query
                .OrderByDescending(a => a.DateCreation)
                .Select(a => MapVersDto(a))
                .ToListAsync();
        }

        public async Task<AvisDto?> GetByIdAsync(long id)
        {
            var avis = await _context.Avis.FindAsync(id);
            return avis is null ? null : MapVersDto(avis);
        }

        public async Task<AvisDto> CreerAsync(CreerAvisDto dto, int? utilisateurId)
        {
            if (dto.Note < 1 || dto.Note > 5)
                throw new InvalidOperationException("La note doit être comprise entre 1 et 5.");

            var avis = new Avis
            {
                UtilisateurId = utilisateurId,
                NomAffiche = dto.NomAffiche,
                Note = dto.Note,
                Commentaire = dto.Commentaire,
                Statut = "en_attente",
                DateAvis = DateOnly.FromDateTime(DateTime.UtcNow),
                DateCreation = DateTime.UtcNow
            };

            _context.Avis.Add(avis);
            await _context.SaveChangesAsync();

            return MapVersDto(avis);
        }

        public async Task<AvisDto?> ModererAsync(long id, ModererAvisDto dto)
        {
            var avis = await _context.Avis.FindAsync(id);
            if (avis is null) return null;

            if (dto.Statut != "publie" && dto.Statut != "masque" && dto.Statut != "en_attente")
                throw new InvalidOperationException("Statut invalide.");

            avis.Statut = dto.Statut;
            await _context.SaveChangesAsync();

            return MapVersDto(avis);
        }

        public async Task<bool> SupprimerAsync(long id)
        {
            var avis = await _context.Avis.FindAsync(id);
            if (avis is null) return false;

            _context.Avis.Remove(avis);
            await _context.SaveChangesAsync();
            return true;
        }

        private static AvisDto MapVersDto(Avis a) => new()
        {
            Id = a.Id,
            NomAffiche = a.NomAffiche,
            Note = a.Note,
            Commentaire = a.Commentaire,
            Statut = a.Statut,
            DateAvis = a.DateAvis,
            DateCreation = a.DateCreation
        };
    }
}