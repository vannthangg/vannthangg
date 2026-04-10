import { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeSVG as QRCode } from 'qrcode.react';

export default function TableManager() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    // Tạm thời hiển thị danh sách bàn mẫu giống trong ảnh của bạn
    // Sau này nối API thành công thì mở comment dòng axios bên dưới
    setTables([
      { id: 1, name: 'Bàn 1' }, 
      { id: 2, name: 'Bàn 2' },
      { id: 3, name: 'Bàn 3' },
      { id: 4, name: 'Bàn 4' }
    ]);
    
    /* axios.get('http://localhost:3000/api/admin/tables')
      .then(res => setTables(res.data))
      .catch(err => console.error(err));
    */
  }, []);

  return (
    <div style={{
      backgroundColor: '#1e293b', 
      padding: '40px', 
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)', 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Tiêu đề */}
      <h2 style={{ color: '#fff', fontSize: '2rem', margin: '0 0 10px 0' }}>Quản lý Bàn & Mã QR</h2>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '35px' }}>
        Danh sách mã QR cho từng bàn. Bạn có thể in hoặc tải xuống để dán tại bàn cho khách quét gọi món.
      </p>
      
      {/* Lưới chứa các Thẻ Bàn (Responsive tự xuống dòng) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
        {tables.map(table => {
          // Đường link tĩnh gắn vào mã QR
          const qrUrl = `http://localhost:5173/table/${table.id}`;
          
          return (
            <div key={table.id} style={{ 
              backgroundColor: '#334155', 
              padding: '24px', 
              borderRadius: '16px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              border: '1px solid #475569',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Tên bàn */}
              <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: '0 0 20px 0' }}>{table.name}</h3>
              
              {/* Vùng chứa QR (Lót nền trắng để điện thoại dễ quét) */}
              <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '12px', marginBottom: '15px' }}>
                <QRCode value={qrUrl} size={150} />
              </div>

              {/* Đường link nhỏ hiển thị bên dưới */}
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', margin: '0 0 20px 0', wordBreak: 'break-all' }}>
                {qrUrl}
              </p>

              {/* Nút bấm tải về */}
              <button style={{ 
                width: '100%', padding: '12px', borderRadius: '8px', 
                backgroundColor: '#3b82f6', color: '#fff', fontSize: '1rem',
                fontWeight: 'bold', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
              }}>
                Tải xuống mã QR
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}