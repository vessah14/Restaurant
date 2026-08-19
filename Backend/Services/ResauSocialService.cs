using Backend.Data;
using Backend.Dtos.ReseauSocial;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ReseauSocialService : IReseauSocialService
    {
        private readonly RestaurantDbContext _context;

        public ReseauSocialService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReseauSocialDto>> GetAllAsync()
        {
            return await _context.ReseauxSociaux
                .OrderBy(r => r.OrdreAffichage)
                .Select(r => MapVersDto(r))
                .ToListAsync();
        }

        public async Task<ReseauSocialDto> CreerAsync(CreerReseauSocialDto dto)
        {
            var reseau = new ReseauSocial
            {
                Plateforme = dto.Plateforme,
                Url = dto.Url,
                OrdreAffichage = dto.OrdreAffichage
            };

            _context.ReseauxSociaux.Add(reseau);
            await _context.SaveChangesAsync();

            return MapVersDto(reseau);
        }

        public async Task<ReseauSocialDto?> ModifierAsync(int id, ModifierReseauSocialDto dto)
        {
            var reseau = await _context.ReseauxSociaux.FindAsync(id);
            if (reseau is null) return null;

            reseau.Plateforme = dto.Plateforme;
            reseau.Url = dto.Url;
            reseau.OrdreAffichage = dto.OrdreAffichage;

            await _context.SaveChangesAsync();
            return MapVersDto(reseau);
        }

        public async Task<bool> SupprimerAsync(int id)
        {
            var reseau = await _context.ReseauxSociaux.FindAsync(id);
            if (reseau is null) return false;

            _context.ReseauxSociaux.Remove(reseau);
            await _context.SaveChangesAsync();
            return true;
        }

        private static ReseauSocialDto MapVersDto(ReseauSocial r) => new()
        {
            Id = r.Id,
            Plateforme = r.Plateforme,
            Url = r.Url,
            OrdreAffichage = r.OrdreAffichage
        };
    }
}