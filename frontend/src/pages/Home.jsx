import { Link } from 'react-router-dom';
import { ShoppingCart, Zap, Clock, Star } from 'lucide-react';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f5f5',
    paddingTop: 0,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    lineHeight: 1.5
  },
  header: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    color: '#fff',
    padding: '16px 20px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '-0.02em'
  },
  headerLinks: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  headerLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.3s',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '0.01em'
  },
  hero: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    color: '#fff',
    padding: '48px 20px',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 800,
    marginBottom: '12px',
    lineHeight: 1.3,
    color: '#fff',
    letterSpacing: '-0.02em'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '32px',
    opacity: 0.95,
    fontWeight: 500,
    color: '#fff',
    lineHeight: 1.6,
    letterSpacing: '0.01em'
  },
  heroButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    background: '#fff',
    color: '#2563eb',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.05rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    letterSpacing: '0.02em'
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.05rem',
    fontWeight: 700,
    border: '2px solid #fff',
    cursor: 'pointer',
    transition: 'all 0.3s',
    letterSpacing: '0.02em'
  },
  features: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  featureCard: {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'all 0.3s'
  },
  featureIcon: {
    width: '60px',
    height: '60px',
    background: '#f0f4ff',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    color: '#2563eb'
  },
  featureTitle: {
    fontSize: '1.2rem',
    fontWeight: 800,
    marginBottom: '8px',
    color: '#0a0a0a',
    letterSpacing: '-0.01em'
  },
  featureDesc: {
    fontSize: '0.95rem',
    color: '#333',
    lineHeight: 1.7,
    letterSpacing: '0.005em',
    fontWeight: 500
  }
};

export default function Home({ onLogin }) {
  const handlePrimaryHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }
  };

  const handleSecondaryHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
    }
  };

  const handleFeatureHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(37, 99, 235, 0.15)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(243, 235, 235, 0.08)';
    }
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <ShoppingCart size={28} />
            <span>OrderFood</span>
          </div>
          <div style={styles.headerLinks}>
            <Link to="/scan" style={{...styles.headerLink, textDecoration: 'none'}} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
              🔍 Quét QR
            </Link>
            <Link to="/login" style={{...styles.headerLink, textDecoration: 'none'}} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
              👤 Đăng nhập
            </Link>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Đặt Món Nhanh<br/> Chỉ Với Một Cú Quét!🍔🧁
          </h1>
          <p style={styles.heroSubtitle}>
            Hệ thống đặt món thông minh cho nhà hàng. Quét mã QR, chọn món, thanh toán - chỉ trong vài giây!
          </p>
          <div style={styles.heroButtons}>
            <Link 
              to="/scan"
              style={styles.primaryBtn}
              onMouseEnter={(e) => handlePrimaryHover(e, true)}
              onMouseLeave={(e) => handlePrimaryHover(e, false)}
            >
              <Zap size={20} /> Đặt món ngay
            </Link>
            <Link 
              to="/login"
              style={styles.secondaryBtn}
              onMouseEnter={(e) => handleSecondaryHover(e, true)}
              onMouseLeave={(e) => handleSecondaryHover(e, false)}
            >
              <Star size={20} /> Quản lý nhà hàng
            </Link>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={styles.features}>
        <div 
          style={styles.featureCard}
          onMouseEnter={(e) => handleFeatureHover(e, true)}
          onMouseLeave={(e) => handleFeatureHover(e, false)}
        >
          <div style={styles.featureIcon}>
            <Zap size={28} />
          </div>
          <h3 style={styles.featureTitle}>Nhanh Chóng</h3>
          <p style={styles.featureDesc}>Đặt món chỉ trong vài giây, không cần chờ đợi</p>
        </div>

        <div 
          style={styles.featureCard}
          onMouseEnter={(e) => handleFeatureHover(e, true)}
          onMouseLeave={(e) => handleFeatureHover(e, false)}
        >
          <div style={styles.featureIcon}>
            <Clock size={28} />
          </div>
          <h3 style={styles.featureTitle}>Phục Vụ 24/7</h3>
          <p style={styles.featureDesc}>Luôn sẵn sàng phục vụ bạn mọi lúc</p>
        </div>

        <div 
          style={styles.featureCard}
          onMouseEnter={(e) => handleFeatureHover(e, true)}
          onMouseLeave={(e) => handleFeatureHover(e, false)}
        >
          <div style={styles.featureIcon}>
            <ShoppingCart size={28} />
          </div>
          <h3 style={styles.featureTitle}>500+ Món Ăn</h3>
          <p style={styles.featureDesc}>Lựa chọn đa dạng, phong phú cho mọi khẩu vị</p>
        </div>

        <div 
          style={styles.featureCard}
          onMouseEnter={(e) => handleFeatureHover(e, true)}
          onMouseLeave={(e) => handleFeatureHover(e, false)}
        >
          <div style={styles.featureIcon}>
            <Star size={28} />
          </div>
          <h3 style={styles.featureTitle}>Chất Lượng</h3>
          <p style={styles.featureDesc}>Đảm bảo chất lượng tốt nhất cho khách hàng</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        background: '#f9f9f9',
        borderTop: '1px solid #e5e5e5',
        padding: '40px 20px',
        textAlign: 'center',
        color: '#666',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        lineHeight: 1.6
      }}>
        <p style={{ margin: '0 0 16px', fontSize: '0.95rem' }}>© 2026 OrderFood. Tất cả quyền được bảo lưu.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Về chúng tôi</a>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Điều khoản sử dụng</a>
          <a href="#" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Liên hệ</a>
        </div>
      </div>
    </div>
  );
}
