using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.Patients.DTOs;

namespace PatientTrackingPlatform.Application.Features.Patients.Queries.SearchPatients
{
    [Authorize(Roles = "Admin,Doctor")]
    public class SearchPatientsQuery : IRequest<IEnumerable<PatientDto>>
    {
        public string SearchTerm { get; set; } = string.Empty;
    }
}