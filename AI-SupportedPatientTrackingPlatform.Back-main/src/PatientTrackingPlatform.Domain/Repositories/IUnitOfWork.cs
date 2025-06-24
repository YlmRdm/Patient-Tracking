namespace PatientTrackingPlatform.Domain.Repositories
{
    public interface IUnitOfWork
    {
        IPatientRepository PatientRepository { get; }
        IUserRepository UserRepository { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}