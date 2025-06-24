using MediatR;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Application.Common.Models;

namespace PatientTrackingPlatform.Application.Features.Authentication.Commands.Register
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<string>>
    {
        private readonly IIdentityService _identityService;

        public RegisterCommandHandler(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
           
            var result = await _identityService.RegisterUserAsync(
                request.Username, 
                request.Email, 
                request.Password, 
                request.FirstName, 
                request.LastName, 
                request.Role);
                
            if (result.Succeeded)
            {
                return Result<string>.Success(request.Username);
            }

            return Result<string>.Failure(result.Errors);
        }
    }
}