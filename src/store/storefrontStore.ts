import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  addCartItem,
  addRecentlyViewed,
  toggleStoreItem,
  updateCartItemQuantity,
  type StoreCartItem,
  type StoreCurrency,
  type StoreProduct,
} from '@/lib/storefrontCommerce';

type StorefrontState = {
  carts: Record<string, StoreCartItem[]>;
  coupons: Record<string, string>;
  wishlists: Record<string, string[]>;
  comparisons: Record<string, string[]>;
  recentlyViewed: Record<string, string[]>;
  displayCurrency: StoreCurrency;
  addItem: (storeId: string, product: StoreProduct, quantity?: number) => void;
  updateQuantity: (storeId: string, productId: string, change: number) => void;
  removeItem: (storeId: string, productId: string) => void;
  clearCart: (storeId: string) => void;
  setCoupon: (storeId: string, couponCode: string) => void;
  clearCoupon: (storeId: string) => void;
  toggleWishlist: (storeId: string, productId: string) => void;
  toggleCompare: (storeId: string, productId: string) => void;
  recordProductView: (storeId: string, productId: string) => void;
  setDisplayCurrency: (currency: StoreCurrency) => void;
};

export const useStorefrontStore = create<StorefrontState>()(persist((set) => ({
  carts: {},
  coupons: {},
  wishlists: {},
  comparisons: {},
  recentlyViewed: {},
  displayCurrency: 'INR',
  addItem: (storeId, product, quantity = 1) => set((state) => ({
    carts: { ...state.carts, [storeId]: addCartItem(state.carts[storeId] || [], product, quantity) },
  })),
  updateQuantity: (storeId, productId, change) => set((state) => ({
    carts: { ...state.carts, [storeId]: updateCartItemQuantity(state.carts[storeId] || [], productId, change) },
  })),
  removeItem: (storeId, productId) => set((state) => ({
    carts: { ...state.carts, [storeId]: (state.carts[storeId] || []).filter((item) => item.id !== productId) },
  })),
  clearCart: (storeId) => set((state) => ({
    carts: { ...state.carts, [storeId]: [] },
    coupons: { ...state.coupons, [storeId]: '' },
  })),
  setCoupon: (storeId, couponCode) => set((state) => ({
    coupons: { ...state.coupons, [storeId]: couponCode.trim().toUpperCase() },
  })),
  clearCoupon: (storeId) => set((state) => ({
    coupons: { ...state.coupons, [storeId]: '' },
  })),
  toggleWishlist: (storeId, productId) => set((state) => ({
    wishlists: { ...state.wishlists, [storeId]: toggleStoreItem(state.wishlists[storeId] || [], productId) },
  })),
  toggleCompare: (storeId, productId) => set((state) => ({
    comparisons: { ...state.comparisons, [storeId]: toggleStoreItem(state.comparisons[storeId] || [], productId) },
  })),
  recordProductView: (storeId, productId) => set((state) => ({
    recentlyViewed: { ...state.recentlyViewed, [storeId]: addRecentlyViewed(state.recentlyViewed[storeId] || [], productId) },
  })),
  setDisplayCurrency: (currency) => set({ displayCurrency: currency }),
}), {
  name: 'launchly-storefront-v1',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    carts: state.carts,
    coupons: state.coupons,
    wishlists: state.wishlists,
    comparisons: state.comparisons,
    recentlyViewed: state.recentlyViewed,
    displayCurrency: state.displayCurrency,
  }),
}));
