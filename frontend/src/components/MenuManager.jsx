import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function MenuManager() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  
  const fileInputRef = useRef(null);

  // Tải danh sách menu & danh mục khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/menu'),
          axios.get('http://localhost:3000/api/admin/categories')
        ]);
        setMenuItems(menuRes.data || []);
        setCategories(catRes.data || []);
      } catch (error) {
        console.error(error);
        setMessage('Lỗi tải dữ liệu từ server');
      }
    };
    fetchData();
  }, []);

  const handleAddMenu = async (e) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      setMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', Number(price));
    formData.append('categoryId', Number(categoryId));
    formData.append('description', description);
    if (imageFile) formData.append('image', imageFile);
    else if (imageUrl) formData.append('image', imageUrl);

    try {
      setLoading(true);
      const response = await axios[editingId ? 'put' : 'post'](
        editingId 
          ? `http://localhost:3000/api/admin/menu/${editingId}`
          : `http://localhost:3000/api/admin/menu`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setMessage(`${editingId ? 'Cập nhật' : 'Thêm'} thành công!`);
      
      if (editingId) {
        setMenuItems(menuItems.map(item => item.id === editingId ? response.data : item));
        setEditingId(null);
      } else {
        setMenuItems([...menuItems, response.data]);
      }

      // Reset form
      setName('');
      setPrice('');
      setCategoryId('');
      setDescription('');
      setImageFile(null);
      setImageUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`${error.response?.data?.error || 'Lỗi'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price);
    setCategoryId(item.categoryId);
    setDescription(item.description || '');
    setImageUrl(item.image);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn chắc chắn muốn xóa?')) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/admin/menu/${id}`);
      setMenuItems(menuItems.filter(item => item.id !== id));
      setMessage('Xóa thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Lỗi xóa');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (catId) => {
    return categories.find(c => c.id === catId)?.name || `Danh mục ${catId}`;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Form Thêm/Sửa */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '40px', borderRadius: '24px', marginBottom: '40px', border: '2px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <h2 style={{ color: '#fff', fontSize: '2rem', margin: 0, marginBottom: '12px' }}>
          {editingId ? 'Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', margin: '0 0 30px' }}>
          {editingId ? 'Cập nhật thông tin món ăn' : 'Tạo một món ăn mới cho thực đơn'}
        </p>

        <form onSubmit={handleAddMenu}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#e0e7ff', marginBottom: '10px', fontWeight: '600' }}>Tên món</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Cơm tấm sườn nước mắm"
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#fff', border: '2px solid rgba(148, 163, 184, 0.2)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#e0e7ff', marginBottom: '10px', fontWeight: '600' }}>Giá (VNĐ)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="45000"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#fff', border: '2px solid rgba(148, 163, 184, 0.2)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#e0e7ff', marginBottom: '10px', fontWeight: '600' }}>Danh mục</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#fff', border: '2px solid rgba(148, 163, 184, 0.2)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                <option value="">Chọn danh mục</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#e0e7ff', marginBottom: '10px', fontWeight: '600' }}>Mô tả</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả chi tiết về món ăn..."
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#fff', border: '2px solid rgba(148, 163, 184, 0.2)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', minHeight: '100px', fontFamily: 'system-ui' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#e0e7ff', marginBottom: '10px', fontWeight: '600' }}>Ảnh người ăn</label>
            <div style={{ position: 'relative', width: '100%', padding: '30px', borderRadius: '12px', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '2px dashed #64748b', textAlign: 'center', boxSizing: 'border-box' }}>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} ref={fileInputRef}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              <div style={{ pointerEvents: 'none' }}>
                <p style={{ color: imageFile ? '#a78bfa' : '#94a3b8', fontSize: '1.1rem', margin: 0, fontWeight: 'bold' }}>
                  {imageFile ? `${imageFile.name}` : 'Click để chọn ảnh'}
                </p>
                {imageUrl && <p style={{ color: '#86efac', fontSize: '0.9rem', margin: '10px 0 0' }}>Ảnh hiện tại: {imageUrl.split('/').pop()}</p>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading}
              style={{ flex: 1, padding: '16px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', color: '#fff', fontSize: '1rem', fontWeight: '700', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Đang xử lý...' : editingId ? 'Cập nhật' : 'Thêm'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setName(''); setPrice(''); setCategoryId(''); setDescription(''); setImageFile(null); setImageUrl(''); }}
                style={{ padding: '16px 24px', borderRadius: '12px', background: '#6b7280', color: '#fff', fontSize: '1rem', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                ✕ Hủy
              </button>
            )}
          </div>

          {message && (
            <div style={{ marginTop: '16px', padding: '14px', borderRadius: '12px', background: message.includes('') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: message.includes('') ? '#86efac' : '#fca5a5', border: message.includes('') ? '2px solid rgba(16, 185, 129, 0.5)' : '2px solid rgba(239, 68, 68, 0.5)', fontSize: '0.95rem', fontWeight: '600' }}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Danh sách Món Ăn */}
      <h2 style={{ color: '#e0e7ff', fontSize: '1.8rem', marginBottom: '24px' }}>Danh sách Món Ăn ({menuItems.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {menuItems.map(item => (
          <div key={item.id} style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '2px solid #334155', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(139, 92, 246, 0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'; }}>
            
            {/* Ảnh */}
            <div style={{ position: 'relative', width: '100%', height: '180px', background: '#334155', overflow: 'hidden' }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#8b5cf6', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
                {getCategoryName(item.categoryId)}
              </div>
            </div>

            {/* Nội dung */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 8px', color: '#e0e7ff', fontSize: '1.1rem', fontWeight: '700' }}>{item.name}</h3>
              {item.description && <p style={{ margin: '0 0 12px', color: '#cbd5e1', fontSize: '0.9rem' }}>{item.description}</p>}
              <p style={{ margin: 0, color: '#10b981', fontSize: '1.3rem', fontWeight: '700' }}>{item.price.toLocaleString('vi-VN')} đ</p>

              {/* Nút hành động */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button onClick={() => handleEdit(item)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', color: '#000', fontSize: '0.9rem', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                  Sửa
                </button>
                <button onClick={() => handleDelete(item.id)} disabled={loading}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', background: '#ef4444', color: '#fff', fontSize: '0.9rem', fontWeight: '700', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.2rem' }}>Chưa có món ăn nào. Hãy thêm một số món.</p>
        </div>
      )}
    </div>
  );
}