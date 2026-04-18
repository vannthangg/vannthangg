import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import AdminLayout from '../components/AdminLayout';
import EmployeeManager from '../components/EmployeeManager';
import AdminMenuQR from './AdminMenuQR';
import CashierPage from './CashierPage';
import { ADMIN_DASHBOARD_API, ADMIN_ORDERS_API, ADMIN_MENU_API, ADMIN_USERS_API } from '../config/api';
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
<<<<<<< HEAD
  const [inventorySearch, setInventorySearch] = useState('');
=======
>>>>>>> e798391b17b6b0b464c7b6bd151b1f32e25ee24b

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'dashboard';
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const [dailyRes, summaryRes, pendingRes, empRes] = await Promise.all([
          axios.get(ADMIN_DASHBOARD_API.GET_DAILY_REVENUE),
          axios.get(ADMIN_DASHBOARD_API.GET_REVENUE_SUMMARY),
          axios.get(ADMIN_ORDERS_API.GET_PENDING_ORDERS),
          axios.get(ADMIN_USERS_API.GET_ALL_USERS).catch(() => ({ data: [] }))
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

    // Socket.io real-time updates
    const socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Listen for new orders
    socket.on('new-order', (newOrder) => {
      console.log('📦 Đơn mới nhận được (Admin):', newOrder);
      setRecentOrders((prev) => [newOrder, ...prev].slice(0, 5));
      setActiveTables((prevTables) => {
        // Tính lại số bàn hoạt động
        axios.get(ADMIN_ORDERS_API.GET_PENDING_ORDERS)
          .then(res => {
            const activeTablesSet = new Set((res.data || []).map((order) => order.tableId));
            return activeTablesSet.size;
          })
          .catch(() => prevTables);
        return prevTables;
      });
    });

    // Listen for order status updates
    socket.on('order-status-update', (updatedOrder) => {
      console.log('🔄 Cập nhật đơn (Admin):', updatedOrder);
      setRecentOrders((prev) =>
        prev.map((o) => o.id === updatedOrder.id ? updatedOrder : o)
      );
    });

    socket.on('connect_error', (error) => {
      console.warn('Socket.io connection error:', error);
    });

    return () => {
      socket.off('new-order');
      socket.off('order-status-update');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, []);

  // Load menu items để quản lý hàng
  const loadMenuItems = async () => {
    try {
      setInventoryLoading(true);
      const response = await axios.get(ADMIN_MENU_API.GET_ALL_MENU);
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
      await axios.put(ADMIN_MENU_API.UPDATE_AVAILABILITY(itemId), {
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
    borderBottom: '2px solid #e85d0420',
    paddingBottom: '0',
    overflowX: 'auto',
    fontFamily: '"Times New Roman", Times, serif'
  };

  const tabButtonStyle = (isActive) => ({
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '3px solid #e85d04' : '3px solid transparent',
    color: isActive ? '#e85d04' : '#999',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: isActive ? '700' : '600',
    transition: 'all 0.2s',
    marginBottom: '-2px',
    whiteSpace: 'nowrap',
    fontFamily: '"Times New Roman", Times, serif'
  });

  // --- GIAO DIỆN TRANG CHỦ (THỐNG KÊ + BẢNG NHÂN VIÊN) ---
  const StatCard = ({ label, value, icon, color = '#e85d04' }) => (
    <div style={{
      background: '#fff',
      border: `2px solid ${color}30`,
      padding: '24px 20px',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(232, 93, 4, 0.08)',
      fontFamily: '"Times New Roman", Times, serif'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 12px 20px ${color}25`;
      e.currentTarget.style.borderColor = `${color}50`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(232, 93, 4, 0.08)';
      e.currentTarget.style.borderColor = `${color}30`;
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#999', margin: 0, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: '"Times New Roman", Times, serif' }}>{label}</p>
          <p style={{ color: '#e85d04', fontSize: '2.3rem', fontWeight: '800', margin: '10px 0 0', fontFamily: '"Times New Roman", Times, serif' }}>{loading ? 'Đang tải' : value}</p>
        </div>
        <span style={{ fontSize: '2.2rem' }}>{icon}</span>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <>
      <header style={{ marginBottom: '36px' }}>
        <h1 style={{ margin: 0, fontSize: '2.6rem', fontWeight: '900', color: '#e85d04', fontFamily: '"Times New Roman", Times, serif' }}>Tổng quan Hệ thống</h1>
        <p style={{ margin: '10px 0 0', color: '#666', fontSize: '1.05rem', fontFamily: '"Times New Roman", Times, serif' }}>Giám sát doanh thu, bàn hoạt động và nhân sự</p>
      </header>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        <StatCard label="Doanh thu hôm nay" value={formatCurrency(dailyRevenue ?? 0)} icon="" color="#10b981" />
        <StatCard label="Bàn hoạt động" value={activeTables} icon="" color="#f59e0b" />
        <StatCard label="Nhân viên" value={employees.length} icon="" color="#e85d04" />
        <StatCard label="Đơn chờ" value={recentOrders.length} icon="" color="#06b6d4" />
      </section>

      {/* Biểu đồ */}
      <section style={{ background: '#fff', padding: '28px', borderRadius: '12px', marginBottom: '28px', border: '2px solid #e85d0420', boxShadow: '0 4px 12px rgba(232, 93, 4, 0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#e85d04', margin: 0, fontSize: '1.4rem', fontWeight: '800', fontFamily: '"Times New Roman", Times, serif' }}>Doanh thu 7 ngày</h2>
          <span style={{ background: '#e85d0415', color: '#e85d04', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', fontFamily: '"Times New Roman", Times, serif' }}>↑ Xu hướng tăng</span>
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
                  <stop offset="0%" stopColor="#e85d04" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#e85d04" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Đơn hàng gần đây */}
      {recentOrders.length > 0 && (
        <section style={{ background: '#fff', padding: '28px', borderRadius: '12px', marginBottom: '28px', border: '2px solid #e85d0420', boxShadow: '0 4px 12px rgba(232, 93, 4, 0.08)' }}>
          <h2 style={{ color: '#e85d04', margin: '0 0 20px 0', fontSize: '1.4rem', fontWeight: '800', fontFamily: '"Times New Roman", Times, serif' }}>Đơn hàng gần đây</h2>
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
                e.currentTarget.style.borderColor = '#e85d04';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#e85d04', fontFamily: '"Times New Roman", Times, serif' }}>Bàn {order.tableId}</span>
                  <span style={{ background: '#e85d04', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', fontFamily: '"Times New Roman", Times, serif' }}>Chờ</span>
                </div>
                <p style={{ color: '#666', margin: 0, fontSize: '0.85rem', fontFamily: '"Times New Roman", Times, serif' }}>{order.items?.length || 0} món</p>
                <p style={{ color: '#e85d04', margin: '10px 0 0', fontSize: '1.1rem', fontWeight: '700', fontFamily: '"Times New Roman", Times, serif' }}>{formatCurrency(order.totalAmount || 0)}</p>
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
<<<<<<< HEAD
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.6rem', fontWeight: '900', color: '#e85d04', fontFamily: '"Times New Roman", Times, serif' }}>Quản lý Kho hàng</h1>
            <p style={{ margin: '10px 0 0', color: '#666', fontSize: '1.05rem', fontFamily: '"Times New Roman", Times, serif' }}>Theo dõi và cập nhật trạng thái hàng hóa trong thực đơn</p>
          </div>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm món..."
            value={inventorySearch}
            onChange={(e) => setInventorySearch(e.target.value)}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: '2px solid #e85d0440',
              outline: 'none',
              fontSize: '1rem',
              width: '100%',
              maxWidth: '300px',
              fontFamily: '"Times New Roman", Times, serif'
            }}
          />
        </div>
=======
        <h1 style={{ margin: 0, fontSize: '2.6rem', fontWeight: '900', color: '#e85d04', fontFamily: '"Times New Roman", Times, serif' }}>Quản lý Kho hàng</h1>
        <p style={{ margin: '10px 0 0', color: '#666', fontSize: '1.05rem', fontFamily: '"Times New Roman", Times, serif' }}>Theo dõi và cập nhật trạng thái hàng hóa trong thực đơn</p>
>>>>>>> e798391b17b6b0b464c7b6bd151b1f32e25ee24b
      </header>

      {error && (
        <div style={{ background: '#e85d04', color: '#fff', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.95rem', fontFamily: '"Times New Roman", Times, serif' }}>
          {error}
        </div>
      )}

      {inventoryLoading ? (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Đang tải...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
<<<<<<< HEAD
          {menuItems.filter(item => item.name.toLowerCase().includes(inventorySearch.toLowerCase())).map((item) => (
=======
          {menuItems.map((item) => (
>>>>>>> e798391b17b6b0b464c7b6bd151b1f32e25ee24b
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
                <h3 style={{ margin: '0 0 6px 0', color: '#0f0e2e', fontSize: '1rem', fontWeight: '700', fontFamily: '"Times New Roman", Times, serif' }}>
                  {item.name}
                </h3>
                <p style={{ margin: 0, color: '#e85d04', fontSize: '0.85rem', fontFamily: '"Times New Roman", Times, serif', fontWeight: '600' }}>
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
                    ? '#e85d0415'
                    : '#9ca3af15',
                  color: item.isAvailable ? '#e85d04' : '#6b7280',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  fontFamily: '"Times New Roman", Times, serif'
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
                    ? '#e85d04'
                    : '#9ca3af',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: actionLoading === item.id ? 'not-allowed' : 'pointer',
                  opacity: actionLoading === item.id ? 0.7 : 1,
                  transition: 'all 0.2s',
                  fontFamily: '"Times New Roman", Times, serif'
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
          onClick={() => setActiveTab('cashier')}
          style={tabButtonStyle(activeTab === 'cashier')}
        >
          Quầy Thu Ngân
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
      {activeTab === 'cashier' && (
        <CashierPage />
      )}
      {activeTab === 'inventory' && renderInventory()}
      {activeTab === 'employee' && (
<<<<<<< HEAD
        <div style={{ margin: '0 auto' }}>
=======
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ color: '#e85d04', marginBottom: '20px', fontFamily: '"Times New Roman", Times, serif' }}>Tạo tài khoản Nhân viên</h2>
>>>>>>> e798391b17b6b0b464c7b6bd151b1f32e25ee24b
          <EmployeeManager />
        </div>
      )}
      {activeTab === 'menuqr' && (
        <AdminMenuQR />
      )}
    </AdminLayout>
  );
}
