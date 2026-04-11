import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

export default function AdminLayout({ children, onLogout, title = 'Admin' }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout?.();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#0f172a' : '#f0f4ff',
      color: isDark ? '#fff' : '#0f172a',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '24px',
        maxWidth: '1400px',
        margin: '0 auto 24px',
        gap: '12px'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, flex: 1 }}>{title}</h1>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? 'Chuyển sang Light Mode' : 'Chuyển sang Dark Mode'}
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>

        {/* Logout */}
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
