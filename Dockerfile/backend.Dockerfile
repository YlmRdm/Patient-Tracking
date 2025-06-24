# --- Build Stage ---
# Uygulamanın derlenmesi için .NET 9 SDK imageı kullanıyoruz
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# /app dizinine geçiş yapıyoruz.
WORKDIR /app

# Backend source kodunu containera kopyalıyoruz
COPY AI-SupportedPatientTrackingPlatform.Back-main/src/ ./src/

# API projesinin bulunduğu dizine geçiş yapıyoruz
WORKDIR /app/src/PatientTrackingPlatform.API

# NuGet paketlerini indirir
RUN dotnet restore

# Uygulamayı release modunda derler ve çıktıyı 'out' klasörüne alır.
RUN dotnet publish -c Release -o out

# --- Runtime Stage ---
# optimizasyon amacıyla sadece çalıştırmak için gerekli olan .net 9 runtime imageı kullanıyoruz.
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

# /app dizinine geçiş yapıyoruz
WORKDIR /app

# non-root bir kullanıcı oluşturup dizinin sahipligini veriyoruz
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

# Sadece publish edilen dosyalar runtime image'a kopyalanması saglanıyor
COPY --from=build /app/src/PatientTrackingPlatform.API/out .

# Uygulamanın dış dünyaya açacağı port belirtiyorz
EXPOSE 8080

# Uygulamayı başlatır
ENTRYPOINT ["dotnet", "PatientTrackingPlatform.API.dll"] 
