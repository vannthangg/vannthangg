import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1135 100%)',
    backgroundAttachment: 'fixed',
    position: 'relative'
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(26, 31, 58, 0.8)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    borderRadius: '24px',
    padding: '48px 32px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(12px)',
    animation: 'slideInUp 0.6s ease-out'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '16px'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 800,
    color: '#f8fafc',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    fontWeight: 500
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#cbd5e1',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  input: {
    background: 'rgba(15, 23, 42, 0.8)',
    color: '#f8fafc',
    border: '1.5px solid rgba(148, 163, 184, 0.12)',
    padding: '14px 16px',
    borderRadius: '12px',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    transition: 'var(--transition)',
    backdropFilter: 'blur(4px)'
  },
  inputFocus: {
    borderColor: 'rgba(59, 130, 246, 0.4)',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    background: 'rgba(15, 23, 42, 0.95)'
  },
  button: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    color: '#fff',
    padding: '14px 28px',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.95rem',
    marginTop: '12px',
    cursor: 'pointer',
    transition: 'var(--transition)',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    marginTop: '8px'
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginTop: '24px',
    transition: 'var(--transition)'
  }
};

export default function Login({onLogin}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { username, password });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const userRole = res.data.user.role.toLowerCase();

      if (userRole === 'admin') {
        onLogin();
        navigate('/admin');
      } else {
        onLogin();
        navigate('/kitchen');
      }
    } catch (err) {
      setError('Sai tên đăng nhập hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = (e) => {
    Object.assign(e.target.style, styles.inputFocus);
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'rgba(148, 163, 184, 0.12)';
    e.target.style.boxShadow = 'none';
    e.target.style.background = 'rgba(15, 23, 42, 0.8)';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          
          <h1 style={styles.title}>Đăng nhập</h1>
          <p style={styles.subtitle}>ORDER FOOD</p>
        </div>

        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <Link to="/" style={styles.backLink}>
          ← Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
