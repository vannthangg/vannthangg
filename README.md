# 🍽️ Order Food - Restaurant Management System

Hệ thống quản lý đơn hàng nhà hàng trực tuyến được xây dựng bằng **React** (Frontend) + **Node.js + Prisma** (Backend).

---

## 📋 Yêu Cầu Hệ Thống

- **Node.js** >= 16.x
- **npm** >= 8.x
- **Git**
- **DBeaver** hoặc SQL client (để xem database)

---

## 🚀 Quick Start (5 phút)

### 1️⃣ Clone Project
```bash
git clone https://github.com/Thu-Thao21/Order_food.git
cd Order_food
```

### 2️⃣ Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3️⃣ Setup Database

Database đã được seed sẵn (`backend/prisma/dev.db`), nhưng nếu cần tạo lại:

```bash
cd backend
npm run prisma:migrate  # Tạo tables
npm run seed            # Add sample data
```

### 4️⃣ Start Development Servers

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
# 🚀 Server chạy tại: http://localhost:3001
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm start
# 🌐 App chạy tại: http://localhost:3000
```

---

## 📊 Database

### File Location
```
backend/prisma/dev.db
```

### Sample Data
- ✅ 5 Categories (Appetizers, Main Courses, Desserts, Beverages, Soups)
- ✅ 10 Products (với giá và mô tả)
- ✅ 3 Users (admin, staff1, customer1)
- ✅ 5 Tables (TABLE_001 - TABLE_005)

### View Database trong DBeaver

1. Mở **DBeaver**
2. **Database** → **New Database Connection** → **SQLite**
3. File path: `backend/prisma/dev.db`
4. Click **Finish**
5. Explore tables: `categories`, `products`, `users`, `tables`, `orders`, `order_details`

---

## 🛠️ Available Scripts

### Backend
```bash
npm run dev        # Start development server with auto-reload
npm run build      # Build for production
npm run start      # Run production build
npm run seed       # Populate database with sample data
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio (visual DB editor)
npm run test       # Run tests
```

### Frontend
```bash
npm start          # Start dev server (http://localhost:3000)
npm run build      # Build for production
npm run test       # Run tests
npm run eject      # Eject from Create React App (⚠️ irreversible)
```

---

## 📁 Project Structure

```
Order_food/
├── backend/
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Data models
│   │   └── utils/        # Helper functions
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   ├── dev.db        # SQLite database (seeded)
│   │   ├── migrations/   # Migration history
│   │   └── seed.js       # Seed script
│   ├── package.json
│   └── .env             # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service layer
│   │   ├── styles/     # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env           # Environment variables
│
└── README.md (this file)
```

---

## 🔌 API Endpoints

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (admin only)
- `PUT /api/products/:id` - Cập nhật sản phẩm (admin only)
- `DELETE /api/products/:id` - Xóa sản phẩm (admin only)

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng
- `DELETE /api/orders/:id` - Hủy đơn hàng

### Users
- `GET /api/users` - Lấy danh sách users
- `POST /api/users/register` - Đăng ký
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/:id` - Lấy thông tin user

### Tables
- `GET /api/tables` - Lấy danh sách bàn
- `GET /api/tables/:id` - Lấy chi tiết bàn
- `PUT /api/tables/:id` - Cập nhật trạng thái bàn

---

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key-here
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 👥 User Credentials (Demo)

| Username | Password | Role |
|----------|----------|------|
| admin | password123 | Admin |
| staff1 | password123 | Staff |
| customer1 | password123 | Customer |

---

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

---

## 🐛 Troubleshooting

### "Port 3000/3001 already in use"
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Database issues
```bash
# Prisma reset (⚠️ deletes all data!)
cd backend
npm run prisma:reset
```

---

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Node.js Documentation](https://nodejs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "✨ Add new feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Team

- **Lead:** Thao (Thu-Thao21)
- **Contributors:** Team members

---

## ✅ Checklist for New Team Members

- [ ] Clone repository
- [ ] Install Node.js & npm
- [ ] Run `npm install` in both backend & frontend
- [ ] Verify database file exists (`backend/prisma/dev.db`)
- [ ] Open database in DBeaver
- [ ] Start backend server (`npm run dev`)
- [ ] Start frontend server (`npm start`)
- [ ] Test API: `http://localhost:3001/api/products`
- [ ] Test frontend: `http://localhost:3000`
- [ ] Welcome to the team! 🎉

---

**Last Updated:** April 15, 2026  
**Status:** ✅ Ready for Development
