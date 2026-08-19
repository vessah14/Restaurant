namespace Backend.Dtos.Reservation
{
    public class CreerReservationDto
    {
        public string Nom { get; set; } = string.Empty;
        public string Prenom { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public short NombrePersonnes { get; set; }
        public DateOnly DateReservation { get; set; }
        public TimeOnly HeureReservation { get; set; }
        public string? Message { get; set; }
    }
}