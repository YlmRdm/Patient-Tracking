using MediatR;
using PatientTrackingPlatform.Application.Common.Models;

namespace PatientTrackingPlatform.Application.Features.Authentication.Commands.Register
{
    public class RegisterCommand : IRequest<Result<string>>
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = "Doctor"; // Default role
    }
}