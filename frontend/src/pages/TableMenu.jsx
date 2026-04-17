import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const sectionStyles = {
  page: {
    height: '100vh',
    overflow: 'hidden',
    padding: '28px 16px 28px',
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#0f0e2e',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f5f5'
  },
  pageContainer: {
    display: 'grid',
    gridTemplateColumns: '6fr 4fr',
    gap: '32px',
    maxWidth: '1600px',
    margin: '0 auto',
    width: '100%',
    flex: 1,
    overflow: 'hidden'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
    paddingRight: '6px',
    paddingBottom: '24px'
  },
  header: {
    animation: 'fadeIn 0.6s ease-out',
    flexShrink: 0
  },
  title: {
    margin: 0,
    fontSize: 'clamp(2rem, 6vw, 2.8rem)',
    lineHeight: 1.05,
    fontWeight: 800,
    color: '#0f0e2e'
  },
  subtitle: {
    margin: '12px 0 0',
    color: '#666',
    maxWidth: '720px',
    fontSize: '1rem',
    lineHeight: 1.6,
    fontWeight: 500
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '999px',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
    border: '1px solid rgba(96, 165, 250, 0.3)',
    color: '#60a5fa',
    fontWeight: 700,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '4px',
    scrollBehavior: 'smooth',
    flexShrink: 0
  },
  tab: {
    flex: '0 0 auto',
    borderRadius: '999px',
    border: '1.5px solid rgba(148, 163, 184, 0.15)',
    background: 'rgba(30, 41, 59, 0.6)',
    color: '#cbd5e1',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontWeight: 600,
    fontSize: '0.95rem',
    backdropFilter: 'blur(8px)'
  },
  tabActive: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    color: '#fff',
    borderColor: 'transparent',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid rgba(148, 163, 184, 0.1)'
  },
  cardList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px'
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  cardHover: {
    transform: 'translateY(-4px)',
    borderColor: '#2563eb',
    boxShadow: '0 8px 16px rgba(37, 99, 235, 0.15)'
  },
  image: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    backgroundColor: '#f5f5f5',
    transition: 'all 0.2s'
  },
  cardBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  itemTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 800,
    color: '#000'
  },
  itemDescription: {
    margin: '8px 0 0',
    color: '#333',
    fontSize: '0.85rem',
    lineHeight: 1.5,
    flex: 1,
    fontWeight: 500
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    zIndex: 10
  },
  outOfStockBadge: {
    background: '#dc2626',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '999px',
    fontSize: '0.9rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
  },
  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginTop: '12px'
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#2563eb'
  },
  addButton: {
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    color: '#fff',
    padding: '8px 12px',
    fontWeight: 700,
    cursor: 'pointer',
    minWidth: '40px',
    minHeight: '40px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
    fontSize: '1.1rem',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  addButtonHover: {
    transform: 'scale(1.1)',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
  },
  addButtonDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed'
  },
  stickyFooter: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden'
  },
  footerCard: {
    borderRadius: '12px',
    background: '#fff',
    border: '1px solid #e5e5e5',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    height: '100%'
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap'
  },
  footerLabel: {
    color: '#999',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  footerTotal: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#2563eb'
  },
  checkoutButton: {
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    color: '#fff',
    padding: '18px 24px',
    fontWeight: 800,
    cursor: 'pointer',
    width: '100%',
    fontSize: '1.05rem',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
  },
  checkoutButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)'
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  toast: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: '140px',
    zIndex: 60,
    borderRadius: '8px',
    padding: '14px 24px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    fontWeight: 700,
    textAlign: 'center',
    minWidth: '280px',
    maxWidth: '90%',
    fontSize: '0.95rem',
    animation: 'slideInUp 0.3s ease-out',
    background: '#2563eb',
    color: '#fff'
  },
  searchBox: {
    width: '100%',
    padding: '14px 18px',
    background: '#fff',
    border: '1.5px solid #e5e5e5',
    borderRadius: '8px',
    color: '#0f0e2e',
    fontSize: '1rem',
    marginBottom: '28px',
    transition: 'all 0.2s',
    fontWeight: 500
  }
};

