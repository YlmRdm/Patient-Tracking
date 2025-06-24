using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PatientTrackingPlatform.Domain.Entities;

namespace PatientTrackingPlatform.Persistence.Configurations
{
    public class PatientNoteConfiguration : IEntityTypeConfiguration<PatientNote>
    {
        public void Configure(EntityTypeBuilder<PatientNote> builder)
        {
            builder.HasKey(n => n.Id);
            
            builder.Property(n => n.Content)
                .HasMaxLength(5000)
                .IsRequired();
                
            builder.Property(n => n.DoctorId)
                .IsRequired();
                
            builder.Property(n => n.DoctorName)
                .HasMaxLength(200)
                .IsRequired();
        }
    }
}