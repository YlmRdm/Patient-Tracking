using Microsoft.EntityFrameworkCore;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Repositories;
using PatientTrackingPlatform.Persistence.Contexts;

namespace PatientTrackingPlatform.Persistence.Repositories
{
    public class PatientRepository : RepositoryBase<Patient>, IPatientRepository
    {
        public PatientRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<Patient?> GetByIdAsync(Guid id)
        {
            return await _dbContext.Patients
                .Include(p => p.Notes)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Patient?> GetByIdentificationNumberAsync(string identificationNumber)
        {
            return await _dbContext.Patients
                .FirstOrDefaultAsync(p => p.IdentificationNumber == identificationNumber);
        }

        public async Task<bool> ExistsWithIdentificationNumberAsync(string identificationNumber)
        {
            return await _dbContext.Patients
                .AnyAsync(p => p.IdentificationNumber == identificationNumber);
        }

        public async Task<IEnumerable<Patient>> SearchAsync(string searchTerm)
        {
            var normalizedSearchTerm = searchTerm.ToLower();

            return await _dbContext.Patients
                .Where(p =>
                    p.FirstName.ToLower().Contains(normalizedSearchTerm) ||
                    p.LastName.ToLower().Contains(normalizedSearchTerm) ||
                    p.IdentificationNumber.ToLower().Contains(normalizedSearchTerm))
                .ToListAsync();
        }

        public override async Task<IEnumerable<Patient>> GetAllAsync()
        {
            return await _dbContext.Patients
                .Include(p => p.Notes)
                .ToListAsync();
        }

        
        public override Task UpdateAsync(Patient patient)
        {
            _dbContext.Entry(patient).State = EntityState.Modified;
            
            foreach (var note in patient.Notes)
            {
                var entry = _dbContext.Entry(note);
                if (entry.State == EntityState.Detached)
                {
                    _dbContext.PatientNotes.Add(note);
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.State = EntityState.Modified;
                }
            }
            return Task.CompletedTask;
        }

        public async Task<Guid> AddNoteAsync(PatientNote note, CancellationToken cancellationToken = default)
        {
            await _dbContext.PatientNotes.AddAsync(note, cancellationToken);
            return note.Id;
        }
    }
}