const placeholderImage = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80';

function formatCurrency(value) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function calculateCartTotal(cartItems) {
  return cartItems.reduce((sum, entry) => sum + entry.menuItem.price * entry.quantity, 0);
}

export default function TableMenu() {
  // Light theme only
  const pageBg = '#f5f5f5';
  const textMain = '#0a0a0a';
  const textMuted = '#222';
  const cardBg = '#fff';
  const cardBorderColor = '#e5e5e5';
  const footerBg = '#fff';
  const footerGradient = 'linear-gradient(to top, rgba(245,245,245,0.98), rgba(245,245,245,0.7), transparent)';
  const searchBg = '#fff';
  const searchBorderColor = '#e5e5e5';
  const tabBg = '#f0f4ff';

  const navigate = useNavigate();
  const { tableId: tableIdParam } = useParams();
  const tableId = parseInt(tableIdParam, 10);

  // Debug log
  console.log('TableID từ URL:', tableIdParam, '→ Parsed:', tableId);

  const [tableName, setTableName] = useState('Bàn');
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  useEffect(() => {
    // Hàm fetch âm thầm (không bật loading spinner, không cuộn lên đầu)
    async function refreshMenu() {
      try {
        const response = await axios.get(`http://localhost:3000/api/table/${tableId}/menu`);
        const menuCategories = response.data.categories || [];
        const table = response.data.table;
        if (table && table.name) setTableName(table.name);
        setCategories(menuCategories);
        setActiveCategoryId((prev) => prev || 'all');
      } catch (err) {
        console.error(err);
      }
    }

    // Chỉ hiện loading spinner lần đầu mở trang
    async function fetchMenuFirstLoad() {
      try {
        setLoading(true);
        await refreshMenu();
      } finally {
        setLoading(false);
      }
    }

    fetchMenuFirstLoad();

    // Polling mỗi 5 giây để cập nhật trạng thái hàng — KHÔNG set loading
    const pollInterval = setInterval(refreshMenu, 5000);
    return () => clearInterval(pollInterval);
  }, [tableId]);

  useEffect(() => {
    if (!message && !error) return;
    const timer = setTimeout(() => {
      setMessage('');
      setError('');
    }, 3800);
    return () => clearTimeout(timer);
  }, [message, error]);

  const handleAddToCart = (menuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((entry) => entry.menuItem.id === menuItem.id);
      if (existing) {
        return prevCart.map((entry) =>
          entry.menuItem.id === menuItem.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [...prevCart, { menuItem, quantity: 1 }];
    });
  };

  const handleQuantityChange = (menuItemId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((entry) =>
          entry.menuItem.id === menuItemId
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      setError('Giỏ hàng đang trống. Vui lòng chọn món.');
      return;
    }

    const payload = {
      tableId: tableId,
      items: cart.map((entry) => ({ menuItemId: entry.menuItem.id, quantity: entry.quantity }))
    };

    console.log('Gửi order:', payload);

    try {
      await axios.post('http://localhost:3000/api/order', payload);
      setMessage('Đặt món thành công!');
      setCart([]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Đặt món thất bại. Vui lòng thử lại.');
    }
  };

  const cartItemCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const cartTotal = useMemo(() => calculateCartTotal(cart), [cart]);
  const isAllTab = activeCategoryId === 'all';
  const allItems = useMemo(() => categories.flatMap((cat) => cat.items || []), [categories]);
  const activeCategory = isAllTab
    ? { name: 'Tất cả các món', items: allItems }
    : (categories.find((category) => category.id === activeCategoryId) || categories[0] || {});

  return (
    <main style={{ ...sectionStyles.page, background: pageBg, color: textMain }}>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '80px' }}>Đang tải thực đơn...</div>
      ) : (
        <div style={sectionStyles.pageContainer}>
          <section style={sectionStyles.mainContent}>
            <header style={sectionStyles.header}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => navigate(-1)}
                  style={{
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                    color: '#fff',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    transition: 'var(--transition)',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                  title="Quay lại"
                  onMouseEnter={(e) => Object.assign(e.target.style, { transform: 'scale(1.05)', boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)' })}
                  onMouseLeave={(e) => Object.assign(e.target.style, { transform: 'scale(1)', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' })}
                >
                  Quay lại
                </button>
              </div>
            </header>

      <section style={sectionStyles.tabs}>
        {/* Tab Tất cả - luôn ở đầu tiên */}
        <button
          key="all"
          type="button"
          onClick={() => setActiveCategoryId('all')}
          style={{
            ...sectionStyles.tab,
            background: activeCategoryId === 'all'
              ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
              : tabBg,
            color: activeCategoryId === 'all' ? '#fff' : textMuted,
            ...(activeCategoryId === 'all' ? sectionStyles.tabActive : {})
          }}
        >
          Tất cả
        </button>

        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              style={{
                ...sectionStyles.tab,
                background: isActive
                  ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                  : tabBg,
                color: isActive ? '#fff' : textMuted,
                ...(isActive ? sectionStyles.tabActive : {})
              }}
            >
              {category.name}
            </button>
          );
        })}
      </section>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...sectionStyles.searchBox, background: searchBg, borderColor: searchBorderColor, color: textMain, maxWidth: '500px' }}
          onFocus={(e) => Object.assign(e.target.style, { borderColor: 'rgba(59, 130, 246, 0.4)', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' })}
          onBlur={(e) => Object.assign(e.target.style, { borderColor: searchBorderColor, boxShadow: 'none' })}
        />
      </div>

            {activeCategory ? (
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ margin: '0 0 8px', color: '#000', fontSize: '1.25rem', fontWeight: 800 }}>{activeCategory.name}</h2>
                    <p style={{ margin: 0, color: '#333', fontWeight: 600 }}>{(activeCategory.items?.length || 0)} món ăn</p>
                  </div>
                  <div style={sectionStyles.badge}>{(activeCategory.items || []).filter((item) => item.isAvailable).length} còn hàng</div>
                </div>

                {/* Filtered/Searched Items */}
                {(() => {
                  const filteredItems = (activeCategory.items || []).filter(item => {
                    const matchSearch = searchTerm === '' ||
                      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
                    const matchPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
                    return matchSearch && matchPrice;
                  });

                  return (
                    <>
                      {filteredItems.length > 0 ? (
                        <div style={sectionStyles.cardList}>
                          {filteredItems.map((item) => (
                            <article
                              key={item.id}
                              style={{
                                ...sectionStyles.card,
                                background: cardBg,
                                border: `1.5px solid ${cardBorderColor}`,
                                position: 'relative',
                                opacity: !item.isAvailable ? 0.6 : 1
                              }}
                              onMouseEnter={(e) => item.isAvailable && Object.assign(e.currentTarget.style, sectionStyles.cardHover)}
                              onMouseLeave={(e) => item.isAvailable && Object.assign(e.currentTarget.style, { transform: 'translateY(0)', borderColor: 'rgba(148, 163, 184, 0.12)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)' })}
                            >
                              <img
                                src={item.image || placeholderImage}
                                alt={item.name}
                                style={{ ...sectionStyles.image, filter: !item.isAvailable ? 'grayscale(100%)' : 'none' }}
                              />

                              {/* Badge "Đã hết" */}
                              {!item.isAvailable && (
                                <div style={sectionStyles.outOfStockOverlay}>
                                  <div style={sectionStyles.outOfStockBadge}>Đã hết món</div>
                                </div>
                              )}

                              <div style={sectionStyles.cardBody}>
                                <div>
                                  <h2 style={{ ...sectionStyles.itemTitle, color: textMain }}>{item.name}</h2>
                                  <p style={{ ...sectionStyles.itemDescription, color: textMuted }}>{item.description || 'Món đặc sắc được chế biến tươi ngon và hấp dẫn.'}</p>
                                </div>
                                <div style={sectionStyles.itemFooter}>
                                  <div style={sectionStyles.price}>{formatCurrency(item.price)}</div>
                                  <button
                                    type="button"
                                    onClick={() => handleAddToCart(item)}
                                    disabled={!item.isAvailable}
                                    style={{
                                      ...sectionStyles.addButton,
                                      ...(item.isAvailable ? {} : sectionStyles.addButtonDisabled)
                                    }}
                                    onMouseEnter={(e) => item.isAvailable && Object.assign(e.currentTarget.style, sectionStyles.addButtonHover)}
                                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'scale(1)', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' })}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                          Không tìm thấy món nào phù hợp
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>Không tìm thấy danh mục.</div>
            )}
          </section>

          {/* Sidebar giỏ hàng */}
          <div style={sectionStyles.stickyFooter}>
            <div style={{ ...sectionStyles.footerCard, background: footerBg, border: `1.5px solid ${cardBorderColor}` }}>
              {/* Tiêu đề Bàn bên phải */}
              <div style={{ paddingBottom: '12px', borderBottom: `1px solid ${cardBorderColor}`, marginBottom: '8px' }}>
                <p style={{ margin: 0, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.75rem' }}>
                  Gọi món nhanh
                </p>
                <h1 style={{ ...sectionStyles.title, fontSize: '1.6rem', marginBottom: '4px' }}>{tableName}</h1>
                <p style={{ ...sectionStyles.subtitle, fontSize: '0.8rem', color: textMuted, marginTop: '4px' }}>
                  Thưởng thức tinh hoa ẩm thực được sắp xếp tinh tế. Bấm (+) để thêm món.
                </p>
              </div>

              {/* Giỏ hàng chi tiết */}
              {cart.length > 0 && (
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${cardBorderColor}` }}>
                  {cart.map((entry) => (
                    <div
                      key={entry.menuItem.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        gap: '12px'
                      }}
                    >
                      <img
                        src={entry.menuItem.image || placeholderImage}
                        alt={entry.menuItem.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, border: '1px solid rgba(148, 163, 184, 0.2)' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.menuItem.name}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8' }}>
                          {formatCurrency(entry.menuItem.price)}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => handleQuantityChange(entry.menuItem.id, -1)}
                          style={{
                            border: 'none',
                            background: '#ef4444',
                            color: '#fff',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition)',
                            padding: 0
                          }}
                          onMouseEnter={(e) => Object.assign(e.target.style, { transform: 'scale(1.1)', background: '#dc2626' })}
                          onMouseLeave={(e) => Object.assign(e.target.style, { transform: 'scale(1)', background: '#ef4444' })}
                        >
                          −
                        </button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                          {entry.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(entry.menuItem.id, 1)}
                          style={{
                            border: 'none',
                            background: '#3b82f6',
                            color: '#fff',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition)',
                            padding: 0
                          }}
                          onMouseEnter={(e) => Object.assign(e.target.style, { transform: 'scale(1.1)', background: '#2563eb' })}
                          onMouseLeave={(e) => Object.assign(e.target.style, { transform: 'scale(1)', background: '#3b82f6' })}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Thông tin tổng cộng */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px', paddingBottom: '12px', borderBottom: `1px solid ${cardBorderColor}`, textAlign: 'right' }}>
                <div>
                  <p style={{ ...sectionStyles.footerLabel, fontSize: '0.7rem' }}>Tổng số món</p>
                  <p style={{ ...sectionStyles.footerTotal, fontSize: '1.1rem' }}>{cartItemCount}</p>
                </div>
                <div>
                  <p style={{ ...sectionStyles.footerLabel, fontSize: '0.7rem' }}>Tổng giá</p>
                  <p style={{ ...sectionStyles.footerTotal, fontSize: '1.1rem' }}>{formatCurrency(cartTotal)}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOrder}
                disabled={cart.length === 0}
                style={{
                  ...sectionStyles.checkoutButton,
                  ...(cart.length === 0 && sectionStyles.checkoutButtonDisabled)
                }}
                onMouseEnter={(e) => cart.length > 0 && Object.assign(e.currentTarget.style, sectionStyles.checkoutButtonHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)' })}
              >
                Đặt món ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {(message || error) && (
        <div style={{
          ...sectionStyles.toast,
          background: message ? 'rgba(34, 197, 94, 0.96)' : 'rgba(248, 113, 113, 0.96)'
        }}>
          {message || error}
        </div>
      )}
    </main>
  );
}
