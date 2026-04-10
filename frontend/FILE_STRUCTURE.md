# 📁 Cấu Trúc File Frontend - Giải Thích Chi Tiết

## 🎯 Tổng Quan
Dự án sử dụng React + Vite. Các admin pages chia sẻ layout chung qua component `AdminLayout`.

---

## 📂 Cây Thư Mục

```
frontend/
├── src/
│   ├── components/
│   │   ├── AdminLayout.jsx          ⭐ MENU CHUNG cho tất cả trang Admin
│   │   ├── EmployeeManager.jsx      👥 Quản lý nhân viên (form + bảng)
│   │   ├── MenuManager.jsx          🍽️ Quản lý thực đơn
│   │   ├── TableManager.jsx         🪑 Quản lý bàn
│   │
│   ├── pages/
│   │   ├── AdminApp.jsx             📱 Wrapper cho admin routes
│   │   ├── AdminDashboard.jsx       🎯 Dashboard chính (dùng AdminLayout)
│   │   ├── AdminMenuQR.jsx          📋 Menu & QR Code (dùng AdminLayout)
│   │   ├── AdminApp.jsx             🏃 Entry point (routing)
│   │   ├── CustomerApp.jsx          🛒 Khách hàng quét QR
│   │   ├── KitchenView.jsx          👨‍🍳 Màn hình bếp KDS
│   │   ├── Login.jsx                🔐 Đăng nhập
│   │   ├── Home.jsx                 🏠 Trang chủ
│   │   ├── DashboardApp.jsx         📊 Dashboard tổng quát
│   │   ├── QRCodeManager.jsx        📱 Tạo QR Code
│   │   ├── ScanQR.jsx               📸 Quét QR
│   │   ├── TableMenu.jsx            🍴 Menu bàn
│   │
│   ├── App.jsx                      🚀 Root component (routing chính)
│   ├── main.jsx                     ⚙️ Entry point (React render)
│   ├── store.js                     🗄️ State management
│   ├── index.css                    🎨 CSS global
│   └── App.css                      🎨 CSS App
│
├── public/
├── package.json
└── vite.config.js
```

---

## 🔑 Các File Quan Trọng

### 1️⃣ **AdminLayout.jsx** ⭐ COMPONENT CHUNG
**📍 Đường dẫn:** `frontend/src/components/AdminLayout.jsx`

**🎯 Chức năng:**
- Sidebar menu (Trang chủ, Quản lý Kho hàng, Quản lý Nhân viên)
- Header với hamburger button (☰)
- Nút Đăng xuất (🚪) ở header + sidebar
- Responsive design (ẩn/hiện menu trên mobile)

**🔧 Props:**
```jsx
<AdminLayout 
  title="🎯 Trang chủ"        // Tiêu đề trang
  onLogout={handleLogout}      // Function đăng xuất
>
  {/* Nội dung trang đặt ở đây */}
</AdminLayout>
```

**👥 Được dùng bởi:**
- AdminDashboard.jsx
- AdminMenuQR.jsx

---

### 2️⃣ **AdminDashboard.jsx**
**📍 Đường dẫn:** `frontend/src/pages/AdminDashboard.jsx`

**🎯 Chức năng:**
- Trang chủ admin với thống kê
- 3 Tab: Tổng quan, Kho hàng, Nhân viên
- Biểu đồ doanh thu 7 ngày
- Hiển thị nhân viên dạng card
- Quản lý hàng (toggle còn hàng / hết hàng)

**📊 Tabs được cung cấp:**
- 📊 **Tổng quan** - Hiển thị thống kê, biểu đồ
- 📦 **Kho hàng** - Quản lý trạng thái món ăn
- 👥 **Nhân viên** - Form tạo + bảng quản lý

**💾 Dữ liệu API:**
- `GET /api/admin/revenue/daily` - Doanh thu hôm nay
- `GET /api/admin/revenue/summary` - Thống kê 7 ngày
- `GET /api/admin/orders/pending` - Đơn chờ
- `GET /api/admin/users` - Danh sách nhân viên
- `GET /api/admin/menu` - Danh sách món

---

### 3️⃣ **AdminMenuQR.jsx**
**📍 Đường dẫn:** `frontend/src/pages/AdminMenuQR.jsx`

**🎯 Chức năng:**
- Quản lý Menu & QR Code
- 2 Tab: Quản lý Món Ăn, Tạo Mã QR Bàn

**📋 Tabs:**
- 📍 **Quản lý Món Ăn** - Gọi MenuManager component
- 📱 **Tạo Mã QR Bàn** - Gọi QRCodeManager component

**💾 Dữ liệu API:**
- Được điều khiển bởi MenuManager & QRCodeManager

---

### 4️⃣ **EmployeeManager.jsx**
**📍 Đường dẫn:** `frontend/src/components/EmployeeManager.jsx`

**🎯 Chức năng:**
- Form tạo nhân viên mới
- Bảng hiển thị danh sách nhân viên
- Xóa nhân viên

**💾 API Endpoints:**
- `GET /api/admin/users` - Lấy danh sách
- `POST /api/admin/users` - Tạo mới
- `DELETE /api/admin/users/:id` - Xóa

