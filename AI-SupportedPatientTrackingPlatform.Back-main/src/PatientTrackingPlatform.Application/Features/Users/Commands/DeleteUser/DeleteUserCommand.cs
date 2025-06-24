using MediatR;
using PatientTrackingPlatform.Application.Common.Security;

namespace PatientTrackingPlatform.Application.Features.Users.Commands.DeleteUser
{
    [Authorize(Roles = "Admin")]
    public class DeleteUserCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}