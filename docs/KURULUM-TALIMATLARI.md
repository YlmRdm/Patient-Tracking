# Proje Kurulum Talimatları


# 1. Ön Hazırlık: Gerekli Dosyaların Oluşturulması

- **backend.Dockerfile:** .NET backend uygulamasını containerize eder
- **frontend.Dockerfile:** Frontend uygulamasını nginx ile birlikte containerize eder
- **docker-compose.yml:** Uygulama servislerinin sunucu ortamında nasıl çalışacağını tanımlar
- **.github/workflows/ci-cd.yml:** Projenin CI/CD sürecini tanımlayan GitHub Actions dosyası

# 2. Github Repo ve Environment Variable Yapılandırılması

- **GitHub Reposu Oluşturulur:** Proje kodlarının ve dosyalarının tutulacağı bir GitHub reposu oluşturulur

- **GitHub Secrets:** Hassas bilgiler projenin GitHub reposunun Secrets bölümüne eklenir

# 3. AWS Altyapısının Kurulması

Production ve Staging sunucuları AWS Cloud üzerinde ayağa kaldırılacak

- **SSH Key Pair Oluşturma:** EC2 konsolunda sunuculara secure bağlantı için Key Pair (.pem) oluşturulur. Bu key'in değeri, Github secretına eklenir

- **Security Groups:** Trafiği kontrol etmek için security group oluşturuyoruz
        
            EC2-Instance-SG:
                  - HTTP (80) trafiğine sadece load balancerdan gelen isteklere izin verir  
                    SSH (22) trafiğine sadece CI/CD pipeline'ının veya bilinen ip adreslerinin erişimine izin verir


- **SSL/TLS Sertifikası Oluşturma (AWS Certificate Manager):**
*.domain.name için bir wildcard sertifika talebi oluştururuz.

Domain sahipliğini doğrulamak için ACM'in sağladığı cname kaydını domain providerın dns paneline ekleriz ve sertifika "Issued" durumuna gelir.

- **EC2 Sunucularının Oluşturulması:**
Production ve Staging için t2.medium tipinde instance kullanıyoruz. İşletim sistemi Ubuntu seçildikten sonra önceden
oluşturmuş oldugumuz ve github secretsa valuesunu yüklemiş olduğumuz pem dosyası seçilir. Ardından EC2 için oluşturmuş oldugumuz security grubunu seçeriz. Bu security groupta HTTP portuna erişimi, sadece ALB security grubunun erişebileceği şekilde ayarlarız. Böylece Prod serverın security grubu sadece ALB security grubundan gelen trafiğe izin verir. Bu şekilde Prod serverına dışarıdan erişim kesilmiş olur.   

Son olarak önceden hazırlamış olduğumuz bir script ile instance başlatılır. Her iki server için de aynı script kullanılabilir.

Kullanılacak olan script EC2 oluşturulurken en alt kısımda bulunan advanced details kısmındaki user data bölümüne yazılır. Kullanılan script:

```bash
    #!/bin/bash

    # Sistemin paket listesini günceller ve mevcut paketleri son versiyonlarına yükseltir
    apt-get update -y
    apt-get upgrade -y

    # CI/CD sürecinde ve kurulumda gerekli olan git aracını kurar
    apt-get install -y curl git

    # Dockerı kurar
    curl -fsSL https://get.docker.com | sh

    # Docker Compose eklentisini kurar
    apt-get install -y docker-compose-plugin

    # Docker servisinin, server her yeniden başladığında otomatik olarak çalışmasını sağlar
    systemctl enable docker

    # 'ubuntu' kullanıcısının 'sudo' kullanmadan docker komutlarını çalıştırabilmesi için
    # bu kullanıcıyı 'docker' grubuna ekler
    usermod -aG docker ubuntu

    # ubuntu kullanıcısının ana dizinine geçer
    cd /home/ubuntu

    # Repoyu githubdan sunucuya klonlar
    git clone https://github.com/turangozukara/patient-tracking.git

    # Klonlanan proje dosyalarının sahipliğini 'ubuntu' kullanıcısına vererek
    # olası izin hatalarını önler
    chown -R ubuntu:ubuntu /home/ubuntu/patient-tracking
```

- **Target Group Oluşturulması:** ALB'nin hangi sunucuları yakalayacağını bilmesini sağlamak için Target Group oluşturulması gerekmektedir. Target group oluşturarak Production sunucusunu bu target gruba ekliyoruz. 

Target group, Load Balancer'dan gelen trafiği Prod sunucusundaki 80 portuna yönlendirecek şekilde yapılandırılır.

- **Application Load Balancer (ALB) Kurulumu:**
ALB oluşturulmadan önce ALB için önden bir security group oluştururuz.  
                    ALB-Sec-Group  
                         - HTTP (80)  
                         -  HTTPS (443)

Patient-ALB adında bir ALB oluşturulur ve target group belirlenir. 

ALB'ye **HTTPS:443 listener**'ı eklenir ve daha önce oluşturmuş olduğumuz *.domain.name sertifikasının ataması yapılır. Listener trafiği ilgili target gruba yönlendirecektir.
**HTTP:80 listener**'ı ise gelen tüm trafiği HTTPS:443'e yönlendirecek şekilde yapılandırırız.

- **DNS Yönlendirmesi (CNAME Kaydı):**
Domain providerının DNS paneline CNAME kaydı ekleriz
www.domain.name -> Patient-ALB'nin DNS adresine yönlendiriyoruz.


# 4. CI/CD Sürecinin Çalıştırılması

- **Push:** Tüm altyapı hazırlandıktan sonra projenin kaynak kodunu, Dockerfile'ları, docker-compose'u ve ci-cd.yml dosyasını projenin github reposuna göndeririz.
- **GitHub Actions Trigger:** Bu push eventi .github/workflows/ci-cd.yml dosyasındaki pipelineı tetikler ve CI/CD sürecini başlatır. İlgili dosyalarda olan 
değişken değerlerini github actions repo içerisinde daha önceden oluşturduğumuz 'secrets' kısmından alır.