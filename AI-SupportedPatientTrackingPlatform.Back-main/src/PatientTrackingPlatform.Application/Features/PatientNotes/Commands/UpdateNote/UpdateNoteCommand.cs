using MediatR;
using PatientTrackingPlatform.Application.Common.Security;
using PatientTrackingPlatform.Application.Features.PatientNotes.DTOs;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.Commands.UpdateNote
{
    [Authorize(Roles = "Admin,Doctor")]
    public class UpdateNoteCommand : IRequest<bool>
    {
        public Guid NoteId { get; set; }
        public Guid PatientId { get; set; }
        public string Content { get; set; } = string.Empty;

        public static UpdateNoteCommand FromDto(Guid noteId, Guid patientId, CreateUpdateNoteDto dto)
        {
            return new UpdateNoteCommand
            {
                NoteId = noteId,
                PatientId = patientId,
                Content = dto.Content
            };
        }
    }
}