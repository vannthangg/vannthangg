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
    gap: '8px',
    marginBottom: '28px',
    borderBottom: '2px solid #e5e5e5',
    paddingBottom: '0',
    overflowX: 'auto'
  };

  const tabButtonStyle = (isActive) => ({
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
    color: isActive ? '#2563eb' : '#999',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: isActive ? '700' : '600',
    transition: 'all 0.2s',
    marginBottom: '-2px',
    whiteSpace: 'nowrap'
  });

  // --- GIAO DIỆN TRANG CHỦ (THỐNG KÊ + BẢNG NHÂN VIÊN) ---
  const StatCard = ({ label, value, icon, color = '#2563eb' }) => (
    <div style={{
      background: '#fff',
      border: `2px solid ${color}20`,
      padding: '24px 20px',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 8px 16px ${color}20`;
      e.currentTarget.style.borderColor = `${color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      e.currentTarget.style.borderColor = `${color}20`;
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#999', margin: 0, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
          <p style={{ color: '#0f0e2e', fontSize: '2.3rem', fontWeight: '800', margin: '10px 0 0' }}>{loading ? 'Đang tải' : value}</p>
        </div>
        <span style={{ fontSize: '2.2rem' }}>{icon}</span>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <>
      <header style={{ marginBottom: '36px' }}>
        <h1 style={{ margin: 0, fontSize: '2.6rem', fontWeight: '900', color: '#0f0e2e' }}>Tổng quan Hệ thống</h1>
        <p style={{ margin: '10px 0 0', color: '#666', fontSize: '1.05rem' }}>Giám sát doanh thu, bàn hoạt động và nhân sự</p>
      </header>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        <StatCard label="Doanh thu hôm nay" value={formatCurrency(dailyRevenue ?? 0)} icon="" color="#10b981" />
        <StatCard label="Bàn hoạt động" value={activeTables} icon="" color="#f59e0b" />
        <StatCard label="Nhân viên" value={employees.length} icon="" color="#2563eb" />
        <StatCard label="Đơn chờ" value={recentOrders.length} icon="" color="#06b6d4" />
      </section>

      {/* Biểu đồ */}
      <section style={{ background: '#fff', padding: '28px', borderRadius: '12px', marginBottom: '28px', border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#0f0e2e', margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>Doanh thu 7 ngày</h2>
          <span style={{ background: '#10b98110', color: '#10b981', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>↑ Xu hướng tăng</span>
        </div>
        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData}>
              <CartesianGrid stroke="#e5e5e5" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#999', fontSize: 12 }} />
              <YAxis tickFormatter={(val) => `${val / 1000}k`} tick={{ fill: '#999', fontSize: 12 }} />
              <Tooltip 
                formatter={(val) => formatCurrency(val)} 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', color: '#0f0e2e' }}
                labelStyle={{ color: '#666' }}
              />
              <Bar dataKey="totalRevenue" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Đơn hàng gần đây */}
      {recentOrders.length > 0 && (
        <section style={{ background: '#fff', padding: '28px', borderRadius: '12px', marginBottom: '28px', border: '1px solid #e5e5e5', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: '#0f0e2e', margin: '0 0 20px 0', fontSize: '1.4rem', fontWeight: '800' }}>Đơn hàng gần đây</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
            {recentOrders.map((order, idx) => (
              <div key={idx} style={{
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                padding: '18px',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f0e2e' }}>Bàn {order.tableId}</span>
                  <span style={{ background: '#f59e0b', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>Chờ</span>
                </div>
                <p style={{ color: '#666', margin: 0, fontSize: '0.85rem' }}>{order.items?.length || 0} món</p>
                <p style={{ color: '#10b981', margin: '10px 0 0', fontSize: '1.1rem', fontWeight: '700' }}>{formatCurrency(order.totalAmount || 0)}</p>
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
      <header style={{ marginBottom: '36px' }}>
        <h1 style={{ margin: 0, fontSize: '2.6rem', fontWeight: '900', color: '#0f0e2e' }}>Quản lý Kho hàng</h1>
        <p style={{ margin: '10px 0 0', color: '#666', fontSize: '1.05rem' }}>Theo dõi và cập nhật trạng thái hàng hóa trong thực đơn</p>
      </header>

      {error && (
        <div style={{ background: '#ef4444', color: '#fff', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.95rem' }}>
          {error}
        </div>
      )}

      {inventoryLoading ? (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Đang tải...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: item.isAvailable
                  ? 'linear-gradient(135deg, #10b98115 0%, #06b6d408 100%)'
                  : 'linear-gradient(135deg, #ef444415 0%, #f9731615 100%)',
                border: item.isAvailable
                  ? '1.5px solid #10b98140'
                  : '1.5px solid #ef444440',
                padding: '20px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                boxShadow: item.isAvailable
                  ? 'none'
                  : '0 0 16px rgba(239, 68, 68, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (item.isAvailable) {
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(16, 185, 129, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = item.isAvailable
                  ? 'none'
                  : '0 0 16px rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Header với tên món */}
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ margin: '0 0 6px 0', color: '#0f0e2e', fontSize: '1rem', fontWeight: '700' }}>
                  {item.name}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                  {item.price?.toLocaleString('vi-VN') || 0}đ
                </p>
              </div>

              {/* Status Badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{
                  background: item.isAvailable
                    ? '#10b98110'
                    : '#ef444410',
                  color: item.isAvailable ? '#10b981' : '#ef4444',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
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
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: item.isAvailable
                    ? '#ef4444'
                    : '#10b981',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: actionLoading === item.id ? 'not-allowed' : 'pointer',
                  opacity: actionLoading === item.id ? 0.7 : 1,
                  transition: 'all 0.2s'
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
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#999' }}>
          <p style={{ fontSize: '1.05rem' }}>Không có mục nào trong thực đơn</p>
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
          <h2 style={{ color: '#0f0e2e', marginBottom: '20px' }}>Tạo tài khoản Nhân viên</h2>
          <EmployeeManager />
        </div>
      )}
      {activeTab === 'menuqr' && (
        <AdminMenuQR />
      )}
    </AdminLayout>
  );
}
