using PatientTrackingPlatform.Domain.Common;
using PatientTrackingPlatform.Domain.Exceptions;

namespace PatientTrackingPlatform.Domain.ValueObjects
{
    public class Address : ValueObject
    {
        public string Street { get; private set; }
        public string City { get; private set; }
        public string State { get; private set; }
        public string ZipCode { get; private set; }
        public string Country { get; private set; }

        private Address() { }

        public Address(string street, string city, string state, string zipCode, string country)
        {
            ValidateParameters(street, city, state, zipCode, country);
            
            Street = street;
            City = city;
            State = state;
            ZipCode = zipCode;
            Country = country;
        }
        
        private void ValidateParameters(string street, string city, string state, string zipCode, string country)
        {
            if (string.IsNullOrWhiteSpace(street))
                throw new PatientTrackingDomainException("Street cannot be empty");
                
            if (string.IsNullOrWhiteSpace(city))
                throw new PatientTrackingDomainException("City cannot be empty");
                
            if (string.IsNullOrWhiteSpace(state))
                throw new PatientTrackingDomainException("State cannot be empty");
                
            if (string.IsNullOrWhiteSpace(zipCode))
                throw new PatientTrackingDomainException("ZipCode cannot be empty");
                
            if (string.IsNullOrWhiteSpace(country))
                throw new PatientTrackingDomainException("Country cannot be empty");
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Street;
            yield return City;
            yield return State;
            yield return ZipCode;
            yield return Country;
        }
    }
}