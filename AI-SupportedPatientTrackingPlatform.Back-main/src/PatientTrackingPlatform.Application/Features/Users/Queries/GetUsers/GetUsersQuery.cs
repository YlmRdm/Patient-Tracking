using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.Users.DTOs;

namespace PatientTrackingPlatform.Application.Features.Users.Queries.GetUsers
{
    [Authorize(Roles = "Admin")]
    public class GetUsersQuery : IRequest<IEnumerable<UserDto>>
    {
        public bool IncludeInactive { get; set; } = false;
    }
}