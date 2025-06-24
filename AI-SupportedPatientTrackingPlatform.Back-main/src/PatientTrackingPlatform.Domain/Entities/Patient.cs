using PatientTrackingPlatform.Domain.Common;
using PatientTrackingPlatform.Domain.Enums;
using PatientTrackingPlatform.Domain.Exceptions;
using PatientTrackingPlatform.Domain.ValueObjects;

namespace PatientTrackingPlatform.Domain.Entities
{
    public class Patient : AuditableEntity
    {
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        private DateTime _dateOfBirth;

        public DateTime DateOfBirth
        {
            get => _dateOfBirth;
            private set => _dateOfBirth = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }
        public Gender Gender { get; private set; }
        public string IdentificationNumber { get; private set; }
        public Address Address { get; private set; }
        public ContactInformation ContactInformation { get; private set; }
        public string? MedicalHistory { get; private set; }
        public List<PatientNote> Notes { get; private set; } = new List<PatientNote>();

        // For EF Core
        private Patient() : base() { }

        public Patient(
            string firstName,
            string lastName,
            DateTime dateOfBirth,
            Gender gender,
            string identificationNumber,
            Address address,
            ContactInformation contactInformation,
            string? medicalHistory = null) : base()
        {
            ValidateConstructorParameters(firstName, lastName, identificationNumber, address, contactInformation);

            FirstName = firstName;
            LastName = lastName;
            DateOfBirth = dateOfBirth;
            Gender = gender;
            IdentificationNumber = identificationNumber;
            Address = address;
            ContactInformation = contactInformation;
            MedicalHistory = medicalHistory;
        }

        private void ValidateConstructorParameters(string firstName, string lastName, string identificationNumber, Address address, ContactInformation contactInformation)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new PatientTrackingDomainException("FirstName cannot be empty");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new PatientTrackingDomainException("LastName cannot be empty");

            if (string.IsNullOrWhiteSpace(identificationNumber))
                throw new PatientTrackingDomainException("IdentificationNumber cannot be empty");

            if (address == null)
                throw new PatientTrackingDomainException("Address cannot be null");

            if (contactInformation == null)
                throw new PatientTrackingDomainException("ContactInformation cannot be null");
        }

        public void UpdatePersonalInformation(string firstName, string lastName, DateTime dateOfBirth, Gender gender)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new PatientTrackingDomainException("FirstName cannot be empty");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new PatientTrackingDomainException("LastName cannot be empty");

            FirstName = firstName;
            LastName = lastName;
            DateOfBirth = dateOfBirth;
            Gender = gender;
            LastModified = DateTime.UtcNow;
        }

        public void UpdateAddress(Address address)
        {
            if (address == null)
                throw new PatientTrackingDomainException("Address cannot be null");

            Address = address;
            LastModified = DateTime.UtcNow;
        }

        public void UpdateContactInformation(ContactInformation contactInformation)
        {
            if (contactInformation == null)
                throw new PatientTrackingDomainException("ContactInformation cannot be null");

            ContactInformation = contactInformation;
            LastModified = DateTime.UtcNow;
        }

        public void UpdateMedicalHistory(string medicalHistory)
        {
            MedicalHistory = medicalHistory;
            LastModified = DateTime.UtcNow;
        }

        public void AddNote(string content, Guid doctorId, string doctorName)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new PatientTrackingDomainException("Note content cannot be empty");

            if (doctorId == Guid.Empty)
                throw new PatientTrackingDomainException("Doctor ID cannot be empty");

            if (string.IsNullOrWhiteSpace(doctorName))
                throw new PatientTrackingDomainException("Doctor name cannot be empty");

            var note = new PatientNote(Id, content, doctorId, doctorName);
            Notes.Add(note);
            LastModified = DateTime.UtcNow;
        }
    }
}