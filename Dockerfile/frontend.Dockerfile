# --- Build Stage ---
# Angular uygulamasını build etmek için node.js 20 image'ı kullanıyoruz
FROM node:20 AS build

WORKDIR /app

# Bağımlılıkların yüklenmesi için package.json ve package-lock.json kopyalıyoruz
COPY AI-SupportedPatientTrackingPlatform.UI-main/package*.json ./

RUN npm install

# Tüm frontend kaynak kodunu kopyalayıp production build alıyoruz
COPY AI-SupportedPatientTrackingPlatform.UI-main/. ./
RUN npm run build -- --configuration production

# --- Nginx Stage ---
# Build ettiğimiz dosyaları yayınlamak için nginxin daha küçük bir imageı olan alpine kullanıyoruz
# aynı zamanda bu imageı optimizasyon amacıyla kullanıyoruz
FROM nginx:1.27-alpine AS runtime

# build edilen dosyaları nginxin default dizinine kopyalıyoruz
COPY --from=build /app/dist/patient-tracking-platform /usr/share/nginx/html

# nginx konfigürasyon dosyasını kopyalıyoruz
COPY nginx.conf /etc/nginx/nginx.conf

# nginxin default olarak dinlediği 80 portunu expose ediyoruz
EXPOSE 80

# container başlatıldığında bu kodları çalıştırır
# "-g" parametresi global direktifleri belirtiyor
# "daemon off"  ile ön planda çalışmaya zorlanır ve böylece 
# containerın nginx processi kapandığında otomatik kapanmamasını sağlar
CMD ["nginx", "-g", "daemon off;"] 
