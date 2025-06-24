using PatientTrackingPlatform.Domain.Common;
using PatientTrackingPlatform.Domain.Enums;
using PatientTrackingPlatform.Domain.Exceptions;

namespace PatientTrackingPlatform.Domain.Entities
{
    public class User : AuditableEntity
    {
        public string Username { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public UserRole Role { get; private set; }
        public bool IsActive { get; private set; }
        public string PasswordSalt { get; private set; } = string.Empty;


        private User() : base() { }

        public User(string username, string email, string passwordHash, string passwordSalt, string firstName, string lastName, UserRole role) : base()
        {
            ValidateConstructorParameters(username, email, passwordHash, firstName, lastName);

            Username = username;
            Email = email;
            PasswordHash = passwordHash;
            PasswordSalt = passwordSalt;
            FirstName = firstName;
            LastName = lastName;
            Role = role;
            IsActive = true;
        }

        private void ValidateConstructorParameters(string username, string email, string passwordHash, string firstName, string lastName)
        {
            if (string.IsNullOrWhiteSpace(username))
                throw new PatientTrackingDomainException("Username cannot be empty");

            if (string.IsNullOrWhiteSpace(email))
                throw new PatientTrackingDomainException("Email cannot be empty");

            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new PatientTrackingDomainException("PasswordHash cannot be empty");

            if (string.IsNullOrWhiteSpace(firstName))
                throw new PatientTrackingDomainException("FirstName cannot be empty");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new PatientTrackingDomainException("LastName cannot be empty");
        }

        public void Deactivate()
        {
            IsActive = false;
            LastModified = DateTime.UtcNow;
        }

        public void UpdateProfile(string firstName, string lastName, string email, string? username = null)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new PatientTrackingDomainException("FirstName cannot be empty");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new PatientTrackingDomainException("LastName cannot be empty");

            if (string.IsNullOrWhiteSpace(email))
                throw new PatientTrackingDomainException("Email cannot be empty");

            FirstName = firstName;
            LastName = lastName;
            Email = email;

            if (!string.IsNullOrWhiteSpace(username))
                Username = username;

            LastModified = DateTime.UtcNow;
        }

        public void UpdatePassword(string passwordHash, string passwordSalt)
        {
            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new PatientTrackingDomainException("PasswordHash cannot be empty");

            PasswordHash = passwordHash;
            PasswordSalt = passwordSalt;
            LastModified = DateTime.UtcNow;
        }

        public void ChangeRole(UserRole role)
        {
            Role = role;
            LastModified = DateTime.UtcNow;
        }
    }
}