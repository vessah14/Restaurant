using Backend.Dtos.Reservation;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationsController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        // Route PUBLIQUE — §10, accessible avec ou sans compte

        [HttpPost]
        public async Task<ActionResult<ReservationDto>> Creer(CreerReservationDto dto)
        {
            int? utilisateurId = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                utilisateurId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            }

            try
            {
                var reservation = await _reservationService.CreerAsync(dto, utilisateurId);
                return CreatedAtAction(nameof(GetById), new { id = reservation.Id }, reservation);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Route CLIENT CONNECTÉ — §11, historique de ses propres réservations

        [Authorize]
        [HttpGet("mes-reservations")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetMesReservations()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var reservations = await _reservationService.GetMesReservationsAsync(userId);
            return Ok(reservations);
        }

        // Routes ADMIN — §21

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetAll([FromQuery] string? statut = null)
        {
            var reservations = await _reservationService.GetAllAsync(statut);
            return Ok(reservations);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<ReservationDto>> GetById(long id)
        {
            var reservation = await _reservationService.GetByIdAsync(id);
            return reservation is null ? NotFound() : Ok(reservation);
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("{id}/statut")]
        public async Task<ActionResult<ReservationDto>> ModifierStatut(long id, ModifierStatutReservationDto dto)
        {
            try
            {
                var reservation = await _reservationService.ModifierStatutAsync(id, dto);
                return reservation is null ? NotFound() : Ok(reservation);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}