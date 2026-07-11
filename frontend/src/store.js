import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  tableInfo: null,
  setTableInfo: (info) => set({ tableInfo: info }),
  addToCart: (item, quantity = 1, note = '') => set((state) => {
    const existingIndex = state.cart.findIndex(i => i.menuItem.id === item.id && i.note === note);
    if (existingIndex >= 0) {
      const newCart = [...state.cart];
      newCart[existingIndex].quantity += quantity;
      return { cart: newCart };
    }
    return { cart: [...state.cart, { menuItem: item, quantity, note }] };
  }),
  removeFromCart: (index) => set((state) => {
    const newCart = [...state.cart];
    newCart.splice(index, 1);
    return { cart: newCart };
  }),
  clearCart: () => set({ cart: [] }),
  getCartTotal: (state) => {
    return state.cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  }
}));
