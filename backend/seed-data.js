const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.menuItem.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.table.deleteMany({});

    // Create tables
    const tables = await prisma.table.createMany({
      data: [
        { name: 'Bàn 1', qrCode: 'http://localhost:3000/table/1' },
        { name: 'Bàn 2', qrCode: 'http://localhost:3000/table/2' },
        { name: 'Bàn 3', qrCode: 'http://localhost:3000/table/3' },
        { name: 'Bàn 4', qrCode: 'http://localhost:3000/table/4' },
        { name: 'Bàn 5', qrCode: 'http://localhost:3000/table/5' },
        { name: 'Bàn 6', qrCode: 'http://localhost:3000/table/6' },
        { name: 'Bàn 7', qrCode: 'http://localhost:3000/table/7' },
        { name: 'Bàn 8', qrCode: 'http://localhost:3000/table/8' },
        { name: 'Bàn 9', qrCode: 'http://localhost:3000/table/9' },
        { name: 'Bàn 10', qrCode: 'http://localhost:3000/table/10' },
        { name: 'Bàn 11', qrCode: 'http://localhost:3000/table/11' },
        { name: 'Bàn 12', qrCode: 'http://localhost:3000/table/12' },
        { name: 'Bàn VIP 1', qrCode: 'http://localhost:3000/table/13' },
        { name: 'Bàn VIP 2', qrCode: 'http://localhost:3000/table/14' },
        { name: 'Bar Counter', qrCode: 'http://localhost:3000/table/15' },
      ]
    });

    // Create categories
    const appetizers = await prisma.category.create({
      data: {
        name: 'Khai vị',
        sort: 1
      }
    });

    const main = await prisma.category.create({
      data: {
        name: 'Món chính',
        sort: 2
      }
    });

    const drinks = await prisma.category.create({
      data: {
        name: 'Đồ uống',
        sort: 3
      }
    });

    const desserts = await prisma.category.create({
      data: {
        name: 'Tráng miệng',
        sort: 4
      }
    });

    // Create menu items
    await prisma.menuItem.createMany({
      data: [
        // ===== KHAI VỊ (15 items) =====
        { name: 'Cuốn tôm', price: 45000, categoryId: appetizers.id, description: 'Cuốn tôm nóng, tôm tươi', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b8?auto=format&fit=crop&w=500&q=60' },
        { name: 'Gỏi cuốn', price: 35000, categoryId: appetizers.id, description: 'Gỏi cuốn tươi mát, rau sống', image: 'https://images.unsplash.com/photo-1583573845028-f85db4f9b2dc?auto=format&fit=crop&w=500&q=60' },
        { name: 'Chả giò', price: 30000, categoryId: appetizers.id, description: 'Chả giò rán giòn, nóng hổi', image: 'https://images.unsplash.com/photo-1634353894882-21ab282af599?auto=format&fit=crop&w=500&q=60' },
        { name: 'Tôm nước mắm', price: 55000, categoryId: appetizers.id, description: 'Tôm tươi, nước mắm chua ngọt', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b8?auto=format&fit=crop&w=500&q=60' },
        { name: 'Cánh gà nướng mỳ', price: 35000, categoryId: appetizers.id, description: 'Cánh gà nướng mỳ thơm lừng', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Nem cua', price: 40000, categoryId: appetizers.id, description: 'Nem cua rán giòn, cua thật', image: 'https://images.unsplash.com/photo-1634353894882-21ab282af599?auto=format&fit=crop&w=500&q=60' },
        { name: 'Gỏi ốc', price: 50000, categoryId: appetizers.id, description: 'Gỏi ốc tươi, rau thơm', image: 'https://images.unsplash.com/photo-1583573845028-f85db4f9b2dc?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bánh cuốn', price: 30000, categoryId: appetizers.id, description: 'Bánh cuốn nóng, nhân thịt tôm', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b8?auto=format&fit=crop&w=500&q=60' },
        { name: 'Thịt cua tôm', price: 60000, categoryId: appetizers.id, description: 'Tôm cua tươi, nước dùng ngon', image: 'https://images.unsplash.com/photo-1583573845028-f85db4f9b2dc?auto=format&fit=crop&w=500&q=60' },
        { name: 'Xôi gà', price: 45000, categoryId: appetizers.id, description: 'Xôi xát, gà luộc, dùi gà', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Nộm hành', price: 25000, categoryId: appetizers.id, description: 'Nộm hành thơm, tỏi tươi', image: 'https://images.unsplash.com/photo-1583573845028-f85db4f9b2dc?auto=format&fit=crop&w=500&q=60' },
        { name: 'Chả cua hấp', price: 35000, categoryId: appetizers.id, description: 'Chả cua hấp lá chuối', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b8?auto=format&fit=crop&w=500&q=60' },
        { name: 'Salad tôm', price: 50000, categoryId: appetizers.id, description: 'Salad tôm tươi, dressing đặc biệt', image: 'https://images.unsplash.com/photo-1583573845028-f85db4f9b2dc?auto=format&fit=crop&w=500&q=60' },
        { name: 'Vịt quay', price: 65000, categoryId: appetizers.id, description: 'Vịt quay vàng ươi, thơm nức', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Hàu nướng mỡ', price: 55000, categoryId: appetizers.id, description: 'Hàu tươi, mỡ hành', image: 'https://images.unsplash.com/photo-1583573845028-f85db4f9b2dc?auto=format&fit=crop&w=500&q=60' },
        
        // ===== MÓN CHÍNH (20 items) =====
        { name: 'Phở bò', price: 65000, categoryId: main.id, description: 'Phở bò nóng hổi, xiết 12h', image: 'https://images.unsplash.com/photo-1569718212a3b79b9a4ea42ed2a2f5f27efb432c?auto=format&fit=crop&w=500&q=60' },
        { name: 'Phở gà', price: 60000, categoryId: main.id, description: 'Phở gà thơm, nước dùng đậm đà', image: 'https://images.unsplash.com/photo-1569718212a3b79b9a4ea42ed2a2f5f27efb432c?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bún chả', price: 55000, categoryId: main.id, description: 'Bún chả Hà Nội, thịt nướng', image: 'https://images.unsplash.com/photo-1618164436241-4473940571db?auto=format&fit=crop&w=500&q=60' },
        { name: 'Cơm tấm', price: 50000, categoryId: main.id, description: 'Cơm tấm sài gòn, thịt nướng', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bún Riêu', price: 60000, categoryId: main.id, description: 'Bún riêu cua, canh chua', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60' },
        { name: 'Mì xào', price: 45000, categoryId: main.id, description: 'Mì xào tôm/thịt, rau cải', image: 'https://images.unsplash.com/photo-1612874742237-415221591c3f?auto=format&fit=crop&w=500&q=60' },
        { name: 'Cơm rang', price: 50000, categoryId: main.id, description: 'Cơm rang tôm, trứng gà', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bún bò Huế', price: 65000, categoryId: main.id, description: 'Bún bò Huế cay, nước dùng thơm', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60' },
        { name: 'Cua rang me', price: 80000, categoryId: main.id, description: 'Cua sú cạnh rang me, cay cay', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Tôm rang muối', price: 75000, categoryId: main.id, description: 'Tôm sú rang muối ớt, rất ngon', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b8?auto=format&fit=crop&w=500&q=60' },
        { name: 'Vịt nấu tiêu', price: 70000, categoryId: main.id, description: 'Vịt nấu tiêu cay, dưa chua', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Thịt kho tàu', price: 55000, categoryId: main.id, description: 'Thịt heo kho tàu, trứng cút', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Gà nấu thương', price: 60000, categoryId: main.id, description: 'Gà nấu thương, sâm riêng', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Lươn nướng', price: 65000, categoryId: main.id, description: 'Lươn nướng me, rau sống', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Cá kho cốt dừa', price: 60000, categoryId: main.id, description: 'Cá kho cốt dừa, dứa', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=500&q=60' },
        { name: 'Canh sour fish', price: 70000, categoryId: main.id, description: 'Canh cá chua cay, khổ qua', image: 'https://images.unsplash.com/photo-1511689915289-185d50269bed?auto=format&fit=crop&w=500&q=60' },
        { name: 'Thịt nướng sa tế', price: 65000, categoryId: main.id, description: 'Thịt heo nướng sa tế, rau sống', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Chim cút nướng', price: 85000, categoryId: main.id, description: 'Chim cút nướng mỳ, ớt chua ngọt', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bánh chưng', price: 40000, categoryId: main.id, description: 'Bánh chưng truyền thống, dứa', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b8?auto=format&fit=crop&w=500&q=60' },
        { name: 'Tiramissu nước mắm', price: 50000, categoryId: main.id, description: 'Đặc sản kết hợp phương Tây Á', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60' },
        
        // ===== ĐỒ UỐNG (15 items) =====
        { name: 'Cafe đen', price: 15000, categoryId: drinks.id, description: 'Cafe đen đậm đà, phin truyền thống', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?auto=format&fit=crop&w=500&q=60' },
        { name: 'Cafe sữa', price: 18000, categoryId: drinks.id, description: 'Cafe sữa ngon, sữa đặc', image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=60' },
        { name: 'Cafe sữa đá', price: 20000, categoryId: drinks.id, description: 'Cafe sữa lạnh, đá tuyết', image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=60' },
        { name: 'Nước cam ép', price: 20000, categoryId: drinks.id, description: 'Cam ép nguyên chất, không đường', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bia Hà Nội', price: 25000, categoryId: drinks.id, description: 'Bia lạnh, bia tươi', image: 'https://images.unsplash.com/photo-1608270861620-7d5f2350a5a5?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bia Sài Gòn', price: 25000, categoryId: drinks.id, description: 'Bia Sài Gòn đỏ, bia thương hiệu', image: 'https://images.unsplash.com/photo-1608270861620-7d5f2350a5a5?auto=format&fit=crop&w=500&q=60' },
        { name: 'Nước dừa tươi', price: 22000, categoryId: drinks.id, description: 'Nước dừa tươi, với thịt dừa', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' },
        { name: 'Nước dâu tây', price: 25000, categoryId: drinks.id, description: 'Nước dâu tây nguyên chất, đặc sản', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' },
        { name: 'Nước mía', price: 12000, categoryId: drinks.id, description: 'Nước mía tươi, ép mía đặc sản', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' },
        { name: 'Nước cam dâu', price: 22000, categoryId: drinks.id, description: 'Nước cam dâu tây, vị chua ngọt', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' },
        { name: 'Café bạc xỉu', price: 20000, categoryId: drinks.id, description: 'Café bạc xỉu ngon, vị mật mà', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?auto=format&fit=crop&w=500&q=60' },
        { name: 'Trà xanh đá', price: 15000, categoryId: drinks.id, description: 'Trà xanh lạnh, thanh mát', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' },
        { name: 'Trà vải', price: 18000, categoryId: drinks.id, description: 'Trà vải đặc sản, ngon thanh mát', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' },
        { name: 'Sinh tố xoài', price: 25000, categoryId: drinks.id, description: 'Sinh tố xoài mịn, thơm nức', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' },
        { name: 'Nước mắm chua', price: 10000, categoryId: drinks.id, description: 'Nước mắm chua ngọt, gia truyền', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=60' },
        
        // ===== TRÁNG MIỆNG (12 items) =====
        { name: 'Chè ba màu', price: 12000, categoryId: desserts.id, description: 'Chè ba màu lạnh, truyền thống', image: 'https://images.unsplash.com/photo-1566312415121-f4ff7e7d532a?auto=format&fit=crop&w=500&q=60' },
        { name: 'Kem', price: 15000, categoryId: desserts.id, description: 'Kem vanilla thơm lừng', image: 'https://images.unsplash.com/photo-1565958011504-3d3e3e60d519?auto=format&fit=crop&w=500&q=60' },
        { name: 'Kem sô-cô-la', price: 18000, categoryId: desserts.id, description: 'Kem sô-cô-la đậm đà', image: 'https://images.unsplash.com/photo-1565958011504-3d3e3e60d519?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bánh flan', price: 20000, categoryId: desserts.id, description: 'Bánh flan trứng siêu mềm', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bánh tiramisu', price: 25000, categoryId: desserts.id, description: 'Bánh tiramisu Ý truyền thống', image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bánh cheese', price: 30000, categoryId: desserts.id, description: 'Bánh cheese Mỹ ngon tuyệt', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60' },
        { name: 'Chè đậu đỏ', price: 10000, categoryId: desserts.id, description: 'Chè đậu đỏ ấm áp', image: 'https://images.unsplash.com/photo-1566312415121-f4ff7e7d532a?auto=format&fit=crop&w=500&q=60' },
        { name: 'Chè chuối', price: 12000, categoryId: desserts.id, description: 'Chè chuối lạnh, ngon lạ miệng', image: 'https://images.unsplash.com/photo-1566312415121-f4ff7e7d532a?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bánh crepe', price: 22000, categoryId: desserts.id, description: 'Bánh crepe Pháp mỏng manh', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60' },
        { name: 'Kem hạt dẻ', price: 18000, categoryId: desserts.id, description: 'Kem hạt dẻ thơm, béo ngậy', image: 'https://images.unsplash.com/photo-1565958011504-3d3e3e60d519?auto=format&fit=crop&w=500&q=60' },
        { name: 'Bánh mousse', price: 28000, categoryId: desserts.id, description: 'Bánh mousse xốp mềm', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60' },
        { name: 'Khoai tây chiên', price: 8000, categoryId: desserts.id, description: 'Khoai tây chiên giòn rối', image: 'https://images.unsplash.com/photo-1585238341710-4b4e6faeb884?auto=format&fit=crop&w=500&q=60' },
      ]
    });

    console.log('✅ Seed data successfully!');
    console.log(`
    📊 Dữ liệu mẫu đã thêm:
    - 15 bàn (Table): Bàn 1-12 + 2 VIP + Bar Counter
    - 4 danh mục (Category): Khai vị, Món chính, Đồ uống, Tráng miệng
    - 62 món ăn (MenuItem):
      • 15 khai vị (Cuốn tôm, Gỏi cuốn, Chả giò, v.v)
      • 20 món chính (Phở, Bún, Cơm, Cua, Tôm, v.v)
      • 15 đồ uống (Cafe, Bia, Nước cam, v.v)
      • 12 tráng miệng (Chè, Kem, Bánh, v.v)
    `);
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
