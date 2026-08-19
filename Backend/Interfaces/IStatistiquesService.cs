using Backend.Dtos.Statistiques;

namespace Backend.Interfaces
{
    public interface IStatistiquesService
    {
        Task<StatistiquesDto> GetStatistiquesGeneralesAsync();
    }
}