import { useNavigate } from 'react-router-dom';

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
      backgroundColor: '#0f172a',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '24px', maxWidth: '1400px', margin: '0 auto 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, flex: 1 }}>{title}</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 16px',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
        >
          Đăng xuất
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}
