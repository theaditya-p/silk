````markdown name=README.md
# 🌾 रेशीम पालन - ऑनलाइन दुकान (Silkworm E-Commerce Store)

🐛 किसानांसाठी उच्च गुणवत्तेचे रेशीम कीटांचे अंडे ऑनलाइन विक्रय करण्यासाठी एक संपूर्ण ई-कॉमर्स प्लॅटफॉर्म।

*A complete e-commerce platform for selling high-quality silkworm eggs to farmers online.*

## ✨ मुख्य वैशिष्ट्ये (Key Features)

- 🐛 **उत्पाद सूची** (Product Listing) - विविध प्रमाणात रेशीम कीटांचे अंडे (50, 100, 150, 200, 250)
- 🛒 **शॉपिंग कार्ट** (Shopping Cart) - आसान कार्ट व्यवस्थापन
- 👤 **वापरकर्ता प्रमाणीकरण** (User Authentication) - सुरक्षित साइन अप आणि लॉगइन
- 💳 **चेकआउट प्रणाली** (Checkout System) - वितरण विवरण सहित ऑर्डर तयार करा
- 📦 **ऑर्डर ट्रैकिंग** (Order Tracking) - आपले ऑर्डर ट्रॅक करा
- 👨‍💼 **प्रशासक पैनल** (Admin Panel) - सर्व ऑर्डर व्यवस्थापन
- 🌍 **मराठी भाषा समर्थन** (Marathi Language Support) - 100% मराठीमध्ये
- 📱 **मोबाइल अनुकूल** (Mobile Responsive) - सर्व डिव्हाइसवर काम करते

## 🛠️ तांत्रिक स्टॅक (Tech Stack)

### Frontend (फ्रंटएंड)
- HTML5, CSS3, JavaScript
- Responsive Design with CSS Grid & Flexbox
- Mobile-friendly UI

### Backend (बॅकएंड)
- Node.js + Express.js
- SQLite Database
- JWT Authentication
- bcryptjs for Password Hashing

### Libraries (लायब्ररीज)
- express - Web framework
- sqlite3 - Database
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin requests
- dotenv - Environment variables

## 📋 आवश्यकता (Requirements)

- Node.js (v14 या अधिक)
- npm (v6 या अधिक)

## 🚀 त्वरित शुरुआत (Quick Start)

