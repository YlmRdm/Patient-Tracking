using PatientTrackingPlatform.Application.Common.Models;
using PatientTrackingPlatform.Application.Features.Authentication.Common;

namespace PatientTrackingPlatform.Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<AuthenticationResult> AuthenticateAsync(string username, string password);
        Task<Result> RegisterUserAsync(string username, string email, string password, string firstName, string lastName, string role);
        Task<bool> IsInRoleAsync(string userId, string role);
        Task<bool> AuthorizeAsync(string userId, string policyName);
        Task<string> GetUserNameAsync(string userId);
        Task<(string passwordHash, string passwordSalt)> CreatePasswordHashAsync(string password);
    }
}