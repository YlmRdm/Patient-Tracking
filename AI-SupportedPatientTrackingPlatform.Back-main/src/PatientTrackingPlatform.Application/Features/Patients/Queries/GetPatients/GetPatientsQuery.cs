using MediatR;
using PatientTrackingPlatform.Application.Common.Models;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.Patients.DTOs;

namespace PatientTrackingPlatform.Application.Features.Patients.Queries.GetPatients
{
    [Authorize(Roles = "Admin,Doctor")]
    public class GetPatientsQuery : IRequest<PaginatedList<PatientDto>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}