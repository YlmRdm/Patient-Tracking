using FluentAssertions;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Enums;
using PatientTrackingPlatform.Domain.Exceptions;
using PatientTrackingPlatform.Domain.ValueObjects;
using System;
using Xunit;

namespace PatientTrackingPlatform.UnitTests.Domain
{
    public class PatientTests
    {
        [Fact]
        public void CreatePatient_WithValidParameters_CreatesPatient()
        {
            // Arrange
            var firstName = "John";
            var lastName = "Doe";
            var dateOfBirth = new DateTime(1980, 1, 1);
            var gender = Gender.Male;
            var idNumber = "12345678901";
            var address = new Address("123 Main St", "Anytown", "State", "12345", "Country");
            var contactInfo = new ContactInformation("555-1234", "john.doe@example.com");

            // Act
            var patient = new Patient(firstName, lastName, dateOfBirth, gender, idNumber, address, contactInfo);

            // Assert
            patient.Should().NotBeNull();
            patient.FirstName.Should().Be(firstName);
            patient.LastName.Should().Be(lastName);
            patient.DateOfBirth.Should().Be(dateOfBirth);
            patient.Gender.Should().Be(gender);
            patient.IdentificationNumber.Should().Be(idNumber);
            patient.Address.Should().Be(address);
            patient.ContactInformation.Should().Be(contactInfo);
            patient.Id.Should().NotBe(Guid.Empty);
        }

        [Fact]
        public void CreatePatient_WithEmptyFirstName_ThrowsException()
        {
            // Arrange
            var lastName = "Doe";
            var dateOfBirth = new DateTime(1980, 1, 1);
            var gender = Gender.Male;
            var idNumber = "12345678901";
            var address = new Address("123 Main St", "Anytown", "State", "12345", "Country");
            var contactInfo = new ContactInformation("555-1234", "john.doe@example.com");

            // Act & Assert
            Action act = () => new Patient(string.Empty, lastName, dateOfBirth, gender, idNumber, address, contactInfo);
            act.Should().Throw<PatientTrackingDomainException>()
                .WithMessage("FirstName cannot be empty");
        }

        [Fact]
        public void AddNote_ValidParameters_AddsNoteToPatient()
        {
            // Arrange
            var patient = CreateValidPatient();
            var content = "Test note content";
            var doctorId = Guid.NewGuid();
            var doctorName = "Dr. Smith";

            // Act
            patient.AddNote(content, doctorId, doctorName);

            // Assert
            patient.Notes.Should().HaveCount(1);
            var note = patient.Notes[0];
            note.Content.Should().Be(content);
            note.DoctorId.Should().Be(doctorId);
            note.DoctorName.Should().Be(doctorName);
        }

        private Patient CreateValidPatient()
        {
            return new Patient(
                "John",
                "Doe",
                new DateTime(1980, 1, 1),
                Gender.Male,
                "12345678901",
                new Address("123 Main St", "Anytown", "State", "12345", "Country"),
                new ContactInformation("555-1234", "john.doe@example.com")
            );
        }
    }
}