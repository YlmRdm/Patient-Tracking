using Microsoft.EntityFrameworkCore;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Repositories;
using PatientTrackingPlatform.Persistence.Contexts;

namespace PatientTrackingPlatform.Persistence.Repositories
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> ExistsWithUsernameAsync(string username)
        {
            return await _dbContext.Users
                .AnyAsync(u => u.Username == username);
        }

        public async Task<bool> ExistsWithEmailAsync(string email)
        {
            return await _dbContext.Users
                .AnyAsync(u => u.Email == email);
        }

        public override async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbContext.Users.ToListAsync();
        }
    }
}