using Microsoft.Extensions.Logging;
using PatientTrackingPlatform.Domain.Entities;
using PatientTrackingPlatform.Domain.Enums;
using PatientTrackingPlatform.Domain.ValueObjects;
using PatientTrackingPlatform.Infrastructure.Auth;
using PatientTrackingPlatform.Persistence.Contexts;

namespace PatientTrackingPlatform.Persistence.Data
{
    public class DataSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DataSeeder> _logger;
        private readonly TokenService _tokenService;

        public DataSeeder(
            ApplicationDbContext context,
            ILogger<DataSeeder> logger,
            TokenService tokenService)
        {
            _context = context;
            _logger = logger;
            _tokenService = tokenService;
        }

        public async Task SeedAsync()
        {
            try
            {
                if (!_context.Users.Any())
                {
                    _logger.LogInformation("Kullanıcı veri eklemesi başlatılıyor...");
                    await SeedUsersAsync();

                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Kullanıcı veri eklemesi tamamlandı.");
                    
                    _logger.LogInformation("Hasta veri eklemesi başlatılıyor...");
                    await SeedPatientsAsync();

                    await _context.SaveChangesAsync();
                    _logger.LogInformation("Hasta veri eklemesi tamamlandı.");
                }
                else
                {
                    _logger.LogInformation("Veritabanında kullanıcılar zaten mevcut, veri eklemesi atlanıyor.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Veritabanı veri eklemesi sırasında hata oluştu: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        private async Task SeedUsersAsync()
        {
            try
            {
                var adminPasswordSalt = CreateRandomSalt();
                var adminPasswordHash = HashPassword("Admin123!", adminPasswordSalt);

                var admin = new User(
                    "admin",
                    "admin@patienttracking.com",
                    adminPasswordHash,
                    adminPasswordSalt,
                    "Sistem",
                    "Yönetici",
                    UserRole.Admin);

                var doctorPasswordSalt = CreateRandomSalt();
                var doctorPasswordHash = HashPassword("Doctor123!", doctorPasswordSalt);

                var doctor = new User(
                    "doctor",
                    "doctor@patienttracking.com",
                    doctorPasswordHash,
                    doctorPasswordSalt,
                    "John",
                    "Smith",
                    UserRole.Doctor);

                _logger.LogInformation("Admin ve Doktor kullanıcıları oluşturuldu, veritabanına ekleniyor.");
                await _context.Users.AddRangeAsync(admin, doctor);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kullanıcı veri eklemesi sırasında hata oluştu: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        private async Task SeedPatientsAsync()
        {
            try
            {
                var users = _context.Users.ToList(); 
                _logger.LogInformation("Hasta notları için mevcut kullanıcılar: {Users}", 
                    string.Join(", ", users.Select(u => $"{u.Username}:{u.Role}")));
                
                var doctor = users.FirstOrDefault(u => u.Role == UserRole.Doctor);
                if (doctor == null)
                {
                    _logger.LogWarning("Hasta notları için doktor kullanıcısı bulunamadı. Geçici bir ID kullanılacak.");
                }
                
                var doctorId = doctor?.Id ?? Guid.NewGuid();
                var doctorName = doctor != null ? $"Dr. {doctor.FirstName} {doctor.LastName}" : "Dr. John Smith";
                
                _logger.LogInformation("Hasta notları için kullanılacak doktor: ID={DoctorId}, İsim={DoctorName}", 
                    doctorId, doctorName);

                var ahmetDogumTarihi = new DateTime(1985, 5, 15).ToUniversalTime();
                var ayseDogumTarihi = new DateTime(1990, 10, 20).ToUniversalTime();

                var patient1 = new Patient(
                    "Ahmet",
                    "Yılmaz",
                    ahmetDogumTarihi, 
                    Gender.Male,
                    "12345678901",
                    new Address("Atatürk Caddesi", "İstanbul", "Kadıköy", "34000", "Türkiye"),
                    new ContactInformation("5551234567", "ahmet.yilmaz@example.com"),
                    "Tip 2 diyabet, hipertansiyon");


                var patient2 = new Patient(
                    "Ayşe",
                    "Kaya",
                    ayseDogumTarihi,
                    Gender.Female,
                    "98765432109",
                    new Address("Cumhuriyet Caddesi", "İzmir", "Karşıyaka", "35000", "Türkiye"),
                    new ContactInformation("5559876543", "ayse.kaya@example.com"),
                    "Alerji, migren");
                
                try 
                {
                    _logger.LogInformation("Birinci hastaya not ekleniyor...");
                    patient1.AddNote("Hasta kontrole geldi, ilaçları yenilendi.", doctorId, doctorName);
                } 
                catch (Exception ex) 
                {
                    _logger.LogError(ex, "Birinci hastaya not eklerken hata oluştu: {ErrorMessage}", ex.Message);
                }

                try 
                {
                    _logger.LogInformation("İkinci hastaya not ekleniyor...");
                    patient2.AddNote("Kan tahlili yapıldı, sonuçlar normal.", doctorId, doctorName);
                } 
                catch (Exception ex) 
                {
                    _logger.LogError(ex, "İkinci hastaya not eklerken hata oluştu: {ErrorMessage}", ex.Message);
                }

                _logger.LogInformation("Hastalar oluşturuldu, veritabanına ekleniyor.");
                await _context.Patients.AddRangeAsync(patient1, patient2);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Hasta veri eklemesi sırasında hata oluştu: {ErrorMessage}", ex.Message);
                throw;
            }
        }

        private string CreateRandomSalt()
        {
            byte[] saltBytes = new byte[32]; 
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }

        private string HashPassword(string password, string salt)
        {
            byte[] saltBytes = Convert.FromBase64String(salt);
            using var hmac = new System.Security.Cryptography.HMACSHA512(saltBytes);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(computedHash);
        }
    }
}