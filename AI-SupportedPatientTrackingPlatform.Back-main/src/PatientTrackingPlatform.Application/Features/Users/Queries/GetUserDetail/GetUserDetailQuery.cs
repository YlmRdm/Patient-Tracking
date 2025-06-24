using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.Users.DTOs;

namespace PatientTrackingPlatform.Application.Features.Users.Queries.GetUserDetail
{
    [Authorize]
    public class GetUserDetailQuery : IRequest<UserDto>
    {
        public Guid Id { get; set; }
    }
}