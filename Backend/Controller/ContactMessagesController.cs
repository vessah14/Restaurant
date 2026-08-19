using Backend.Dtos.Contact;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactMessagesController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactMessagesController(IContactService contactService)
        {
            _contactService = contactService;
        }

        // Route PUBLIQUE — Envoyer un message de contact
        [HttpPost]
        public async Task<ActionResult<ContactMessageDto>> Creer(CreerContactMessageDto dto)
        {
            try
            {
                var message = await _contactService.CreerAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = message.Id }, message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Routes ADMIN — Gestion des messages

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactMessageDto>>> GetAll([FromQuery] string? statut = null)
        {
            var messages = await _contactService.GetAllAsync(statut);
            return Ok(messages);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactMessageDto>> GetById(long id)
        {
            var message = await _contactService.GetByIdAsync(id);
            return message == null ? NotFound() : Ok(message);
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("{id}/marquer-lu")]
        public async Task<ActionResult<ContactMessageDto>> MarquerCommeLu(long id)
        {
            var message = await _contactService.MarquerCommeLuAsync(id);
            return message == null ? NotFound() : Ok(message);
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("{id}/repondre")]
        public async Task<ActionResult<ContactMessageDto>> Repondre(long id, RepondreContactMessageDto dto)
        {
            try
            {
                var message = await _contactService.RepondreAsync(id, dto);
                return message == null ? NotFound() : Ok(message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Supprimer(long id)
        {
            var success = await _contactService.SupprimerAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}
