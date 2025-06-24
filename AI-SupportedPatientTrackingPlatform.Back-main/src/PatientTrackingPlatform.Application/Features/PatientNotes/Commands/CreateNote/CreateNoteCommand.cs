using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.PatientNotes.DTOs;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.Commands.CreateNote
{
    [Authorize(Roles = "Admin,Doctor")]
    public class CreateNoteCommand : IRequest<Guid>
    {
        public Guid PatientId { get; set; }
        public string Content { get; set; } = string.Empty;

        public static CreateNoteCommand FromDto(Guid patientId, CreateUpdateNoteDto dto)
        {
            return new CreateNoteCommand
            {
                PatientId = patientId,
                Content = dto.Content
            };
        }
    }
}