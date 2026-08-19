using Backend.Data;
using Backend.Dtos.Statistiques;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitesController : ControllerBase
    {
        private readonly RestaurantDbContext _context;

        public VisitesController(RestaurantDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Enregistrer(EnregistrerVisiteDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.SessionId))
                return BadRequest(new { message = "Session de visite manquante." });

            var maintenant = DateTime.UtcNow;
            var debutJour = maintenant.Date;
            var finJour = debutJour.AddDays(1);

            var dejaComptee = await _context.Visites.AnyAsync(v =>
                v.SessionId == dto.SessionId &&
                v.DateVisite >= debutJour &&
                v.DateVisite < finJour);

            if (!dejaComptee)
            {
                _context.Visites.Add(new Visite
                {
                    SessionId = dto.SessionId.Trim(),
                    Source = string.IsNullOrWhiteSpace(dto.Source) ? "Direct" : dto.Source.Trim(),
                    Page = string.IsNullOrWhiteSpace(dto.Page) ? "/" : dto.Page.Trim(),
                    DateVisite = maintenant
                });

                await _context.SaveChangesAsync();
            }

            return Ok(new { enregistree = !dejaComptee });
        }
    }
}