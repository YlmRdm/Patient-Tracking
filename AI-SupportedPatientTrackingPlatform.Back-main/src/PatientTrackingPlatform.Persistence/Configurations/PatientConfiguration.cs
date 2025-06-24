using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PatientTrackingPlatform.Domain.Entities;

namespace PatientTrackingPlatform.Persistence.Configurations
{
    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(p => p.Id);
            
            builder.Property(p => p.FirstName)
                .HasMaxLength(100)
                .IsRequired();
                
            builder.Property(p => p.LastName)
                .HasMaxLength(100)
                .IsRequired();
                
            builder.Property(p => p.IdentificationNumber)
                .HasMaxLength(50)
                .IsRequired();
            
            builder.HasIndex(p => p.IdentificationNumber)
                .IsUnique();
               
            builder.OwnsOne(p => p.Address, a =>
            {
                a.Property(a => a.Street)
                    .HasMaxLength(100)
                    .IsRequired();
                    
                a.Property(a => a.City)
                    .HasMaxLength(100)
                    .IsRequired();
                    
                a.Property(a => a.State)
                    .HasMaxLength(100)
                    .IsRequired();
                    
                a.Property(a => a.ZipCode)
                    .HasMaxLength(20)
                    .IsRequired();
                    
                a.Property(a => a.Country)
                    .HasMaxLength(100)
                    .IsRequired();
            });
            
            builder.OwnsOne(p => p.ContactInformation, ci =>
            {
                ci.Property(ci => ci.PhoneNumber)
                    .HasMaxLength(30)
                    .IsRequired();
                    
                ci.Property(ci => ci.Email)
                    .HasMaxLength(100);
                    
                ci.Property(ci => ci.EmergencyContactName)
                    .HasMaxLength(100);
                    
                ci.Property(ci => ci.EmergencyContactPhone)
                    .HasMaxLength(30);
            });

            builder.HasMany(p => p.Notes)
                .WithOne()
                .HasForeignKey(n => n.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}