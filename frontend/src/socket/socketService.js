import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket) return;
    
    this.socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✓ Connected to server via Socket.io');
    });

    this.socket.on('disconnect', () => {
      console.log('✗ Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Emit events
  emitOrderStatusUpdate(orderId, status) {
    if (this.socket) {
      this.socket.emit('order-status-update', { orderId, status });
    }
  }

  emitOrderPaid(order) {
    if (this.socket) {
      this.socket.emit('order-paid', order);
    }
  }

  // Listen to events
  onNewOrder(callback) {
    if (this.socket) {
      this.socket.on('new-order', callback);
    }
  }

  onOrderStatusChange(callback) {
    if (this.socket) {
      this.socket.on('order-status-update', callback);
    }
  }

  onOrderPaid(callback) {
    if (this.socket) {
      this.socket.on('order-paid', callback);
    }
  }

  // Remove listeners
  offNewOrder() {
    if (this.socket) {
      this.socket.off('new-order');
    }
  }

  offOrderStatusChange() {
    if (this.socket) {
      this.socket.off('order-status-update');
    }
  }

  offOrderPaid() {
    if (this.socket) {
      this.socket.off('order-paid');
    }
  }
}

export default new SocketService();
