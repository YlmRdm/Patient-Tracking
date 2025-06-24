using PatientTrackingPlatform.Domain.Entities;

namespace PatientTrackingPlatform.Domain.Repositories
{
    public interface IPatientRepository
    {
        Task<IEnumerable<Patient>> GetAllAsync();
        Task<Patient?> GetByIdAsync(Guid id);
        Task<Patient?> GetByIdentificationNumberAsync(string identificationNumber);
        Task<bool> ExistsWithIdentificationNumberAsync(string identificationNumber);
        Task<IEnumerable<Patient>> SearchAsync(string searchTerm);
        Task<Guid> AddAsync(Patient patient);
        Task UpdateAsync(Patient patient);
        Task DeleteAsync(Guid id);
        Task<Guid> AddNoteAsync(PatientNote note, CancellationToken cancellationToken = default);
    }
}