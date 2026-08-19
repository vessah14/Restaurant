namespace Backend.Dtos.Reservation
{
    public class ModifierStatutReservationDto
    {
        public string Statut { get; set; } = string.Empty; // "confirmee", "annulee", "terminee"
    }
}