import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeSVG as QRCode } from 'qrcode.react';

export default function QRCodeManager({ onLogout }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTables, setSelectedTables] = useState(new Set());
  const [printMode, setPrintMode] = useState('all');
  const qrRefs = useRef({});

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/tables');
      setTables(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Lỗi tải dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTable = (tableId) => {
    const newSelected = new Set(selectedTables);
    if (newSelected.has(tableId)) {
      newSelected.delete(tableId);
    } else {
      newSelected.add(tableId);
    }
    setSelectedTables(newSelected);
  };

  const selectAll = () => {
    if (selectedTables.size === tables.length) {
      setSelectedTables(new Set());
    } else {
      setSelectedTables(new Set(tables.map(t => t.id)));
    }
  };

  const downloadQR = (table) => {
    const qrElement = qrRefs.current[table.id];
    if (qrElement) {
      const canvas = qrElement.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `QR_${table.name}.png`;
        link.click();
      }
    }
  };

  const printQR = (table) => {
    const qrElement = qrRefs.current[table.id];
    if (qrElement) {
      const canvas = qrElement.querySelector('canvas');
      if (canvas) {
        const qrImage = canvas.toDataURL('image/png');
        const printWindow = window.open('', '', 'height=600,width=600');
        const html = `<html><head><title>In ${table.name}</title><style>body{display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:white}.container{text-align:center;padding:40px}h1{margin:0 0 20px 0;font-size:24px}img{max-width:300px;border:2px solid #333;margin:20px 0}p{font-size:12px;color:#666}</style></head><body><div class="container"><h1>${table.name}</h1><img src="${qrImage}" /><p>http://localhost:3000/table/${table.id}</p></div></body></html>`;
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
      }
    }
  };

  const printMultiple = () => {
    const tablesToPrint = printMode === 'all' ? tables : tables.filter(t => selectedTables.has(t.id));
    const qrImages = [];

    tablesToPrint.forEach(table => {
      const qrElement = qrRefs.current[table.id];
      if (qrElement) {
        const canvas = qrElement.querySelector('canvas');
        if (canvas) {
          qrImages.push({ table, image: canvas.toDataURL('image/png') });
        }
      }
    });

    const printWindow = window.open('', '', 'height=800,width=1200');
    let html = `<html><head><title>In QR</title><style>body{font-family:Arial;padding:20px;background:white}h1{text-align:center;margin-bottom:30px}.qr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:30px}.qr-card{border:2px solid #ddd;padding:20px;border-radius:8px;background:#fafafa}h3{margin:15px 0;font-size:18px}img{max-width:180px;border:1px solid #ccc}p{font-size:12px;color:#666}</style></head><body><h1>Mã QR - ${new Date().toLocaleDateString('vi-VN')}</h1><div class="qr-grid">`;

    qrImages.forEach(({ table, image }) => {
      html += `<div class="qr-card"><h3>${table.name}</h3><img src="${image}" /><p>http://localhost:3000/table/${table.id}</p></div>`;
    });

    html += `</div></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}><p>Đang tải...</p></div>;
  }

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff' }}><div><p style={{ color: '#ef4444' }}>{error}</p><button onClick={fetchTables} style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Thử lại</button></div></div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Quản lý Mã QR Bàn</h1>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Đăng xuất</button>
      </div>

      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={printMode} onChange={(e) => setPrintMode(e.target.value)} style={{ padding: '8px 12px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }}>
          <option value="all">Tất cả bàn ({tables.length})</option>
          <option value="selected">Bàn chọn ({selectedTables.size})</option>
        </select>
        <button onClick={printMultiple} disabled={printMode === 'selected' && selectedTables.size === 0} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', opacity: printMode === 'selected' && selectedTables.size === 0 ? 0.5 : 1 }}>In</button>
        <button onClick={selectAll} style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>{selectedTables.size === tables.length ? 'Bỏ' : 'Chọn'}</button>
        <span style={{ color: '#9ca3af', marginLeft: 'auto' }}>Chọn: {selectedTables.size}/{tables.length}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {tables.map(table => (
          <div key={table.id} onClick={() => toggleTable(table.id)} style={{ background: '#1e293b', border: selectedTables.has(table.id) ? '3px solid #3b82f6' : '1px solid #334155', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
            <div ref={(el) => { if (el) qrRefs.current[table.id] = el; }} style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', padding: '10px', backgroundColor: '#334155', borderRadius: '8px' }}>
              <QRCode value={`http://localhost:3000/table/${table.id}`} size={180} level="H" />
            </div>
            <h3 style={{ margin: '10px 0', fontSize: '1.3rem' }}>{selectedTables.has(table.id) ? '' : ''}{table.name}</h3>
            <p style={{ margin: '8px 0', color: '#9ca3af', fontSize: '0.9rem' }}>ID: {table.id}</p>
            <p style={{ margin: '8px 0', padding: '8px', backgroundColor: '#0f172a', borderRadius: '4px', color: '#94a3b8', fontSize: '0.85rem' }}>http://localhost:3000/table/{table.id}</p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button onClick={(e) => { e.stopPropagation(); printQR(table); }} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>In</button>
              <button onClick={(e) => { e.stopPropagation(); downloadQR(table); }} style={{ flex: 1, background: '#f59e0b', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>Tải</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px', color: '#9ca3af' }}>
        <h3 style={{ color: '#fff', marginTop: 0 }}>Hướng dẫn:</h3>
        <ul><li>Chọn bàn → Nhấp "In" in tất cả</li><li>Hoặc "In" để in riêng</li><li>"Tải" để lưu hình</li></ul>
      </div>
    </div>
  );
}
