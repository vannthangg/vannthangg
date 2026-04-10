import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1135 100%)',
    backgroundAttachment: 'fixed',
    color: '#f8fafc',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    animation: 'fadeIn 0.6s ease-out'
  },
  title: {
    fontSize: 'clamp(2rem, 6vw, 2.8rem)',
    margin: 0,
    marginBottom: '12px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1.2
  },
  subtitle: {
    color: '#94a3b8',
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 500
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '800px'
  },
  tableButton: {
    padding: '32px 16px',
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(26, 31, 58, 0.8) 100%)',
    color: '#f8fafc',
    border: '1.5px solid rgba(148, 163, 184, 0.12)',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 700,
    transition: 'var(--transition)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  tableButtonHover: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 32px rgba(59, 130, 246, 0.15)'
  },
  loading: {
    textAlign: 'center',
    color: '#94a3b8',
    gridColumn: '1/-1',
    padding: '40px',
    fontSize: '1rem'
  },
  error: {
    textAlign: 'center',
    color: '#fca5a5',
    gridColumn: '1/-1',
    padding: '40px',
    fontSize: '1rem'
  },
  backButton: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 700,
    marginTop: '24px',
    transition: 'var(--transition)',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
  },
  backButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
  }
};

export default function ScanQR() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/tables');
        setTables(res.data || []);
      } catch (err) {
        console.error('Lỗi tải danh sách bàn:', err);
        setTables([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const handleSelectTable = (tableId) => {
    console.log('Bàn được chọn:', tableId, 'Type:', typeof tableId);
    navigate(`/table/${tableId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Chọn Bàn</h1>
        <p style={styles.subtitle}>Chọn bàn của bạn để xem thực đơn và đặt hàng</p>
      </div>

      <div style={styles.grid}>
        {loading ? (
          <div style={styles.loading}>
            Đang tải danh sách bàn...
          </div>
        ) : tables.length === 0 ? (
          <div style={styles.error}>
            Không tìm thấy bàn nào
          </div>
        ) : (
          tables.map(table => (
            <button
              key={table.id}
              onClick={() => handleSelectTable(table.id)}
              style={styles.tableButton}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.tableButtonHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: styles.tableButton.background, borderColor: 'rgba(148, 163, 184, 0.12)', transform: 'translateY(0)', boxShadow: 'none' })}
            >
              {table.name}
            </button>
          ))
        )}
      </div>

      <button
        onClick={() => navigate('/')}
        style={styles.backButton}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.backButtonHover)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' })}
      >
        ← Quay lại trang chủ
      </button>
    </div>
  );
}
