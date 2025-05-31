# E-Ticaret Ürün Yönetim Sistemi

Merhaba! Bu proje, basit bir e-ticaret ürün yönetim sistemi. NestJS ve React kullanarak yaptım. PostgreSQL veritabanı kullanıyor.

## Özellikler

- Kullanıcı girişi (JWT ile)
- Ürün listeleme
- Yeni ürün ekleme
- Ürün düzenleme
- Ürün silme
- Responsive tasarım
- Veritabanı migrasyonları ile güvenli şema yönetimi

## Kurulum

### Gereksinimler

- Node.js (v18 veya üstü)
- PostgreSQL (v14 veya üstü)
- npm veya yarn
- Git

### Veritabanı Kurulumu

1. PostgreSQL'i kurun ve çalıştırın.
2. `ecommerce_db` adında bir veritabanı oluşturun:
```sql
CREATE DATABASE ecommerce_db;
```

### Backend Kurulumu

1. Projeyi klonlayın:
```bash
git clone [proje-url]
cd e-ticaret
```

2. Backend klasörüne gidin:
```bash
cd backend
```

3. Bağımlılıkları yükleyin:
```bash
npm install
```

4. Backend klasöründe **`.env`** adında bir dosya oluşturun ve aşağıdaki bilgileri ekleyin:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_DATABASE=ecommerce_db
JWT_SECRET=your_secure_jwt_secret_key
```

5. Veritabanı migrasyonlarını çalıştırın:
```bash
# Migrasyonları oluştur (sadece şema değişikliği yapıldığında)
npm run migration:generate -- -n [MigrationName]

# Migrasyonları çalıştır
npm run migration:run

# Son migrasyonu geri almak için (gerekirse)
npm run migration:revert
```

6. Backend'i başlatın:
```bash
npm run start:dev
```

### Frontend Kurulumu

1. Yeni bir terminal açın (backend terminalinden farklı olmalı).
2. Frontend klasörüne gidin:
```bash
cd client
```

3. Bağımlılıkları yükleyin:
```bash
npm install
```

4. Frontend'i başlatın:
```bash
npm run dev
```

## Kullanım

1. Tarayıcıda `http://localhost:5173` adresine gidin.
2. Uygulamada kullanıcı kaydı özelliği **bulunmamaktadır**. Kullanıcılar veritabanına **elle eklenmelidir**.
3. Veritabanına kullanıcı eklemek için PostgreSQL komut satırını kullanın:
```sql
-- Örnek kullanıcı ekleme (şifre: 123456)
INSERT INTO users (email, password, "createdAt", "updatedAt")
VALUES ('admin@example.com', '$2b$10$YourHashedPasswordHere', NOW(), NOW());
```

4. Eklediğiniz kullanıcı bilgileriyle giriş yapabilirsiniz:
   - Email: [Veritabanına eklediğiniz kullanıcının e-postası]
   - Şifre: [Veritabanına eklediğiniz kullanıcının şifresi]

## Veritabanı Migrasyonları

Proje, TypeORM migrasyonları kullanarak veritabanı şemasını yönetir. Bu sayede:
- Veritabanı değişiklikleri sürüm kontrolü altında tutulur
- Değişiklikler güvenli bir şekilde uygulanabilir
- Gerektiğinde değişiklikler geri alınabilir
- Üretim ortamında veri kaybı riski minimize edilir

### Migrasyon Komutları

```bash
# Yeni bir migrasyon oluştur
npm run migration:generate -- -n [MigrationName]

# Migrasyonları çalıştır
npm run migration:run

# Son migrasyonu geri al
npm run migration:revert
```

## Teknolojiler

### Backend
- NestJS
- TypeORM (Migrasyonlar ile)
- PostgreSQL
- JWT Authentication
- Passport.js
- @nestjs/config (Ortam değişkenleri için)

### Frontend
- React
- Material-UI
- Axios
- React Router
- SweetAlert2 (Onay pop-up'ları için)

## Proje Yapısı

```
e-ticaret/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── migrations/  <-- Veritabanı migrasyonları
│   │   └── app.module.ts
│   ├── ormconfig.ts    <-- TypeORM yapılandırması
│   ├── .env           <-- Ortam değişkenleri
│   └── package.json
└── client/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── App.tsx
    └── package.json
```

## Hata Ayıklama

### Yaygın Hatalar ve Çözümleri

1. **Veritabanı Bağlantı Hatası**
   - PostgreSQL servisinin çalıştığından emin olun
   - `.env` dosyasındaki bağlantı bilgilerini kontrol edin
   - Veritabanının oluşturulduğundan emin olun

2. **Migrasyon Hataları**
   - `npm run migration:run` komutunu çalıştırmadan önce veritabanının oluşturulduğundan emin olun
   - Migrasyon dosyalarının `src/migrations` klasöründe olduğunu kontrol edin
   - Hata durumunda `npm run migration:revert` ile son migrasyonu geri alabilirsiniz

3. **JWT Token Hatası**
   - `.env` dosyasında `JWT_SECRET` değerinin doğru ayarlandığından emin olun
   - Token süresinin dolmadığından emin olun (varsayılan: 24 saat)
