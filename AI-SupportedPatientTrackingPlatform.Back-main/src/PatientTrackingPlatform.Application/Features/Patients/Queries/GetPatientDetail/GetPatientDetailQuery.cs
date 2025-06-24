using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.Patients.DTOs;

namespace PatientTrackingPlatform.Application.Features.Patients.Queries.GetPatientDetail
{
    [Authorize(Roles = "Admin,Doctor")]
    public class GetPatientDetailQuery : IRequest<PatientDetailDto>
    {
        public Guid Id { get; set; }
    }
}