# Patient Tracking Platform

AI-Supported Patient Tracking Platform, gelişmiş Clean Architecture ve Domain-Driven Design prensiplerine dayalı, mikroservis mimarisine geçirilmeye hazır bir sağlık takip sistemidir.

## Proje Mimarisi

Proje, Clean Architecture prensiplerine uygun bir şekilde katmanlı olarak tasarlanmıştır:

```
API ➝ Application ➝ Domain 
           ↑
Infrastructure/Persistence
```

- **Domain**: Projenin en merkezinde, hiçbir dış bağımlılığı olmayan, iş kurallarını ve temel varlıkları içeren katman.
- **Application**: İş akışlarını, servis arayüzlerini ve uygulama mantığını içeren katman.
- **Infrastructure**: Dış sistemlerle entegrasyon sağlayan, servis implementasyonlarını içeren katman.
- **Persistence**: Veritabanı işlemlerini gerçekleştiren katman.
- **API**: Dış dünya ile iletişimi sağlayan REST API katmanı.

## Teknolojiler

- .NET 9.0 (ASP.NET Core Web API)
- PostgreSQL
- Entity Framework Core (Code-First)
- MediatR (CQRS)
- AutoMapper
- FluentValidation
- JWT Authentication
- Serilog
- Docker

## Kurulum

### Gereksinimler

- .NET 9.0 SDK
- Docker ve Docker Compose
- PostgreSQL (Docker üzerinden)

### Projeyi Çalıştırma

1. Repo'yu klonlayın:
   ```
   git clone https://github.com/yourusername/PatientTrackingPlatform.git
   cd PatientTrackingPlatform
   ```

2. Docker Compose ile çalıştırın:
   ```
   docker-compose up -d
   ```
   
   Bu komut, PostgreSQL veritabanını ve API'yi başlatacaktır.

3. API'ye şu adreslerden erişebilirsiniz:
   - http://localhost:5000 - HTTP
   - https://localhost:5001 - HTTPS (geliştirme sertifikası)

4. Swagger UI'a erişmek için:
   - http://localhost:5000/swagger

### Veritabanı Migrasyonları

Eğer Docker kullanmadan projeyi yerel geliştirme ortamında çalıştırmak isterseniz:

1. Migrasyon oluşturun:
   ```
   cd src/PatientTrackingPlatform.API
   dotnet ef migrations add InitialMigration -o ../PatientTrackingPlatform.Persistence/Migrations
   ```

2. Veritabanını güncelleyin:
   ```
   dotnet ef database update
   ```

## Fonksiyonel Modüller

1. **Authentication (JWT Tabanlı)**
   - Register / Login / Logout
   - Role-based authorization (Admin / Doctor)

2. **Patient Management**
   - Hasta Listeleme, Ekleme, Güncelleme, Silme (CRUD)
   - Hasta geçmişi
   - Doktor notları

3. **Prediction Module**
   - AI destekli tahminler için mock endpoint

## API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Giriş yapma

### Patients
- `GET /api/patients` - Tüm hastaları listele
- `GET /api/patients/{id}` - Hasta detayını getir
- `POST /api/patients` - Yeni hasta ekle
- `PUT /api/patients/{id}` - Hasta bilgilerini güncelle
- `DELETE /api/patients/{id}` - Hasta kaydını sil
- `GET /api/patients/search` - Hastalarda arama yap

### Patient Notes
- `GET /api/patients/{patientId}/notes` - Hasta notlarını listele
- `GET /api/patients/{patientId}/notes/{noteId}` - Hasta notu detayını getir
- `POST /api/patients/{patientId}/notes` - Yeni hasta notu ekle
- `PUT /api/patients/{patientId}/notes/{noteId}` - Hasta notunu güncelle

### Users
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/{id}` - Kullanıcı detayını getir
- `POST /api/users` - Yeni kullanıcı ekle (Admin yetkisi gerekli)
- `PUT /api/users/{id}` - Kullanıcı bilgilerini güncelle (Admin yetkisi gerekli)
- `DELETE /api/users/{id}` - Kullanıcıyı deaktive et (Admin yetkisi gerekli)

### Prediction
- `GET /api/prediction/{patientId}` - Hasta için tahmin sonuçlarını getir

## Mimari Yaklaşım

- **Clean Architecture**: Bağımlılık yönü her zaman iç katmanlara doğrudur. (Outside-in)
- **CQRS Pattern**: MediatR ile komut/sorgu ayrımı sağlanmıştır.
- **DDD (Domain-Driven Design)**: Rich domain model, value objects ve domain services.
- **Repository Pattern**: Veri erişim katmanı için tutarlı bir arayüz.
- **Unit of Work**: Transaksiyonel tutarlılık için.
- **Pipeline Behaviors**: Validation, logging, performance monitoring ve authorization için.