**📊 Cột bảng:**
- ID
- Username
- Họ Tên (Name)
- Vai Trò (Role)
- Ngày Tạo (Created Date)
- Hành Động (Actions)

---

### 5️⃣ **KitchenView.jsx**
**📍 Đường dẫn:** `frontend/src/pages/KitchenView.jsx`

**🎯 Chức năng:**
- Màn hình bếp KDS (Kitchen Display System)
- Hiển thị đơn chờ
- Nút Đã phục vụ
- Quản lý trạng thái hàng (còn hàng / hết hàng)
- Tự cập nhật mỗi 5 giây
- ✨ Nút Đăng xuất (🚪) ở phía trên phải

**📋 2 Tab:**
- 📋 **Đơn hàng** - Danh sách các bàn chờ
- 📦 **Quản lý hàng** - Toggle trạng thái món

**💾 API Endpoints:**
- `GET /api/admin/orders/pending` - Danh sách đơn chờ
- `PATCH /api/admin/order/:id/status` - Cập nhật trạng thái
- `GET /api/admin/menu` - Danh sách món
- `PUT /api/menu/:id/availability` - Toggle trạng thái

---

### 6️⃣ **App.jsx & App.css**
**📍 Đường dẫn:** `frontend/src/App.jsx`, `frontend/src/App.css`

**🎯 Chức năng:**
- Routing chính của ứng dụng
- Kết nối các pages lại với nhau
- Login authentication
- Error handling

---

## 🔄 Luồng Dữ Liệu

### Admin Pages
```
AdminDashboard.jsx 
├─ Dùng AdminLayout (menu chung)
├─ Gọi API: /api/admin/... (thống kê, nhân viên, menu)
└─ Render:
    ├─ Tab Tổng quan (biểu đồ + stats)
    ├─ Tab Kho hàng (toggle câu lệnh)
    └─ Tab Nhân viên (EmployeeManager)

AdminMenuQR.jsx
├─ Dùng AdminLayout (menu chung)
└─ Render:
    ├─ Tab Quản lý Món Ăn (MenuManager)
    └─ Tab Tạo QR Code (QRCodeManager)

KitchenView.jsx
├─ KHÔNG dùng AdminLayout
├─ Nút Đăng xuất riêng ở header
└─ Auto-refresh mỗi 5s
```

---

## 🎨 Styling

### Theme Colors:
- **Background:** `#0f172a` (dark blue)
- **Secondary:** `#1e293b` (medium dark blue)
- **Primary:** `#8b5cf6` (purple)
- **Text:** `#fff` (white), `#cbd5e1` (light gray)
- **Success:** `#10b981` (green)
- **Danger:** `#ef4444` (red)

### Font Family:
```
fontFamily: 'system-ui, sans-serif'
```

---

## ✅ Checklist Tính Năng

### Admin Pages (Dùng AdminLayout)
- [x] AdminDashboard - Trang chủ với menu chung
- [x] AdminMenuQR - Menu & QR CODE với menu chung
- [x] Sidebar Menu (AdminLayout)
- [x] Hamburger Button (☰)
- [x] Nút Đăng xuất - Header
- [x] Nút Đăng xuất - Sidebar
- [x] Responsive Design (mobile)

### Kitchen View (Riêng)
- [x] KitchenView - Màn hình bếp
- [x] Auto-refresh 5s
- [x] Nút Đăng xuất ở header

### Components
- [x] EmployeeManager - Quản lý nhân viên
- [x] MenuManager - Quản lý thực đơn
- [x] AdminLayout - Shared layout

### Backend API
- [x] Employee CRUD (`/api/admin/users`)
- [x] Menu Management (`/api/admin/menu`)
- [x] Orders Management (`/api/admin/orders`)
- [x] Revenue Stats (`/api/admin/revenue`)

---

## 🚀 Cách Chạy

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
# Server: http://localhost:3000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Server: http://localhost:5173
```

---

## 📱 Routes

```
/                    → Home
/login               → Login Page
/admin               → AdminDashboard (require admin)
/admin/menu          → AdminMenuQR (require admin)
/kitchen             → KitchenView (require kitchen role)
/dashboard           → DashboardApp
/customer            → CustomerApp
/scan-qr             → ScanQR
/table/:tableId      → TableMenu
```

---

## 💡 Hỏi Đáp

**Q: Làm sao để thêm tab mới vào AdminDashboard?**
A: Thêm state và condition render trong AdminDashboard.jsx, sau đó thêm button tab mới.

**Q: AdminLayout có thể dùng cho page khác không?**
A: Có! Chỉ cần import và wrap nội dung. Ví dụ:
```jsx
<AdminLayout title="Tiêu đề" onLogout={logout}>
  <YourContent />
</AdminLayout>
```

**Q: KitchenView tại sao không dùng AdminLayout?**
A: Vì bếp cần giao diện đơn giản, tối, không cần sidebar phức tạp.

**Q: Nút đăng xuất ở đâu?**
A: 
- AdminLayout: Header (phải) + Sidebar (dưới cùng)
- KitchenView: Header (phải)

---

## 📞 Liên Hệ

Nếu có câu hỏi về cấu trúc file, liên hệ với developer.
