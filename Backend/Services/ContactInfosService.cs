using Backend.Data;
using Backend.Dtos.Contact;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ContactInfosService : IContactInfosService
    {
        private readonly RestaurantDbContext _context;

        public ContactInfosService(RestaurantDbContext context)
        {
            _context = context;
        }

        public async Task<ContactInfosDto> GetAsync(string langue)
        {
            langue = langue.ToLower() == "en" ? "en" : "fr";

            var infos = await _context.ContactInfos
                .FirstOrDefaultAsync(c => c.Id == 1);

            var traductions = await _context.ContactInfosTraductions.ToListAsync();
            var horaires = traductions.FirstOrDefault(t => t.Langue == langue)?.Horaires;

            // Si la ligne n'existe pas encore (premier appel), on renvoie un objet vide plutôt qu'une erreur
            if (infos is null)
            {
                return new ContactInfosDto { Horaires = horaires };
            }

            return new ContactInfosDto
            {
                Adresse = infos.Adresse,
                Telephone = infos.Telephone,
                Email = infos.Email,
                Latitude = infos.Latitude,
                Longitude = infos.Longitude,
                Horaires = horaires
            };
        }

        public async Task<ContactInfosDto> ModifierAsync(ModifierContactInfosDto dto)
        {
            var infos = await _context.ContactInfos.FirstOrDefaultAsync(c => c.Id == 1);

            if (infos is null)
            {
                infos = new ContactInfos { Id = 1 };
                _context.ContactInfos.Add(infos);
            }

            infos.Adresse = dto.Adresse;
            infos.Telephone = dto.Telephone;
            infos.Email = dto.Email;
            infos.Latitude = dto.Latitude;
            infos.Longitude = dto.Longitude;
            infos.DateMaj = DateTime.UtcNow;

            var trFr = await _context.ContactInfosTraductions.FirstOrDefaultAsync(t => t.Langue == "fr");
            if (trFr is null)
            {
                trFr = new ContactInfosTraduction { Langue = "fr" };
                _context.ContactInfosTraductions.Add(trFr);
            }
            trFr.Horaires = dto.HorairesFr;

            var trEn = await _context.ContactInfosTraductions.FirstOrDefaultAsync(t => t.Langue == "en");
            if (trEn is null)
            {
                trEn = new ContactInfosTraduction { Langue = "en" };
                _context.ContactInfosTraductions.Add(trEn);
            }
            trEn.Horaires = dto.HorairesEn;

            await _context.SaveChangesAsync();

            return new ContactInfosDto
            {
                Adresse = infos.Adresse,
                Telephone = infos.Telephone,
                Email = infos.Email,
                Latitude = infos.Latitude,
                Longitude = infos.Longitude,
                Horaires = dto.HorairesFr
            };
        }
    }
}