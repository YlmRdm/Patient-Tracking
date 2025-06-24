using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using PatientTrackingPlatform.Application.Common.Interfaces;
using PatientTrackingPlatform.Application.Features.Patients.Commands.CreatePatient;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Enums;
using PatientTrackingPlatform.Domain.Repositories;
using PatientTrackingPlatform.Domain.ValueObjects;
using Xunit;

namespace PatientTrackingPlatform.UnitTests.Application
{
    public class CreatePatientCommandHandlerTests
    {
        private readonly Mock<IPatientRepository> _mockPatientRepository;
        private readonly Mock<ICurrentUserService> _mockCurrentUserService;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly CreatePatientCommandHandler _handler;

        public CreatePatientCommandHandlerTests()
        {
            _mockPatientRepository = new Mock<IPatientRepository>();
            _mockCurrentUserService = new Mock<ICurrentUserService>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            
            _handler = new CreatePatientCommandHandler(
                _mockPatientRepository.Object,
                _mockCurrentUserService.Object,
                _mockUnitOfWork.Object);
        }

        [Fact]
        public async Task Handle_ValidCommand_ShouldCreatePatient()
        {
            var patientId = Guid.NewGuid();
            var command = new CreatePatientCommand
            {
                FirstName = "John",
                LastName = "Doe",
                DateOfBirth = new DateTime(1980, 1, 1),
                Gender = Gender.Male,
                IdentificationNumber = "12345678901",
                Street = "123 Main St",
                City = "Anytown",
                State = "State",
                ZipCode = "12345",
                Country = "Country",
                PhoneNumber = "555-1234",
                Email = "john.doe@example.com"
            };

            _mockPatientRepository.Setup(r => r.AddAsync(It.IsAny<Patient>()))
                .ReturnsAsync(patientId);

            var result = await _handler.Handle(command, CancellationToken.None);

            result.Should().Be(patientId);
            _mockPatientRepository.Verify(r => r.AddAsync(It.Is<Patient>(p =>
                p.FirstName == command.FirstName &&
                p.LastName == command.LastName &&
                p.IdentificationNumber == command.IdentificationNumber
            )), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}