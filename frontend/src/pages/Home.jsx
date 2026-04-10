import { Link } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1135 100%)',
    backgroundAttachment: 'fixed',
    position: 'relative',
    overflow: 'hidden'
  },
  decorativeBlob1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    top: '-300px',
    left: '-300px',
    filter: 'blur(40px)',
    pointerEvents: 'none'
  },
  decorativeBlob2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    bottom: '-250px',
    right: '-250px',
    filter: 'blur(40px)',
    pointerEvents: 'none'
  },
  content: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    maxWidth: '700px',
    animation: 'fadeIn 0.8s ease-out'
  },
  title: {
    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 50%, #ec4899 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#cbd5e1',
    marginBottom: '48px',
    lineHeight: 1.6,
    fontWeight: 500
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '48px'
  },
  buttonPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 40px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '16px',
    fontSize: '1.1rem',
    fontWeight: 700,
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
    transition: 'var(--transition)',
    border: 'none',
    cursor: 'pointer',
    minWidth: '280px'
  },
  buttonPrimaryHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 48px rgba(59, 130, 246, 0.5)'
  },
  buttonSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 40px',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '2px solid rgba(59, 130, 246, 0.3)',
    color: '#60a5fa',
    textDecoration: 'none',
    borderRadius: '16px',
    fontSize: '1.1rem',
    fontWeight: 700,
    transition: 'var(--transition)',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
    minWidth: '280px'
  },
  buttonSecondaryHover: {
    background: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.6)',
    transform: 'translateY(-4px)'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '24px',
    marginTop: '64px',
    padding: '32px',
    background: 'rgba(26, 31, 58, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '20px',
    backdropFilter: 'blur(12px)'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#60a5fa',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }
};

export default function Home() {
  const handleHover = (e, isHover) => {
    const button = e.currentTarget;
    if (button.classList.contains('btn-primary-home')) {
      Object.assign(button.style, isHover ? styles.buttonPrimaryHover : { transform: 'translateY(0)' });
    } else {
      Object.assign(button.style, isHover ? styles.buttonSecondaryHover : { transform: 'translateY(0)' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.decorativeBlob1} />
      <div style={styles.decorativeBlob2} />
      
      <div style={styles.content}>
        <h1 style={styles.title}>Order Food</h1>
        <p style={styles.subtitle}>Hệ thống đặt hàng nhà hàng thông minh. Đặt hàng nhanh, giao nhanh, thưởng thức ngay!</p>
        
        <div style={styles.buttonGroup}>
          <Link 
            to="/scan" 
            style={styles.buttonPrimary}
            className="btn-primary-home"
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Quét mã QR để đặt hàng
          </Link>
          <Link 
            to="/login" 
            style={styles.buttonSecondary}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Đăng nhập quản lý
          </Link>
        </div>

        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>500+</div>
            <div style={styles.statLabel}>Thực đơn</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>Hoạt động</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>Nhanh</div>
            <div style={styles.statLabel}>Nhanh & Tiện</div>
          </div>
        </div>
      </div>
    </div>
  );
}
