using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Logging;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Application.Common.Models;
using PatientTrackingPlatform.Application.Features.Authentication.Common;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Enums;
using PatientTrackingPlatform.Domain.Repositories;

namespace PatientTrackingPlatform.Infrastructure.Auth
{
    public class IdentityService : IIdentityService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly TokenService _tokenService;
        private readonly ILogger<IdentityService> _logger;

        public IdentityService(
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            TokenService tokenService,
            ILogger<IdentityService> logger)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _tokenService = tokenService;
            _logger = logger;
        }

        public async Task<AuthenticationResult> AuthenticateAsync(string username, string password)
        {
            var result = new AuthenticationResult
            {
                Success = false,
                Errors = new List<string>()
            };

            try
            {
                var user = await _userRepository.GetByUsernameAsync(username);

                if (user == null || !user.IsActive)
                {
                    result.Errors.Add("User does not exist or is not active.");
                    return result;
                }

                if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                {
                    result.Errors.Add("Invalid credentials.");
                    return result;
                }

                var token = _tokenService.GenerateJwtToken(user);

                result.Success = true;
                result.Id = user.Id.ToString();
                result.UserName = user.Username;
                result.FirstName = user.FirstName;
                result.LastName = user.LastName;
                result.Email = user.Email;
                result.Token = token;
                result.Roles = new List<string> { user.Role.ToString() };

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during authentication for user {Username}", username);
                result.Errors.Add("An error occurred during authentication.");
                return result;
            }
        }

        public async Task<Result> RegisterUserAsync(string username, string email, string password, string firstName, string lastName, string role)
        {
            try
            {

                if (await _userRepository.ExistsWithUsernameAsync(username))
                {
                    return Result.Failure("Username is already taken.");
                }

                if (await _userRepository.ExistsWithEmailAsync(email))
                {
                    return Result.Failure("Email is already registered.");
                }

                if (!Enum.TryParse<UserRole>(role, true, out var userRole))
                {
                    return Result.Failure("Invalid role specified.");
                }

                var (passwordHash, passwordSalt) = await CreatePasswordHashAsync(password);

                var user = new User(
                    username,
                    email,
                    passwordHash,
                    passwordSalt,
                    firstName,
                    lastName,
                    userRole);

                await _userRepository.AddAsync(user);
                await _unitOfWork.SaveChangesAsync();

                return Result.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration for {Username}", username);
                return Result.Failure("An error occurred during registration.");
            }
        }

        public async Task<bool> IsInRoleAsync(string userId, string role)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                return false;
            }

            var user = await _userRepository.GetByIdAsync(userGuid);

            if (user == null || !user.IsActive)
            {
                return false;
            }

            return user.Role.ToString().Equals(role, StringComparison.OrdinalIgnoreCase);
        }

        public async Task<bool> AuthorizeAsync(string userId, string policyName)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                return false;
            }

            var user = await _userRepository.GetByIdAsync(userGuid);

            if (user == null || !user.IsActive)
            {
                return false;
            }

            return user.Role == UserRole.Admin;
        }

        public async Task<string> GetUserNameAsync(string userId)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                return string.Empty;
            }

            var user = await _userRepository.GetByIdAsync(userGuid);

            return user?.Username ?? string.Empty;
        }

        public Task<(string passwordHash, string passwordSalt)> CreatePasswordHashAsync(string password)
        {
            using var hmac = new HMACSHA512();
            var salt = Convert.ToBase64String(hmac.Key);
            var hash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));

            return Task.FromResult((hash, salt));
        }

        private bool VerifyPasswordHash(string password, string storedHash, string storedSalt)
        {
            var saltBytes = Convert.FromBase64String(storedSalt);

            using var hmac = new HMACSHA512(saltBytes);

            var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));

            return storedHash == computedHash;
        }
    }
}