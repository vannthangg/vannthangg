import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ADMIN_MENU_API } from '../config/api';

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
          axios.get(ADMIN_MENU_API.GET_ALL_MENU),
          axios.get(ADMIN_MENU_API.GET_CATEGORIES)
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
          ? ADMIN_MENU_API.UPDATE_MENU_ITEM(editingId)
          : ADMIN_MENU_API.ADD_MENU_ITEM,
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
      await axios.delete(ADMIN_MENU_API.DELETE_MENU_ITEM(id));
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: '"Times New Roman", Times, serif' }}>
      {/* Form Thêm/Sửa */}
      <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', marginBottom: '40px', border: '2px solid #e85d0420', boxShadow: '0 4px 12px rgba(232, 93, 4, 0.08)', fontFamily: '"Times New Roman", Times, serif' }}>
        <h2 style={{ color: '#e85d04', fontSize: '2rem', margin: 0, marginBottom: '12px', fontFamily: '"Times New Roman", Times, serif' }}>
          {editingId ? 'Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
        </h2>
        <p style={{ color: '#666', fontSize: '1rem', margin: '0 0 30px', fontFamily: '"Times New Roman", Times, serif' }}>
          {editingId ? 'Cập nhật thông tin món ăn' : 'Tạo một món ăn mới cho thực đơn'}
        </p>

        <form onSubmit={handleAddMenu}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#666', marginBottom: '10px', fontWeight: '600', fontFamily: '"Times New Roman", Times, serif' }}>Tên món</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Cơm tấm sườn nước mắm"
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', backgroundColor: '#fff', color: '#0f0e2e', border: '2px solid #e85d0420', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: '"Times New Roman", Times, serif' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#666', marginBottom: '10px', fontWeight: '600', fontFamily: '"Times New Roman", Times, serif' }}>Giá (VNĐ)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="45000"
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', backgroundColor: '#fff', color: '#0f0e2e', border: '2px solid #e85d0420', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: '"Times New Roman", Times, serif' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', marginBottom: '10px', fontWeight: '600', fontFamily: '"Times New Roman", Times, serif' }}>Danh mục</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', backgroundColor: '#fff', color: '#0f0e2e', border: '2px solid #e85d0420', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer', fontFamily: '"Times New Roman", Times, serif' }}>
                <option value="">Chọn danh mục</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#666', marginBottom: '10px', fontWeight: '600', fontFamily: '"Times New Roman", Times, serif' }}>Mô tả</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả chi tiết về món ăn..."
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', backgroundColor: '#fff', color: '#0f0e2e', border: '2px solid #e85d0420', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', minHeight: '100px', fontFamily: '"Times New Roman", Times, serif' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#666', marginBottom: '10px', fontWeight: '600', fontFamily: '"Times New Roman", Times, serif' }}>Ảnh người ăn</label>
            <div style={{ position: 'relative', width: '100%', padding: '30px', borderRadius: '12px', backgroundColor: '#f9f9f9', border: '2px dashed #e85d0450', textAlign: 'center', boxSizing: 'border-box' }}>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} ref={fileInputRef}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              <div style={{ pointerEvents: 'none' }}>
                <p style={{ color: imageFile ? '#e85d04' : '#999', fontSize: '1.1rem', margin: 0, fontWeight: 'bold', fontFamily: '"Times New Roman", Times, serif' }}>
                  {imageFile ? `${imageFile.name}` : 'Click để chọn ảnh'}
                </p>
                {imageUrl && <p style={{ color: '#666', fontSize: '0.9rem', margin: '10px 0 0', fontFamily: '"Times New Roman", Times, serif' }}>Ảnh hiện tại: {imageUrl.split('/').pop()}</p>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading}
              style={{ flex: 1, padding: '16px 24px', borderRadius: '12px', background: '#e85d04', color: '#fff', fontSize: '1rem', fontWeight: '700', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1, fontFamily: '"Times New Roman", Times, serif' }}>
              {loading ? 'Đang xử lý...' : editingId ? 'Cập nhật' : 'Thêm'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setName(''); setPrice(''); setCategoryId(''); setDescription(''); setImageFile(null); setImageUrl(''); }}
                style={{ padding: '16px 24px', borderRadius: '12px', background: '#ddd', color: '#666', fontSize: '1rem', fontWeight: '700', border: 'none', cursor: 'pointer', fontFamily: '"Times New Roman", Times, serif' }}>
                ✕ Hủy
              </button>
            )}
          </div>

          {message && (
            <div style={{ marginTop: '16px', padding: '14px', borderRadius: '12px', background: message.includes('thành công') ? '#e85d0415' : '#e85d0415', color: message.includes('thành công') ? '#e85d04' : '#e85d04', border: message.includes('thành công') ? '2px solid #e85d0430' : '2px solid #e85d0430', fontSize: '0.95rem', fontWeight: '600', fontFamily: '"Times New Roman", Times, serif' }}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Danh sách Món Ăn */}
      <h2 style={{ color: '#e85d04', fontSize: '1.8rem', marginBottom: '24px', fontFamily: '"Times New Roman", Times, serif' }}>Danh sách Món Ăn ({menuItems.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {menuItems.map(item => (
          <div key={item.id} style={{ background: '#fff', border: '2px solid #e85d0420', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(232, 93, 4, 0.08)', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(232, 93, 4, 0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(232, 93, 4, 0.08)'; }}>
            
            {/* Ảnh */}
            <div style={{ position: 'relative', width: '100%', height: '180px', background: '#f5f5f5', overflow: 'hidden' }}>
              {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#e85d04', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', fontFamily: '"Times New Roman", Times, serif' }}>
                {getCategoryName(item.categoryId)}
              </div>
            </div>

            {/* Nội dung */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 8px', color: '#0f0e2e', fontSize: '1.1rem', fontWeight: '700', fontFamily: '"Times New Roman", Times, serif' }}>{item.name}</h3>
              {item.description && <p style={{ margin: '0 0 12px', color: '#666', fontSize: '0.9rem', fontFamily: '"Times New Roman", Times, serif' }}>{item.description}</p>}
              <p style={{ margin: 0, color: '#e85d04', fontSize: '1.3rem', fontWeight: '700', fontFamily: '"Times New Roman", Times, serif' }}>{item.price.toLocaleString('vi-VN')} đ</p>

              {/* Nút hành động */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button onClick={() => handleEdit(item)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', background: '#e85d04', color: '#fff', fontSize: '0.9rem', fontWeight: '700', border: 'none', cursor: 'pointer', fontFamily: '"Times New Roman", Times, serif' }}>
                  Sửa
                </button>
                <button onClick={() => handleDelete(item.id)} disabled={loading}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', background: '#9ca3af', color: '#fff', fontSize: '0.9rem', fontWeight: '700', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1, fontFamily: '"Times New Roman", Times, serif' }}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999', fontFamily: '"Times New Roman", Times, serif' }}>
          <p style={{ fontSize: '1.2rem', fontFamily: '"Times New Roman", Times, serif' }}>Chưa có món ăn nào. Hãy thêm một số món.</p>
        </div>
      )}
    </div>
  );
}