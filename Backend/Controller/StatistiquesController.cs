using Backend.Dtos.Statistiques;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")] // Toutes les routes de ce contrôleur sont réservées admin — §21
    public class StatistiquesController : ControllerBase
    {
        private readonly IStatistiquesService _statistiquesService;

        public StatistiquesController(IStatistiquesService statistiquesService)
        {
            _statistiquesService = statistiquesService;
        }

        [HttpGet]
        public async Task<ActionResult<StatistiquesDto>> GetStatistiquesGenerales()
        {
            try
            {
                var stats = await _statistiquesService.GetStatistiquesGeneralesAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, innerException = ex.InnerException?.Message });
            }
        }
    }
}