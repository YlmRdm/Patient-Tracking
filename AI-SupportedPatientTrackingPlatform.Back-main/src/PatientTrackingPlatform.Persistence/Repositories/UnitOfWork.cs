using PatientTrackingPlatform.Domain.Repositories;
using PatientTrackingPlatform.Persistence.Contexts;

namespace PatientTrackingPlatform.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IPatientRepository _patientRepository;
        private readonly IUserRepository _userRepository;

        public UnitOfWork(
            ApplicationDbContext dbContext,
            IPatientRepository patientRepository,
            IUserRepository userRepository)
        {
            _dbContext = dbContext;
            _patientRepository = patientRepository;
            _userRepository = userRepository;
        }

        public IPatientRepository PatientRepository => _patientRepository;
        public IUserRepository UserRepository => _userRepository;

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}