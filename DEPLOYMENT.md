# Deployment Süreci
```
Bu proje GitHub Actions kullanılarak otomatize edildi. Bu süreç Staging ve Production ortamlarından oluşmaktadır.

CI süreci geliştirici kodunu github reposuna pushladığı anda otomatik olarak tetiklenir. Amaç, yeni eklenen kodun mevcut sistemi bozmamasını, kalite standartlarına uymasını ve deploy edilmeye hazır, güvenli Docker imajları üretmesini sağlamaktır.
Pipeline'daki her bir adım, bir önceki başarıyla tamamlanırsa başlar. Herhangi bir adımda hata alınırsa, pipeline durdurulur böylece hatalı kodun ileri aşamalara geçmesi engellenir.
```

---
### Code Quality & Testing
---
Bu jobın temel amacı repoya gönderilen kodun kalite standartlarına uyduğunu ve mevcut testleri geçip geçmediğini kontrol etmektir

- **Step 1: Checkout code**  
    Pipeline'ın çalışacağı sunucuya projenin güncel kodunu github reposundan çeker

- **Step 2: Setup .NET**  
Backend kodunu işleyebilmek için sunucuya .NET 9 SDK'sını kurar

- **Step 3: Setup Node.js**  
Frontend kodunu işleyebilmek için sunucuya node.js kurar. cache: 'npm' ayarı ile npm paketlerini cacheleyerek sonraki pipeline çalışmalarını hızlandırır

- **Step 4: Backend Dependencies**  
.NET projesinin ihtiyaç duyduğu tüm kütüphaneleri indirir

- **Step 5: Run Backend Tests**  
'dotnet test' komutunu çalıştırarak backend projesi içerisindeki tüm unit testleri çalıştırır. Tek bir test bile başarısız olursa pipeline durdurulur

- **Step 6: Install Frontend Dependencies**  
'npm ci' komutunu çalıştırır. Bu komut package-lock.json dosyasına bakarak frontend projesinin ihtiyacı olan tüm kütüphaneleri tam olarak belirtilen versiyonlarıyla indirir.
Burada 'npm install' komutu yerine 'npm ci' komutunun kullanılması pipeline'ın her çalışmasında birebir aynı ve tutarlı bir kurulum yapmasını sağlar

- **Step 7: Add ESLint to Angular project**  
'npx ng add @angular-eslint/schematics' komutunu çalıştırır. Bu, Angular projesine ESLint entegrasyonu ekler. Proje dosyalarını, linting işleminin yapılabilmesi için gerekli konfigürasyonlarla günceller.

- **Step 8: Run Frontend Linting**  
'npm run lint' komutunu çalıştırarak ESLint'in kodlama standartlarına uygun olmayan kısımları tespit etmesi için frontend kodunu taramasını sağlar. Böylece projedeki kod her zaman tutarlı ve temiz kalır

- **Step 9: Run Frontend Tests**  
'npm test' komutu ile Angular projesinin unit testlerini arayüz olmadan çalıştırır
---
### Build & Push Docker Images
---
Bu job testlerden geçen koddan imagelar oluşturur ve bunları Dockerhub'da saklar

- **Step 1: Checkout code**  
Bu yeni job için kodu sunucuya indirir

- **Step 2: Log in to Docker Hub**  
GitHub Secrets'ta saklanan DOCKER_USERNAME ve DOCKER_PASSWORD bilgilerini kullanarak Dockerhuba giriş yapar

- **Step 3: Build and push Backend image**  
backend.Dockerfile dosyasını kullanarak backend uygulaması için bir Docker imajı oluşturur ve bu imajı ':latest' etiketiyle Dockerhuba pushlar

- **Step 4: Build and push Frontend image**  
frontend.Dockerfile dosyasını kullanarak frontend uygulaması için bir Docker imajı oluşturur ve bunu da Dockerhuba pushlar

- **Step 5: Run Trivy vulnerability scanner**  
Dockerhub'a gönderilen backend imajını Trivy aracı ile tarayarak içinde bilinen güvenlik zafiyetleri olup olmadığını kontrol eder
---
### Deploy to Staging
---
Bu job hazırlanan Docker imajlarını alıp Staging sunucusuna kurar ve bu job herhangi bir onay gerekmeden, otomatik olarak deploy edilir

- **Step 1: Deploy to Staging Server**
GitHub Secrets'ta tanımlı olan STAGING_HOST, STAGING_USER ve STAGING_SSH_KEY bilgilerini kullanarak Staging sunucusuna ssh ile bağlanır.  
Bağlandıktan sonra aşağıdaki komutları sırasıyla çalıştırır:  

    cd /home/ubuntu/patient-tracking ---> Proje klasörüne gider  

    git pull ---> docker-compose.yml gibi dosyalarda bir değişiklik varsa en güncel halini çeker

    echo ... > .env: ---> GitHub Secrets'taki veritabanı ve JWT bilgilerini kullanarak sunucuda .env dosyası oluşturur. Ayrıca ASPNETCORE_ENVIRONMENT değişkenini Staging olarak ayarlar  

    docker compose pull: ---> build-and-push jobında Dockerhuba gönderilen güncel backend ve frontend imajlarını sunucuya çeker  

    docker compose up -d --build: ---> Yeni imajları kullanarak uygulamayı arka planda çalıştırır

---
### Deploy to Production
---
Bu job staging'de olan uygulamanın aynısını canlı ortama kurar, ancak öncesinde onay gerektirir.
- **Step 1: Wait for manual approval**  
Pipeline bu adımda durur ve yetkilinin github arayüzünden deployment için onay vermesini bekler
- **Step 2: Deploy to Production Server**  
Onay verildikten sonra PROD_HOST secretını kullanarak production sunucusuna bağlanır ve .env dosyasındaki ASPNETCORE_ENVIRONMENT değişkenini Production olarak ayarlar