using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using PatientTrackingPlatform.Application.Features.Authentication.Commands.Login;
using PatientTrackingPlatform.Application.Features.Authentication.Common;
using PatientTrackingPlatform.Application.Features.Patients.DTOs;
using PatientTrackingPlatform.Domain.Enums;
using PatientTrackingPlatform.Persistence.Contexts;
using Xunit;

namespace PatientTrackingPlatform.IntegrationTests
{
    public class PatientApiTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public PatientApiTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task CreatePatient_ValidData_ReturnsCreated()
        {

            var token = await GetAuthToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var patient = new CreateUpdatePatientDto
            {
                FirstName = "Integration",
                LastName = "Test",
                DateOfBirth = new DateTime(1990, 1, 1),
                Gender = Gender.Male,
                IdentificationNumber = $"IT-{Guid.NewGuid()}",
                Street = "Test Street",
                City = "Test City",
                State = "Test State",
                ZipCode = "12345",
                Country = "Test Country",
                PhoneNumber = "555-5555",
                Email = "integration.test@example.com"
            };

            var content = new StringContent(
                JsonSerializer.Serialize(patient),
                Encoding.UTF8,
                "application/json");


            var response = await _client.PostAsync("/api/patients", content);

            response.StatusCode.Should().Be(HttpStatusCode.Created);
            response.Headers.Location.Should().NotBeNull();
        }

        private async Task<string> GetAuthToken()
        {
            var loginCommand = new LoginCommand
            {
                Username = "admin",
                Password = "admin"
            };

            var content = new StringContent(
                JsonSerializer.Serialize(loginCommand),
                Encoding.UTF8,
                "application/json");

            var response = await _client.PostAsync("/api/auth/login", content);
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();
            var authResult = JsonSerializer.Deserialize<AuthenticationResult>(
                responseString,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return authResult.Token;
        }
    }

    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                });

                var sp = services.BuildServiceProvider();

                using (var scope = sp.CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<ApplicationDbContext>();

                    db.Database.EnsureCreated();

                }
            });
        }
    }
}