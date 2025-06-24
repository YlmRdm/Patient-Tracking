using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.PatientNotes.DTOs;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.Queries.GetNoteDetail
{
    [Authorize(Roles = "Admin,Doctor")]
    public class GetNoteDetailQuery : IRequest<PatientNoteDto>
    {
        public Guid PatientId { get; set; }
        public Guid NoteId { get; set; }
    }
}