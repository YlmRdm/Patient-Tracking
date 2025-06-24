using MediatR;
using PatientTrackingPlatform.Application.Features.Authentication.Common;

namespace PatientTrackingPlatform.Application.Features.Authentication.Commands.Login
{
    public class LoginCommand : IRequest<AuthenticationResult>
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}