### 1. Repository Clone करा
\`\`\`bash
git clone https://github.com/theaditya-p/silk.git
cd silk
\`\`\`

### 2. डिपेंडेंसीज इंस्टॉल करा
\`\`\`bash
npm install
\`\`\`

### 3. सर्व्हर चालू करा
\`\`\`bash
npm start
\`\`\`

सर्व्हर **http://localhost:5000** वर चालू होईल

## 📱 वापरकर्ता प्रवाह (User Flow)

### 1️⃣ साइन अप (Sign Up)
- नाव, ईमेल, फोन नंबर ���णि पासवर्ड प्रविष्ट करा
- खाते तयार होईल आणि आपण लॉगइन होईल

### 2️⃣ लॉगइन (Login)
- ईमेल आणि पासवर्ड सह लॉगइन करा
- आपल्या डॅशबोर्डमध्ये प्रवेश करा

### 3️⃣ उत्पाद ब्राउज करा (Browse Products)
- सर्व रेशीम कीटांचे अंडे पहा
- विविध प्रमाणात (50, 100, 150, 200, 250) उपलब्ध

### 4️⃣ प्रमाण निवडा (Select Quantity)
- आवश्यक प्रमाण प्रविष्ट करा
- "कार्टमध्ये जोडा" बटण दाबा

### 5️⃣ कार्ट व्यवस्थापित करा (Manage Cart)
- कार्टमधील वस्तू पहा
- आवश्यक असल्यास हटवा

### 6️⃣ चेकआउट (Checkout)
- वितरण पता भरा
- शहर, राज्य, पिन कोड प्रविष्ट करा
- "ऑर्डर प्लेस करा" दाबा

### 7️⃣ ऑर्डर ट्रॅक करा (Track Order)
- आपल्या प्रोफाइलमध्ये ऑर्डर पहा
- स्थिति अपडेट ट्रॅक करा

## 📊 डेटाबेस तक्ते (Database Tables)

### Users (वापरकर्ता)
\`\`\`
id, name, email, phone, password, address, city, state, pincode, created_at
\`\`\`

### Products (उत्पाद)
\`\`\`
id, name, description, quantity, price, image, created_at
\`\`\`

### Cart (कार्ट)
\`\`\`
id, user_id, product_id, quantity, added_at
\`\`\`

### Orders (ऑर्डर)
\`\`\`
id, user_id, total, status, payment_status, shipping_address, city, state, pincode, created_at
\`\`\`

### Order Items (ऑर्डर वस्तू)
\`\`\`
id, order_id, product_id, quantity, price
\`\`\`

## 🔌 API एंडपॉइंट्स (API Endpoints)

### प्रमाणीकरण (Authentication)
\`\`\`
POST   /api/auth/signup              - नये खाते तयार करा
POST   /api/auth/login               - लॉगइन करा
GET    /api/auth/profile             - प्रोफाइल मिळवा
PUT    /api/auth/profile             - प्रोफाइल अपडेट करा
\`\`\`

### उत्पाद (Products)
\`\`\`
GET    /api/products                 - सर्व उत्पाद मिळवा
GET    /api/products/:id             - विशिष्ट उत्पाद मिळवा
\`\`\`

### कार्ट (Cart)
\`\`\`
POST   /api/cart                     - कार्टमध्ये जोडा
GET    /api/cart                     - कार्ट मिळवा
DELETE /api/cart/:id                 - कार्टमधून हटवा
DELETE /api/cart                     - कार्ट साफ करा
\`\`\`

### ऑर्डर (Orders)
\`\`\`
POST   /api/orders                   - ऑर्डर तयार करा
GET    /api/orders                   - माझे ऑर्डर मिळवा
GET    /api/orders/:id               - ऑर्डर तपशील मिळवा
\`\`\`

### प्रशासक (Admin)
\`\`\`
GET    /api/admin/orders             - सर्व ऑर्डर मिळवा
PUT    /api/admin/orders/:id         - ऑर्डर स्थिति अपडेट करा
DELETE /api/admin/orders/:id         - ऑर्डर हटवा
\`\`\`

## 🎨 ड���जाइन विशेषताएं (Design Features)

- 🌿 **कृषी थीम** - हरीत रंग (#2d5016, #4a7c2e, #6fa937)
- 📱 **प्रतिक्रियाशील** - सर्व डिव्हाइसवर सुंदर दिसणारे
- ♿ **वापरकर्ता-अनुकूल** - किसानांसाठी सोपा इंटरफेस
- 🎭 **स्वच्छ UI** - न्यूनतमवादी डिजाइन

## 🔐 सुरक्षा विशेषताएं (Security Features)

- JWT Token-based Authentication
- Password Hashing with bcryptjs
- Protected API Endpoints
- User-specific Data Isolation
- CORS Enabled

## 📁 प्रकल्प संरचना (Project Structure)

\`\`\`
silk/
├── package.json                 # npm dependencies
├── server.js                    # Backend server
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── setup.sh                     # Setup script
├── README.md                    # This file
└── public/
    ├── index.html              # Main HTML
    ├── styles.css              # CSS styles
    └── app.js                  # Frontend JavaScript
\`\`\`

## 🎯 नमूना खाते (Sample Accounts)

### Admin Account (प्रशासक)
- Email: admin@silk.com
- Password: admin123

### Farmer Account (किसान)
- Email: farmer@example.com
- Password: farmer123

## 🔧 पर्यावरण व्हेरिएबल्स (.env)

\`\`\`
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
\`\`\`

## 📦 उत्पाद विवरण (Product Details)

| प्रमाण | कीमत | विवरण |
|------|------|-------|
| 50 | ₹500 | 50 रेशीम कीटांचे अंडे |
| 100 | ₹950 | 100 रेशीम कीटांचे अंडे |
| 150 | ₹1400 | 150 रेशीम कीटांचे अंडे |
| 200 | ₹1800 | 200 रेशीम कीटांचे अंडे |
| 250 | ₹2200 | 250 रेशीम कीटांचे अंडे |

## 🚀 भविष्य सुधार (Future Enhancements)

- [ ] Payment Gateway Integration (Razorpay/PayPal)
- [ ] Email Notifications
- [ ] SMS Alerts
- [ ] Advanced Analytics Dashboard
- [ ] Inventory Management
- [ ] Rating & Reviews
- [ ] Bulk Orders Support
- [ ] Multi-language Support

## 📞 समर्थन (Support)

कोणत्याही समस्येसाठी, कृपया GitHub Issues वर एक समस्या तयार करा।

For any issues, please create an issue on GitHub.

## 📝 लाइसेंस (License)

MIT License - free to use and modify

## 👤 लेखक (Author)

Aditya Patil - [@theaditya-p](https://github.com/theaditya-p)

---

**🌾 रेशीम पालन ऑनलाइन दुकान - किसानांसाठी डिजिटल समाधान**

*Silkworm E-Commerce Store - Digital Solution for Farmers*
````
