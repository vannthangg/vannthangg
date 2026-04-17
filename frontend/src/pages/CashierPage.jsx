import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { ADMIN_ORDERS_API } from '../config/api';

export default function CashierPage() {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState('waiting');
  const qrRef = useRef();

  useEffect(() => {
    loadOrders();
    loadCompletedOrders();
    
    // Connect to Socket.io
    const socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Listen for order status updates
    socket.on('order-status-update', (updatedOrder) => {
      console.log('🔄 Cập nhật đơn:', updatedOrder);
      if (updatedOrder.status === 'completed') {
        setOrders((prev) => prev.filter((o) => o.id !== updatedOrder.id));
        setCompletedOrders((prev) => [updatedOrder, ...prev]);
      }
    });

    // Polling every 3 seconds as backup
    const interval = setInterval(() => {
      loadOrders();
      loadCompletedOrders();
    }, 3000);

    return () => {
      clearInterval(interval);
      socket.off('order-status-update');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'waiting') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(completedOrders);
    }
  }, [orders, completedOrders, activeTab]);

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/orders/waiting-payment');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadCompletedOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/orders/completed');
      setCompletedOrders(response.data || []);
    } catch (error) {
      console.error('Error loading completed orders:', error);
    }
  };

  const handlePayment = async (orderId, method) => {
    try {
      setLoading(true);
      // Update payment status
      await axios.put(ADMIN_ORDERS_API.UPDATE_PAYMENT(orderId), {
        paymentMethod: method,
        paymentStatus: 'paid'
      });
      // Update order status to completed
      await axios.patch(`http://localhost:3000/api/admin/order/${orderId}/status`, { 
        status: 'completed' 
      });
      loadCompletedOrders();
      setSelectedOrder(null);
      alert(`Thanh toán thành công bằng ${method === 'cash' ? 'tiền mặt' : 'mã QR'}!`);
    } catch (error) {
      alert('Lỗi thanh toán: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const printBill = (order) => {
    const billContent = `
      <html>
        <head>
          <title>Hóa đơn #${order.id}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              max-width: 400px; 
              margin: 0 auto; 
              padding: 20px;
              background: #fff;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px dashed #e85d04; 
              padding-bottom: 12px; 
              margin-bottom: 15px; 
            }
            .order-number { 
              font-size: 20px; 
              font-weight: bold;
              color: #e85d04;
            }
            .order-time { 
              font-size: 12px; 
              color: #666; 
              margin-top: 5px;
            }
            .items { 
              border-bottom: 1px dashed #ccc; 
              margin: 15px 0; 
              padding: 10px 0; 
            }
            .item { 
              display: flex; 
              justify-content: space-between; 
              margin: 8px 0; 
              font-size: 14px; 
            }
            .total-section { 
              margin-top: 15px; 
              margin-bottom: 20px;
            }
            .total { 
              display: flex; 
              justify-content: space-between; 
              font-size: 18px; 
              font-weight: bold; 
              border-top: 2px solid #000; 
              padding-top: 10px; 
            }
            .order-type { 
              text-align: center; 
              margin: 10px 0; 
              font-weight: bold; 
              color: #e85d04;
              font-size: 14px;
            }
            .payment-method {
              text-align: center;
              margin: 10px 0;
              font-size: 12px;
              color: #666;
            }
            .footer { 
              text-align: center; 
              margin-top: 20px; 
              font-size: 12px;
              padding-top: 15px;
              border-top: 1px dashed #ccc;
            }
            .illustration {
              text-align: center;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px dashed #ccc;
            }
            .illustration img {
              max-width: 100%;
              height: auto;
              max-height: 200px;
              border-radius: 8px;
            }
            .thank-you {
              text-align: center;
              font-weight: bold;
              color: #e85d04;
              margin-top: 15px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="order-number">HÓA ĐƠN #${order.id}</div>
            <div class="order-time">${new Date(order.createdAt).toLocaleString('vi-VN')}</div>
            <div style="margin-top: 5px; font-size: 14px;">Bàn: <strong>${order.table.name}</strong></div>
          </div>

          <div class="order-type">
            ${order.orderType === 'dine-in' ? '🍽️ ĂN TẠI QUÁN' : '🛍️ MANG VỀ'}
          </div>

          <div class="items">
            ${order.items.map(item => `
              <div class="item">
                <span>${item.menuItem.name} <strong>x${item.quantity}</strong></span>
                <span><strong>${(item.menuItem.price * item.quantity).toLocaleString('vi-VN')}đ</strong></span>
              </div>
            `).join('')}
          </div>

          <div class="total-section">
            <div class="total">
              <span>TỔNG CỘNG:</span>
              <span>${order.total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          <div class="payment-method">
            <p>Thanh toán: <strong>${order.paymentMethod === 'cash' ? '💵 Tiền mặt' : '📱 Mã QR'}</strong></p>
          </div>

          <div class="illustration">
            <img src="/img/payment-illustration.png" alt="Thank you for your order" />
          </div>

          <div class="thank-you">
            Cảm ơn quý khách!<br/>
            Hẹn gặp lại 🙏
          </div>

          <div class="footer">
            <p style="margin: 0; font-size: 11px; color: #999;">
              Phát hành: ${new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'height=700,width=500');
    printWindow.document.write(billContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <div style={{ padding: '24px', fontFamily: '"Times New Roman", Times, serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 16px 0', color: '#e85d04', fontSize: '2rem' }}>Quầy Thu Ngân</h1>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            onClick={() => setActiveTab('waiting')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: activeTab === 'waiting' ? '#e85d04' : '#f5f5f5',
              color: activeTab === 'waiting' ? '#fff' : '#e85d04',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              fontFamily: '"Times New Roman", Times, serif'
            }}
          >
            Chờ Thanh Toán ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: activeTab === 'completed' ? '#e85d04' : '#f5f5f5',
              color: activeTab === 'completed' ? '#fff' : '#e85d04',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              fontFamily: '"Times New Roman", Times, serif'
            }}
          >
            Hoàn Thành ({completedOrders.length})
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Danh sách Orders */}
        <div style={{ background: '#fff', border: '2px solid #e85d0420', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ color: '#e85d04', margin: '0 0 16px 0', fontSize: '1.3rem' }}>
            Các Đơn Hàng ({filteredOrders.length})
          </h2>
          <div style={{ maxHeight: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredOrders.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '40px 20px' }}>Không có đơn hàng nào</p>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    background: selectedOrder?.id === order.id ? '#e85d0415' : '#f9f9f9',
                    border: selectedOrder?.id === order.id ? '2px solid #e85d04' : '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#0f0e2e' }}>
                        {order.table.name} - Đơn #{order.id}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {order.orderType === 'dine-in' ? '🍽️ Ăn tại quán' : '🛍️ Mang về'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#e85d04', fontSize: '1.1rem' }}>
                      {order.total.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#999' }}>
                    {order.items.length} món • {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chi Tiết Order */}
        <div style={{ background: '#fff', border: '2px solid #e85d0420', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          {selectedOrder ? (
            <>
              <h2 style={{ color: '#e85d04', margin: '0 0 16px 0', fontSize: '1.3rem' }}>
                Đơn #{selectedOrder.id}
              </h2>

              <div style={{ marginBottom: '16px', padding: '12px', background: '#e85d0408', borderRadius: '8px', border: '1px solid #e85d0420' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Bàn:</span>
                  <span style={{ fontWeight: 'bold' }}>{selectedOrder.table.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Loại:</span>
                  <span style={{ fontWeight: 'bold', color: '#e85d04' }}>
                    {selectedOrder.orderType === 'dine-in' ? '🍽️ Ăn tại quán' : '🛍️ Mang về'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Giờ đặt:</span>
                  <span>{new Date(selectedOrder.createdAt).toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>

              <h3 style={{ color: '#0f0e2e', fontSize: '1rem', margin: '12px 0 8px 0' }}>Các Món Ăn:</h3>
              <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '12px' }}>
                {selectedOrder.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.95rem' }}>
                    <span>{item.menuItem.name} x{item.quantity}</span>
                    <span style={{ fontWeight: 'bold' }}>{(item.menuItem.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#e85d0408', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '2px solid #e85d04' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#e85d04' }}>
                  <span>TỔNG:</span>
                  <span>{selectedOrder.total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  onClick={() => printBill(selectedOrder)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#e85d04',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontFamily: '"Times New Roman", Times, serif'
                  }}
                >
                  📄 In Bill
                </button>
                {activeTab === 'waiting' && (
                  <button
                    onClick={() => setShowQRModal(true)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#666',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: '"Times New Roman", Times, serif'
                    }}
                  >
                    📱 QR Code
                  </button>
                )}
              </div>

              <>
                {activeTab === 'waiting' ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handlePayment(selectedOrder.id, 'cash')}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontFamily: '"Times New Roman", Times, serif',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      💵 Tiền Mặt
                    </button>
                    <button
                      onClick={() => handlePayment(selectedOrder.id, 'qr_code')}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#8b5cf6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontFamily: '"Times New Roman", Times, serif',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    🔷 Mã QR
                  </button>
                </div>
                ) : (
                  <div style={{ padding: '16px', background: '#10b98115', border: '2px solid #10b981', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
                    <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.1rem' }}>Đã Hoàn Thành</div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>
                      Thanh toán: <strong>{selectedOrder.paymentMethod === 'cash' ? '💵 Tiền mặt' : '📱 Mã QR'}</strong>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                      {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                )}
              </>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
              <p>Chọn một đơn hàng để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Payment Modal */}
      {showQRModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #fff 0%, #f9f5f0 100%)',
            borderRadius: '24px',
            padding: '48px 40px',
            maxWidth: '500px',
            textAlign: 'center',
            border: '3px solid #e85d04',
            boxShadow: '0 20px 60px rgba(232, 93, 4, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative background elements */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'rgba(232, 93, 4, 0.08)',
              borderRadius: '50%',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '100px',
              height: '100px',
              background: 'rgba(245, 168, 104, 0.08)',
              borderRadius: '50%',
              zIndex: 0
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💳</div>
              <h2 style={{ 
                color: '#e85d04', 
                margin: '0 0 8px 0', 
                fontSize: '2rem',
                fontWeight: 900,
                fontFamily: '"Times New Roman", Times, serif'
              }}>
                Mã QR Thanh Toán
              </h2>
              <div style={{ height: '3px', width: '60px', background: 'linear-gradient(90deg, #e85d04, #f5a868)', margin: '12px auto 24px', borderRadius: '999px' }} />
              
              <div style={{ 
                background: 'rgba(232, 93, 4, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(232, 93, 4, 0.2)'
              }}>
                <p style={{ color: '#666', margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 500 }}>
                  🍽️ <strong>{selectedOrder.table.name}</strong>
                </p>
                <p style={{ 
                  margin: 0,
                  fontSize: '2.2rem', 
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #e85d04, #f5a868)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {selectedOrder.total.toLocaleString('vi-VN')}₫
                </p>
              </div>
              
              <div style={{ 
                background: '#fff',
                padding: '24px', 
                borderRadius: '16px',
                marginBottom: '24px',
                display: 'flex', 
                justifyContent: 'center',
                border: '3px solid #e85d04',
                boxShadow: '0 8px 24px rgba(232, 93, 4, 0.15)'
              }}>
                <QRCode
                  value={`https://qr.example.com/pay/${selectedOrder.id}/${selectedOrder.total}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <p style={{ 
                fontSize: '0.95rem', 
                color: '#999', 
                marginBottom: '28px', 
                fontFamily: '"Times New Roman", Times, serif',
                fontStyle: 'italic'
              }}>
                👆 Khách hàng quét mã QR để thanh toán
              </p>

              <div style={{ display: 'flex', gap: '14px' }}>
                <button
                  onClick={() => setShowQRModal(false)}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: '#f0f0f0',
                    color: '#666',
                    border: '2px solid #e5e5e5',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '1rem',
                    fontFamily: '"Times New Roman", Times, serif',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e5e5e5';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f0f0f0';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    handlePayment(selectedOrder.id, 'qr_code');
                    setShowQRModal(false);
                  }}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    fontSize: '1rem',
                    fontFamily: '"Times New Roman", Times, serif',
                    transition: 'all 0.3s',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => !loading && (
                    e.target.style.transform = 'translateY(-2px)',
                    e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.5)'
                  )}
                  onMouseLeave={(e) => (
                    e.target.style.transform = 'translateY(0)',
                    e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)'
                  )}
                >
                  {loading ? '⏳ Xử lý...' : '✅ Thanh toán rồi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
