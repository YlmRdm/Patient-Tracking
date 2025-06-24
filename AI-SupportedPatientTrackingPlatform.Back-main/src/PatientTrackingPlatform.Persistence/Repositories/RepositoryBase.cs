using Microsoft.EntityFrameworkCore;
using PatientTrackingPlatform.Domain.Common;
using PatientTrackingPlatform.Persistence.Contexts;

namespace PatientTrackingPlatform.Persistence.Repositories
{
    public abstract class RepositoryBase<T> where T : BaseEntity
    {
        protected readonly ApplicationDbContext _dbContext;

        protected RepositoryBase(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public virtual async Task<T?> GetByIdAsync(Guid id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public virtual async Task<Guid> AddAsync(T entity)
        {
            await _dbContext.Set<T>().AddAsync(entity);
            return entity.Id;
        }

        public virtual Task UpdateAsync(T entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
            return Task.CompletedTask;
        }

        public virtual Task DeleteAsync(Guid id)
        {
            var entity = _dbContext.Set<T>().Find(id);
            if (entity != null)
            {
                _dbContext.Set<T>().Remove(entity);
            }
            return Task.CompletedTask;
        }
    }
}