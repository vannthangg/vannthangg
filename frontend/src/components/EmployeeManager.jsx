import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmployeeManager() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Kitchen');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [employees, setEmployees] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Edit state
  const [editEmp, setEditEmp] = useState(null); // null = không đang sửa
  const [editForm, setEditForm] = useState({ username: '', name: '', role: 'Kitchen', password: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoadingList(true);
      const response = await axios.get('http://localhost:3000/api/admin/users');
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách nhân viên:', error);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setMessageType('');

    if (!username || !password || !name || !role) {
      setMessage('Vui lòng điền đầy đủ thông tin.');
      setMessageType('error');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('http://localhost:3000/api/admin/users', { username, password, name, role });
      setMessage('Tạo tài khoản nhân viên thành công!');
      setMessageType('success');
      setUsername(''); setPassword(''); setName(''); setRole('Kitchen');
      await loadEmployees();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorText = error?.response?.data?.error || 'Không thể tạo tài khoản.';
      setMessage(errorText);
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (empId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa?')) return;
    try {
      setDeleteLoading(empId);
      await axios.delete(`http://localhost:3000/api/admin/users/${empId}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== empId));
      setMessage('Xóa nhân viên thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Không thể xóa nhân viên');
      setMessageType('error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditOpen = (emp) => {
    setEditEmp(emp);
    setEditForm({ username: emp.username, name: emp.name, role: emp.role, password: '' });
  };

  const handleEditClose = () => {
    setEditEmp(null);
    setEditForm({ username: '', name: '', role: 'Kitchen', password: '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.username || !editForm.name || !editForm.role) {
      setMessage('Vui lòng điền đầy đủ thông tin.');
      setMessageType('error');
      return;
    }
    try {
      setEditSubmitting(true);
      const payload = { username: editForm.username, name: editForm.name, role: editForm.role };
      if (editForm.password) payload.password = editForm.password;
      const res = await axios.put(`http://localhost:3000/api/admin/users/${editEmp.id}`, payload);
      setEmployees((prev) => prev.map((emp) => emp.id === editEmp.id ? res.data : emp));
      setMessage('Cập nhật nhân viên thành công!');
      setMessageType('success');
      handleEditClose();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Không thể cập nhật nhân viên.');
      setMessageType('error');
    } finally {
      setEditSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#fff',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: '0.95rem'
  };

  return (
    <div style={{ display: 'grid', gap: '40px' }}>
      {/* MODAL SỬA NHÂN VIÊN */}
      {editEmp && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid #8b5cf6',
            borderRadius: '24px', padding: '40px',
            width: '100%', maxWidth: '480px',
            boxShadow: '0 30px 80px rgba(139,92,246,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '1.6rem', fontWeight: '800' }}>
                Sửa Nhân Viên
              </h2>
              <button
                onClick={handleEditClose}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(139,92,246,0.1)', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.3)' }}>
              <p style={{ margin: 0, color: '#c4b5fd', fontSize: '0.9rem' }}>
                Đang sửa: <strong style={{ color: '#e0e7ff' }}>#{editEmp.id} – {editEmp.username}</strong>
              </p>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Họ và tên</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vai trò</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Kitchen">Bếp</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Nhân viên</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Mật khẩu mới <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(để trống nếu không đổi)</span>
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Nhập mật khẩu mới..."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  style={{
                    flex: 1, padding: '13px 20px',
                    background: editSubmitting ? '#4b5563' : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                    color: '#fff', border: 'none', borderRadius: '10px',
                    cursor: editSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: '700', fontSize: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {editSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  type="button"
                  onClick={handleEditClose}
                  style={{
                    flex: 1, padding: '13px 20px',
                    background: 'rgba(100,116,139,0.2)',
                    border: '1px solid #334155',
                    color: '#cbd5e1', borderRadius: '10px',
                    cursor: 'pointer', fontWeight: '600', fontSize: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THÔNG BÁO */}
      {message && (
        <div style={{
          padding: '14px 16px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '600',
          background: messageType === 'success' ? '#10b98140' : '#ef444440',
          border: messageType === 'success' ? '2px solid #10b981' : '2px solid #ef4444',
          color: messageType === 'success' ? '#10b981' : '#ef4444'
        }}>
          {message}
        </div>
      )}

      {/* FORM TẠO NHÂN VIÊN */}
      <section style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '40px', color: '#e2e8f0', border: '2px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <h2 style={{ margin: 0, marginBottom: '24px', color: '#fff', fontSize: '1.8rem', fontWeight: '800' }}>Tạo Nhân Viên</h2>
        <form style={{ display: 'grid', gap: '16px' }} onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ và tên"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
          >
            <option value="Kitchen">Bếp</option>
            <option value="admin">Admin</option>
            <option value="staff">Nhân viên</option>
          </select>
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: '12px 24px', background: submitting ? '#6b7280' : '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: '600', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Đang tạo...' : 'Tạo Nhân Viên'}
          </button>
        </form>
      </section>

      {/* DANH SÁCH NHÂN VIÊN */}
      <section style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '40px', color: '#e2e8f0', border: '2px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem', fontWeight: '800' }}>Danh Sách ({employees.length})</h2>
          <button onClick={loadEmployees} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Làm mới</button>
        </div>

        {loadingList ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Đang tải...</p>
        ) : employees.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Chưa có nhân viên</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #334155', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#e0e7ff', fontWeight: '600' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#e0e7ff', fontWeight: '600' }}>Username</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#e0e7ff', fontWeight: '600' }}>Họ Tên</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#e0e7ff', fontWeight: '600' }}>Vai Trò</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#e0e7ff', fontWeight: '600' }}>Ngày Tạo</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#e0e7ff', fontWeight: '600' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #334155', backgroundColor: idx % 2 === 0 ? 'rgba(139, 92, 246, 0.05)' : 'transparent' }}>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>#{emp.id}</td>
                    <td style={{ padding: '12px', color: '#e0e7ff', fontWeight: '500' }}>{emp.username}</td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>{emp.name}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: emp.role === 'Kitchen' ? '#c2410c40' : emp.role === 'admin' ? '#8b5cf640' : '#0369a140',
                        color: emp.role === 'Kitchen' ? '#ea580c' : emp.role === 'admin' ? '#c4b5fd' : '#06b6d4',
                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600'
                      }}>
                        {emp.role === 'Kitchen' ? 'Bếp' : emp.role === 'admin' ? 'Admin' : 'Nhân viên'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>{formatDate(emp.createdAt)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEditOpen(emp)}
                          style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                            color: '#000', border: 'none', padding: '6px 12px',
                            borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem'
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          disabled={deleteLoading === emp.id}
                          style={{
                            background: '#ef4444', color: '#fff', border: 'none',
                            padding: '6px 12px', borderRadius: '4px',
                            cursor: deleteLoading === emp.id ? 'not-allowed' : 'pointer',
                            fontWeight: '600', fontSize: '0.8rem', opacity: deleteLoading === emp.id ? 0.7 : 1
                          }}
                        >
                          {deleteLoading === emp.id ? 'Đang xóa...' : 'Xóa'}
                        </button>
                      </div>
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
