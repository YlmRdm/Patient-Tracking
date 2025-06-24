namespace PatientTrackingPlatform.Domain.Common
{
    public abstract class AuditableEntity : BaseEntity
    {
        private DateTime _created;
        private DateTime? _lastModified;
        
        public DateTime Created 
        { 
            get => _created;
            set => _created = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }
        
        public string? CreatedBy { get; set; }
        
        public DateTime? LastModified 
        { 
            get => _lastModified;
            set => _lastModified = value.HasValue ? 
                DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null;
        }
        
        public string? LastModifiedBy { get; set; }
        
        protected AuditableEntity() : base()
        {
            Created = DateTime.UtcNow; 
        }
    }
}