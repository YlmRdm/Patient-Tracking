using PatientTrackingPlatform.Application.Common.Mappings;
using PatientTrackingPlatform.Domain.Entities;

namespace PatientTrackingPlatform.Application.Features.PatientNotes.DTOs
{
    public class PatientNoteDto : IMapFrom<PatientNote>
    {
        public Guid Id { get; set; }
        public Guid PatientId { get; set; }
        public string Content { get; set; } = string.Empty;
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime Created { get; set; }
        public DateTime? LastModified { get; set; }

        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<PatientNote, PatientNoteDto>();
        }
    }
}