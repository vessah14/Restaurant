namespace Backend.Dtos.Statistiques
{
    public class EtapeConversionDto
    {
        public string Etape { get; set; } = string.Empty;
        public int Valeur { get; set; }
        public double Pourcentage { get; set; }
    }
}