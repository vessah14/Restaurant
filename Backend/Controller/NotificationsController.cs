using Backend.Dtos.Notification;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // Routes ADMIN — Gestion des notifications

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetAll(
            [FromQuery] bool? estLu = null,
            [FromQuery] string? type = null)
        {
            var notifications = await _notificationService.GetAllAsync(estLu, type);
            return Ok(notifications);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("non-lus")]
        public async Task<ActionResult<int>> GetNombreNonLus()
        {
            var nombre = await _notificationService.GetNombreNonLusAsync("admin");
            return Ok(nombre);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<NotificationDto>> GetById(long id)
        {
            var notification = await _notificationService.GetByIdAsync(id);
            return notification == null ? NotFound() : Ok(notification);
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("{id}/marquer-lu")]
        public async Task<ActionResult<NotificationDto>> MarquerCommeLu(long id)
        {
            var notification = await _notificationService.MarquerCommeLuAsync(id);
            return notification == null ? NotFound() : Ok(notification);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("marquer-tous-lus")]
        public async Task<IActionResult> MarquerTousCommeLus()
        {
            await _notificationService.MarquerTousCommeLusAsync("admin");
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(long id)
        {
            var success = await _notificationService.SupprimerAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}
