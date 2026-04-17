import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingCart } from 'lucide-react';

export default function AdminLayout({ children, onLogout, title = 'Admin' }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout?.();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      color: '#0f0e2e',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* MODERN HEADER */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo & Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.3rem',
              fontWeight: 800
            }}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <h1 style={{ 
                fontSize: '1.3rem', 
                fontWeight: 700, 
                margin: 0,
                color: '#0f0e2e'
              }}>
                {title}
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#999', margin: '2px 0 0' }}>
                Quản lý nhà hàng
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '24px 20px'
      }}>
        {children}
      </div>
    </div>
  );
}
