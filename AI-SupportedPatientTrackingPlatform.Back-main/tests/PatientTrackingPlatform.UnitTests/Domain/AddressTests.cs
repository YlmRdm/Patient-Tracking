using FluentAssertions;
using PatientTrackingPlatform.Domain.Exceptions;
using PatientTrackingPlatform.Domain.ValueObjects;
using System;
using Xunit;

namespace PatientTrackingPlatform.UnitTests.Domain
{
    public class AddressTests
    {
        [Fact]
        public void CreateAddress_WithValidParameters_CreatesAddress()
        {
            // Arrange
            var street = "123 Main St";
            var city = "Anytown";
            var state = "State";
            var zipCode = "12345";
            var country = "Country";

            // Act
            var address = new Address(street, city, state, zipCode, country);

            // Assert
            address.Should().NotBeNull();
            address.Street.Should().Be(street);
            address.City.Should().Be(city);
            address.State.Should().Be(state);
            address.ZipCode.Should().Be(zipCode);
            address.Country.Should().Be(country);
        }

        [Theory]
        [InlineData("", "City", "State", "12345", "Country", "Street cannot be empty")]
        [InlineData("Street", "", "State", "12345", "Country", "City cannot be empty")]
        [InlineData("Street", "City", "", "12345", "Country", "State cannot be empty")]
        [InlineData("Street", "City", "State", "", "Country", "ZipCode cannot be empty")]
        [InlineData("Street", "City", "State", "12345", "", "Country cannot be empty")]
        public void CreateAddress_WithInvalidParameters_ThrowsException(
            string street, string city, string state, string zipCode, string country, string expectedErrorMessage)
        {
            // Act & Assert
            Action act = () => new Address(street, city, state, zipCode, country);
            act.Should().Throw<PatientTrackingDomainException>()
                .WithMessage(expectedErrorMessage);
        }

        [Fact]
        public void Equals_SameValues_ReturnsTrue()
        {
            // Arrange
            var address1 = new Address("Street", "City", "State", "12345", "Country");
            var address2 = new Address("Street", "City", "State", "12345", "Country");

            // Act & Assert
            address1.Should().Be(address2);
            (address1 == address2).Should().BeTrue();
        }

        [Fact]
        public void Equals_DifferentValues_ReturnsFalse()
        {
            // Arrange
            var address1 = new Address("Street1", "City", "State", "12345", "Country");
            var address2 = new Address("Street2", "City", "State", "12345", "Country");

            // Act & Assert
            address1.Should().NotBe(address2);
            (address1 == address2).Should().BeFalse();
        }
    }
}