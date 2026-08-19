using Backend.Dtos.Reservation;

namespace Backend.Interfaces
{
    public interface IReservationService
    {
        Task<ReservationDto> CreerAsync(CreerReservationDto dto, int? utilisateurId);

        Task<IEnumerable<ReservationDto>> GetMesReservationsAsync(int utilisateurId);

        Task<IEnumerable<ReservationDto>> GetAllAsync(string? statut = null);

        Task<ReservationDto?> GetByIdAsync(long id);

        Task<ReservationDto?> ModifierStatutAsync(long id, ModifierStatutReservationDto dto);
    }
}