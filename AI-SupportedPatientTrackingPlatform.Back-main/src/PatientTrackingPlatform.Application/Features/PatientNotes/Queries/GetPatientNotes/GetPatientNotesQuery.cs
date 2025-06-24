using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.PatientNotes.DTOs;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.Queries.GetPatientNotes
{
    [Authorize(Roles = "Admin,Doctor")]
    public class GetPatientNotesQuery : IRequest<IEnumerable<PatientNoteDto>>
    {
        public Guid PatientId { get; set; }
    }
}