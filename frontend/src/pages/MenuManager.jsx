import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addForm, setAddForm] = useState({
    name: '', price: '', categoryId: '', description: '', image: ''
  });
  const [editForm, setEditForm] = useState({
    name: '', price: '', categoryId: '', description: '', image: ''
  });
  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  // Light theme only
  const cardBg = 'linear-gradient(135deg, #ffffff 0%, #f1f5ff 100%)';
  const cardBorder = '#cbd5e1';
  const cardShadow = '0 8px 32px rgba(15,23,42,0.1)';
  const inputBg = '#f8fafc';
  const inputColor = '#0f172a';
  const inputBorder = '1px solid #cbd5e1';
  const textMain = '#0f172a';
  const textSub = '#334155';
  const textMuted = '#64748b';
  const tableHeaderBg = 'rgba(59, 130, 246, 0.07)';
  const tableRowAlt = 'rgba(139, 92, 246, 0.03)';
  const modalBackdrop = 'rgba(15,23,42,0.5)';
  const modalBorder = '#7c3aed';
  const closeBtnBg = '#e2e8f0';
  const closeBtnColor = '#334155';

  useEffect(() => {
    fetchData();
  }, []);

  // Khóa scroll khi modal mở
  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showEditModal]);

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

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isEdit) setUploadingEditImage(true);
    else setUploadingImage(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (isEdit) setEditForm(prev => ({ ...prev, image: res.data.url }));
      else setAddForm(prev => ({ ...prev, image: res.data.url }));
      alert('Tải ảnh thành công!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Lỗi tải ảnh: ' + (err.response?.data?.error || err.message));
    } finally {
      if (isEdit) setUploadingEditImage(false);
      else setUploadingImage(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/menu', addForm);
      alert('Thêm thành công!');
      setAddForm({ name: '', price: '', categoryId: '', description: '', image: '' });
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/admin/menu/${editId}`, editForm);
      alert('Cập nhật thành công!');
      closeEditModal();
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.error || err.message));
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
    setEditForm({
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      description: item.description,
      image: item.image
    });
    setEditId(item.id);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditId(null);
    setEditForm({ name: '', price: '', categoryId: '', description: '', image: '' });
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: inputBorder,
    background: inputBg,
    color: inputColor,
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'grid', gap: '40px' }}>

      {/* ─── Modal Sửa Món ─── */}
      {showEditModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeEditModal(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: modalBackdrop,
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
          <div style={{
            background: cardBg,
            borderRadius: '24px',
            padding: '40px',
            color: textSub,
            border: `2px solid ${modalBorder}`,
            boxShadow: '0 25px 80px rgba(139,92,246,0.3)',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'slideUp 0.25s ease'
          }}>
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ margin: 0, color: textMain, fontSize: '1.6rem', fontWeight: '800' }}>
                ✏️ Cập nhật Món
              </h2>
              <button
                onClick={closeEditModal}
                style={{
                  background: closeBtnBg, border: 'none', color: closeBtnColor,
                  width: '36px', height: '36px', borderRadius: '50%',
                  cursor: 'pointer', fontSize: '1.1rem', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#ef4444'}
                onMouseLeave={e => e.target.style.background = closeBtnBg}
              >✕</button>
            </div>

            {/* Form Sửa */}
            <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: textSub, fontSize: '0.85rem' }}>Tên món *</label>
                <input
                  type="text"
                  placeholder="Tên món"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: textSub, fontSize: '0.85rem' }}>Giá (đ) *</label>
                  <input
                    type="number"
                    placeholder="Giá"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: textSub, fontSize: '0.85rem' }}>Danh mục *</label>
                  <select
                    value={editForm.categoryId}
                    onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                    required
                    style={{ ...inputStyle }}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: textSub, fontSize: '0.85rem' }}>Mô tả</label>
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: textSub, fontSize: '0.85rem' }}>Ảnh Món</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    disabled={uploadingEditImage}
                    style={{ ...inputStyle, padding: '8px' }}
                  />
                  {uploadingEditImage && <span style={{ color: textMuted, whiteSpace: 'nowrap' }}>Đang tải...</span>}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: textSub, fontSize: '0.85rem' }}>Hoặc URL ảnh</label>
                <input
                  type="url"
                  placeholder="http://..."
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {editForm.image && (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={editForm.image}
                    alt="preview"
                    style={{ maxWidth: '160px', maxHeight: '160px', borderRadius: '10px', border: '2px solid #8b5cf6', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={uploadingEditImage}
                  style={{
                    flex: 1, padding: '14px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                    color: 'white', border: 'none', borderRadius: '10px',
                    cursor: uploadingEditImage ? 'not-allowed' : 'pointer',
                    fontWeight: '700', fontSize: '1rem',
                    transition: 'opacity 0.2s'
                  }}
                >
                  💾 Lưu thay đổi
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  style={{
                    padding: '14px 20px',
                    background: closeBtnBg, color: closeBtnColor,
                    border: 'none', borderRadius: '10px',
                    cursor: 'pointer', fontWeight: '600', fontSize: '1rem'
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Form Thêm Món Mới ─── */}
      <section style={{ background: cardBg, borderRadius: '24px', padding: '40px', color: textSub, border: `2px solid ${cardBorder}`, boxShadow: cardShadow }}>
        <h2 style={{ margin: 0, marginBottom: '24px', color: textMain, fontSize: '1.8rem', fontWeight: '800' }}>Thêm Món Mới</h2>
        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <input
            type="text"
            placeholder="Tên món"
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            required
            style={{ padding: '12px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }}
          />
          <input
            type="number"
            placeholder="Giá"
            value={addForm.price}
            onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
            required
            style={{ padding: '12px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }}
          />
          <select
            value={addForm.categoryId}
            onChange={(e) => setAddForm({ ...addForm, categoryId: e.target.value })}
            required
            style={{ padding: '12px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }}
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Mô tả"
            value={addForm.description}
            onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }}
          />

          {/* Image Upload */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: textSub }}>Ảnh Món:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  disabled={uploadingImage}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor }}
                />
                {uploadingImage && <span style={{ color: textMuted }}>Đang tải...</span>}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: textSub }}>Hoặc URL:</label>
              <input
                type="url"
                placeholder="http://..."
                value={addForm.image}
                onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                style={{ padding: '8px', borderRadius: '8px', border: inputBorder, background: inputBg, color: inputColor, width: '100%' }}
              />
            </div>
          </div>

          {addForm.image && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              <img src={addForm.image} alt="preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: `2px solid ${cardBorder}` }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
            <button
              type="submit"
              disabled={uploadingImage}
              style={{
                padding: '12px 24px',
                background: '#8b5cf6',
                color: 'white', border: 'none', borderRadius: '8px',
                cursor: uploadingImage ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              Thêm Món
            </button>
          </div>
        </form>
      </section>

      {/* ─── Danh sách Món ─── */}
      <section style={{ background: cardBg, borderRadius: '24px', padding: '40px', color: textSub, border: `2px solid ${cardBorder}`, boxShadow: cardShadow }}>
        <h2 style={{ margin: 0, marginBottom: '24px', color: textMain, fontSize: '1.8rem', fontWeight: '800' }}>Danh sách Món ({menuItems.length})</h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: textMuted }}>Đang tải...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${cardBorder}`, backgroundColor: tableHeaderBg }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: textMain, fontWeight: '600' }}>Tên Món</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: textMain, fontWeight: '600' }}>Danh Mục</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: textMain, fontWeight: '600' }}>Giá</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: textMain, fontWeight: '600' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${cardBorder}`, backgroundColor: idx % 2 === 0 ? tableRowAlt : 'transparent' }}>
                    <td style={{ padding: '12px', color: textSub }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: `1px solid ${cardBorder}` }} />
                        <span style={{ color: textMain, fontWeight: '500' }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: textSub }}>{item.category?.name}</td>
                    <td style={{ padding: '12px', color: textSub, fontWeight: '500' }}>{item.price.toLocaleString()} đ</td>
                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                          color: '#000', border: 'none', borderRadius: '4px',
                          cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem'
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#ef4444',
                          color: 'white', border: 'none', borderRadius: '4px',
                          cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem'
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
