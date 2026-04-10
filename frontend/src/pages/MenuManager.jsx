import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', price: '', categoryId: '', description: '', image: ''
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get('http://localhost:3000/api/admin/menu'),
        axios.get('http://localhost:3000/api/admin/categories')
      ]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({ ...form, image: res.data.url });
      alert('Tải ảnh thành công!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Lỗi tải ảnh: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/admin/menu/${editId}`, form);
        alert('Cập nhật thành công!');
      } else {
        await axios.post('http://localhost:3000/api/admin/menu', form);
        alert('Thêm thành công!');
      }
      setForm({ name: '', price: '', categoryId: '', description: '', image: '' });
      setEditId(null);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Xác nhận xóa?')) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/menu/${id}`);
        alert('Xóa thành công!');
        fetchData();
      } catch (err) {
        alert('Lỗi: ' + err.message);
      }
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      description: item.description,
      image: item.image
    });
    setEditId(item.id);
  };

  return (
    <div style={{ display: 'grid', gap: '40px' }}>
      {/* Form */}
      <section style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '40px', color: '#e2e8f0', border: '2px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <h2 style={{ margin: 0, marginBottom: '24px', color: '#fff', fontSize: '1.8rem', fontWeight: '800' }}>{editId ? 'Cập nhật Món' : 'Thêm Món Mới'}</h2>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <input
            type="text"
            placeholder="Tên món"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
          />
          <input
            type="number"
            placeholder="Giá"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
             style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
          />
          
          {/* Image Upload */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#cbd5e1' }}>Ảnh Món:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
                {uploadingImage && <span style={{ color: '#94a3b8' }}>Đang tải...</span>}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#cbd5e1' }}>Hoặc URL:</label>
              <input
                type="url"
                placeholder="http://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                style={{ padding: '8px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', width: '100%' }}
              />
            </div>
          </div>
          {/* Preview Ảnh */}
          {form.image && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              <img src={form.image} alt="preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '2px solid #334155' }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
            <button
              type="submit"
              disabled={uploadingImage}
              style={{
                padding: '12px 24px',
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: uploadingImage ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              {editId ? 'Cập nhật Món' : 'Thêm Món'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: '', price: '', categoryId: '', description: '', image: '' });
                }}
                style={{
                  padding: '12px 24px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Danh sách */}
      <section style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '40px', color: '#e2e8f0', border: '2px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <h2 style={{ margin: 0, marginBottom: '24px', color: '#fff', fontSize: '1.8rem', fontWeight: '800' }}>Danh sách Món ({menuItems.length})</h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Đang tải...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #334155', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#e0e7ff', fontWeight: '600' }}>Tên Món</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#e0e7ff', fontWeight: '600' }}>Danh Mục</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#e0e7ff', fontWeight: '600' }}>Giá</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#e0e7ff', fontWeight: '600' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #334155', backgroundColor: idx % 2 === 0 ? 'rgba(139, 92, 246, 0.05)' : 'transparent' }}>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #334155' }} />
                        <span style={{ color: '#e0e7ff', fontWeight: '500' }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>{item.category?.name}</td>
                    <td style={{ padding: '12px', color: '#cbd5e1', fontWeight: '500' }}>{item.price.toLocaleString()} đ</td>
                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                          color: '#000',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.8rem'
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.8rem'
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
