import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import EmployeeManager from '../components/EmployeeManager';
import AdminMenuQR from './AdminMenuQR';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function AdminDashboard({ onLogout }) {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
  
  // --- STATES DỮ LIỆU ---
  const [dailyRevenue, setDailyRevenue] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [activeTables, setActiveTables] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- INVENTORY STATES ---
  const [menuItems, setMenuItems] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'dashboard';
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const [dailyRes, summaryRes, pendingRes, empRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/revenue/daily'),
          axios.get('http://localhost:3000/api/admin/revenue/summary'),
          axios.get('http://localhost:3000/api/admin/orders/pending'),
          axios.get('http://localhost:3000/api/admin/users').catch(() => ({ data: [] }))
        ]);
        setDailyRevenue(dailyRes.data.totalRevenue ?? 0);
        setSummaryData(summaryRes.data || []);
        const tablesActive = new Set((pendingRes.data || []).map((order) => order.tableId));
        setActiveTables(tablesActive.size);
        setRecentOrders((pendingRes.data || []).slice(0, 5));
        setEmployees(empRes.data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Load menu items để quản lý hàng
  const loadMenuItems = async () => {
    try {
      setInventoryLoading(true);
      const response = await axios.get('http://localhost:3000/api/admin/menu');
      setMenuItems(response.data || []);
      console.log('Loaded menu items:', response.data);
    } catch (err) {
      console.error('Lỗi tải menu:', err);
      setError('Không thể tải thực đơn.');
    } finally {
      setInventoryLoading(false);
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      setActionLoading(itemId);
      const newStatus = !currentStatus;
      await axios.put(`http://localhost:3000/api/menu/${itemId}/availability`, {
        isAvailable: newStatus
      });
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isAvailable: newStatus } : item
        )
      );
      console.log(`Updated item ${itemId} to ${newStatus ? 'Còn hàng' : 'Hết hàng'}`);
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      setError('Cập nhật trạng thái thất bại.');
    } finally {
      setActionLoading(null);
    }
  };

  // Load menu khi chuyển sang tab inventory
  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    if (activeTab === 'inventory') {
      loadMenuItems();
    }
  }, [activeTab]);

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
  };

  const tabsContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    borderBottom: '2px solid #334155',
    paddingBottom: '0'
  };

  const tabButtonStyle = (isActive) => ({
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '3px solid #8b5cf6' : '3px solid transparent',
    color: isActive ? '#60a5fa' : '#94a3b8',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: isActive ? '700' : '600',
    transition: 'all 0.2s',
    marginBottom: '-2px'
  });

  // --- GIAO DIỆN TRANG CHỦ (THỐNG KÊ + BẢNG NHÂN VIÊN) ---
  const StatCard = ({ label, value, icon, color = '#8b5cf6' }) => (
    <div style={{
      background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
      border: `2px solid ${color}40`,
      padding: '28px 24px',
      borderRadius: '20px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = `0 20px 40px ${color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
          <p style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '800', margin: '12px 0 0' }}>{loading ? 'Đang tải' : value}</p>
        </div>
        <span style={{ fontSize: '2.5rem' }}>{icon}</span>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: 0, fontSize: '2.8rem', fontWeight: '900', color: '#fff', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tổng quan Hệ thống</h1>
        <p style={{ margin: '12px 0 0', color: '#cbd5e1', fontSize: '1.1rem' }}>Giám sát doanh thu, bàn hoạt động và nhân sự</p>
      </header>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <StatCard label="Doanh thu hôm nay" value={formatCurrency(dailyRevenue ?? 0)} icon="" color="#10b981" />
        <StatCard label="Bàn hoạt động" value={activeTables} icon="" color="#f59e0b" />
        <StatCard label="Nhân viên" value={employees.length} icon="" color="#3b82f6" />
        <StatCard label="Đơn chờ" value={recentOrders.length} icon="" color="#ec4899" />
      </section>

      {/* Biểu đồ */}
      <section style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '32px', borderRadius: '24px', marginBottom: '32px', border: '2px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Doanh thu 7 ngày</h2>
          <span style={{ background: '#10b98140', color: '#10b981', padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600' }}>↑ Xu hướng tăng</span>
        </div>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData}>
              <CartesianGrid stroke="#334155" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tickFormatter={(val) => `${val / 1000}k`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip 
                formatter={(val) => formatCurrency(val)} 
                contentStyle={{ backgroundColor: '#0f172a', border: '2px solid #8b5cf6', borderRadius: '12px', color: '#fff' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="totalRevenue" fill="url(#colorGradient)" radius={[10, 10, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Đơn hàng gần đây */}
      {recentOrders.length > 0 && (
        <section style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '32px', borderRadius: '24px', marginBottom: '32px', border: '2px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#fff', margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: '800' }}>Đơn hàng gần đây</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {recentOrders.map((order, idx) => (
              <div key={idx} style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                padding: '20px',
                borderRadius: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#e0e7ff' }}>Bàn {order.tableId}</span>
                  <span style={{ background: '#f97316', color: '#000', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>Chờ</span>
                </div>
                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>{order.items?.length || 0} món</p>
                <p style={{ color: '#10b981', margin: '12px 0 0', fontSize: '1.2rem', fontWeight: '700' }}>{formatCurrency(order.totalAmount || 0)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );

  // Render Inventory Management
  const renderInventory = () => (
    <>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: 0, fontSize: '2.8rem', fontWeight: '900', color: '#fff', background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Quản lý Kho hàng</h1>
        <p style={{ margin: '12px 0 0', color: '#cbd5e1', fontSize: '1.1rem' }}>Theo dõi và cập nhật trạng thái hàng hóa trong thực đơn</p>
      </header>

      {error && (
        <div style={{ background: '#ef4444', color: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {inventoryLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Đang tải...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: item.isAvailable
                  ? 'linear-gradient(135deg, #10b98120 0%, #06b6d420 100%)'
                  : 'linear-gradient(135deg, #ef444420 0%, #f9731620 100%)',
                border: item.isAvailable
                  ? '2px solid #10b981'
                  : '2px solid #ef4444',
                padding: '24px',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                boxShadow: item.isAvailable
                  ? 'none'
                  : '0 0 20px rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (item.isAvailable) {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = item.isAvailable
                  ? 'none'
                  : '0 0 20px rgba(239, 68, 68, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Header với tên món */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.1rem', fontWeight: '700' }}>
                  {item.name}
                </h3>
                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem' }}>
                  {item.price?.toLocaleString('vi-VN') || 0}đ
                </p>
              </div>

              {/* Status Badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{
                  background: item.isAvailable
                    ? '#10b98140'
                    : '#ef444440',
                  color: item.isAvailable ? '#10b981' : '#ef4444',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {item.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>

              {/* Toggle Button */}
              <button
                onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                disabled={actionLoading === item.id}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: item.isAvailable
                    ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: actionLoading === item.id ? 'not-allowed' : 'pointer',
                  opacity: actionLoading === item.id ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {actionLoading === item.id ? (
                  'Đang cập nhật...'
                ) : item.isAvailable ? (
                  'Đánh dấu hết hàng'
                ) : (
                  'Đánh dấu còn hàng'
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {!inventoryLoading && menuItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.1rem' }}>Không có mục nào trong thực đơn</p>
        </div>
      )}
    </>
  );

  return (
    <AdminLayout title="Admin" onLogout={onLogout}>
      <div style={tabsContainerStyle}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={tabButtonStyle(activeTab === 'dashboard')}
        >
          Tổng quan
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          style={tabButtonStyle(activeTab === 'inventory')}
        >
          Kho hàng
        </button>
        <button
          onClick={() => setActiveTab('employee')}
          style={tabButtonStyle(activeTab === 'employee')}
        >
          Nhân viên
        </button>
        <button
          onClick={() => setActiveTab('menuqr')}
          style={tabButtonStyle(activeTab === 'menuqr')}
        >
          Menu & QR Code
        </button>
      </div>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'inventory' && renderInventory()}
      {activeTab === 'employee' && (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ color: '#fff', marginBottom: '20px' }}>Tạo tài khoản Nhân viên</h2>
          <EmployeeManager />
        </div>
      )}
      {activeTab === 'menuqr' && (
        <AdminMenuQR />
      )}
    </AdminLayout>
  );
}
