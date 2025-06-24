using PatientTrackingPlatform.Domain.Common;
using PatientTrackingPlatform.Domain.Exceptions;

namespace PatientTrackingPlatform.Domain.Entities
{
    public class PatientNote : AuditableEntity
    {
        public Guid PatientId { get; private set; }
        public string Content { get; private set; }
        public Guid DoctorId { get; private set; }
        public string DoctorName { get; private set; }
        
    
        private PatientNote() : base() { }

        public PatientNote(Guid patientId, string content, Guid doctorId, string doctorName) : base()
        {
            if (patientId == Guid.Empty)
                throw new PatientTrackingDomainException("Patient ID cannot be empty");
                
            if (string.IsNullOrWhiteSpace(content))
                throw new PatientTrackingDomainException("Content cannot be empty");
                
            if (doctorId == Guid.Empty)
                throw new PatientTrackingDomainException("Doctor ID cannot be empty");
                
            if (string.IsNullOrWhiteSpace(doctorName))
                throw new PatientTrackingDomainException("Doctor name cannot be empty");
                
            PatientId = patientId;
            Content = content;
            DoctorId = doctorId;
            DoctorName = doctorName;
        }

        public void UpdateContent(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new PatientTrackingDomainException("Content cannot be empty");
                
            Content = content;
            LastModified = DateTime.UtcNow;
        }
    }
}