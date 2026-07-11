# 📖 HƯỚNG DẪN CHẠY HỆ THỐNG ORDER FOOD

## 📁 CẤU TRÚC THƯ MỤC

```
Order food/
├── backend/                 # Node.js + Express + Prisma (Server/API)
│   ├── index.js            # Main server file - Tất cả routes ở đây
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema (tables, fields)
│   │   └── dev.db          # SQLite database (tự tạo)
│   ├── seed-data.js        # Script thêm dữ liệu mẫu
│   ├── add-user.js         # Script thêm user với password hash
│   ├── check-menu.js       # Script kiểm tra menu
│   ├── uploads/            # Thư mục lưu trữ ảnh upload
│   ├── package.json        # Dependencies
│   └── .env                # Cấu hình (DATABASE_URL, PORT)
│
├── frontend/               # React + Vite (Giao diện người dùng)
│   ├── src/
│   │   ├── App.jsx         # Main routing
│   │   ├── index.js        # Entry point
│   │   ├── pages/          # Các trang chính
│   │   │   ├── Home.jsx           # Trang chủ - chọn chức năng
│   │   │   ├── Login.jsx          # Đăng nhập
│   │   │   ├── ScanQR.jsx         # Quét QR code
│   │   │   ├── TableMenu.jsx      # Menu khách hàng (sau scan QR)
│   │   │   ├── AdminDashboard.jsx # Dashboard admin
│   │   │   ├── MenuManager.jsx    # Quản lý menu (admin)
│   │   │   ├── KitchenView.jsx    # Giao diện bếp
│   │   │   └── ...
│   │   ├── components/     # Tái sử dụng UI components
│   │   ├── assets/         # Hình ảnh, icons tĩnh
│   │   └── styles/         # CSS global
│   ├── public/             # Tài nguyên tĩnh
│   ├── package.json        # Dependencies
│   └── vite.config.js      # Vite config
│
└── README.md               # Hướng dẫn này
```

## 🚀 BƯỚC CHẠY NHANH

### **Yêu cầu**
- Node.js v18+
- npm hoặc yarn
- Windows/Mac/Linux

### **1. Cài dependencies**

```bash
# Backend
cd backend
npm install

# Frontend (mở terminal mới)
cd frontend
npm install
```

### **2. Chuẩn bị dữ liệu**

```bash
# Backend: Thêm dữ liệu mẫu (bàn, menu, user)
cd backend
node seed-data.js
```

**Output dự kiến:**
```
🌱 Seeding database...
✅ Seed data successfully!

📊 Dữ liệu mẫu đã thêm:
- 5 bàn (Table 1-5)
- 4 danh mục: Khai vị, Món chính, Đồ uống, Tráng miệng
- 13 món ăn (có hình từ internet)
```

### **3. Chạy Backend**

```bash
cd backend
npm run dev
# hoặc
node index.js
```

**Output dự kiến:**
```
🚀 Backend chạy tại http://localhost:3000
```

### **4. Chạy Frontend (terminal mới)**

```bash
cd frontend
npm run dev
```

**Output dự kiến:**
```
VITE v5.4.21 ready in 314 ms
➜ Local: http://localhost:5173/
```

## 🎯 CÁCH SỬ DỤNG

### **👤 Đăng nhập**
1. Vào http://localhost:5173
2. Username: `admin`
3. Password: `123`

### **📱 Quét QR Code (Khách hàng)**
1. Nhấn "📱 Quét QR Code" ở trang chủ
2. Cho phép truy cập camera
3. Quét mã QR → Tự động vào Menu

### **🍽️ Đặt Món (Khách hàng)**
- http://localhost:5173/table/1 (Bàn 1)
- Xem menu theo danh mục
- Thêm vào giỏ → Checkout

### **👨‍💼 Quản lý Menu (Admin)**
- http://localhost:5173/admin
- Click "Quản lý Menu"
- Thêm/Sửa/Xóa món ăn
- Có hình ảnh tự động từ internet

### **👨‍🍳 Xem Đơn (Bếp)**
- http://localhost:5173/kitchen
- Xem danh sách order
- Cập nhật trạng thái → Ready

## 🔌 API Endpoints

### **Auth**
```
POST /api/auth/login
  body: { username, password }
  return: { user: { id, username, name, role } }
```

### **Menu (Khách)**
```
GET /api/table/:id/menu
  return: { table, categories: [{name, items: [...]}] }

POST /api/order
  body: { tableId, items: [{menuItemId, quantity}] }
  return: { order data }
```

### **Menu (Admin)**
```
GET /api/admin/menu          # Lấy tất cả menu items
POST /api/admin/menu         # Thêm món (payload: {..., image: url})
PUT /api/admin/menu/:id      # Sửa món
DELETE /api/admin/menu/:id   # Xóa món
GET /api/admin/categories    # Lấy danh mục
```

## 🛠️ Troubleshooting

### **Backend không chạy**
```bash
# Xoá database cũ
rm backend/prisma/dev.db

# Seed lại
node backend/seed-data.js

# Chạy lại
node backend/index.js
```

### **Frontend không tải hình**
- Kiểm tra backend có chạy http://localhost:3000
- Kiểm tra image URLs có valid không ở database

### **Lỗi "Port 3000 already in use"**
```bash
# Kill process chiếm port
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows
```

## 📊 Dữ liệu mẫu

**User:**
- admin / 123 (role: admin)

**Bàn:**
- Bàn 1-5 (mỗi bàn có QR code)

**Menu:**
- Khai vị: 3 món (Cuốn tôm, Gỏi cuốn, Chả giò)
- Món chính: 4 món (Phở bò, Bún chả, Cơm tấm, Bún Riêu)
- Đồ uống: 4 món (Cafe đen, Cafe sữa, Nước cam, Bia)
- Tráng miệng: 2 món (Chè ba màu, Kem)

## 📝 Ghi chú

- SQLite database mặc định
- Hình ảnh từ Unsplash (public)
- Password hash dùng bcrypt
- Frontend dùng Vite + React
- Backend dùng Express + Prisma ORM

---


