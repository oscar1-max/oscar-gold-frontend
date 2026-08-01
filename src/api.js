const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("og_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("og_token", token);
  else localStorage.removeItem("og_token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/api/auth/me"),

  categories: () => request("/api/categories", { auth: false }),
  products: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null));
    return request(`/api/products${qs.toString() ? `?${qs}` : ""}`, { auth: false });
  },
  product: (id) => request(`/api/products/${id}`, { auth: false }),
  reviews: (id) => request(`/api/products/${id}/reviews`, { auth: false }),
  addReview: (id, payload) => request(`/api/products/${id}/reviews`, { method: "POST", body: payload }),

  getCart: () => request("/api/cart"),
  addToCart: (variantId, quantity) => request("/api/cart", { method: "POST", body: { variantId, quantity } }),
  updateCartItem: (itemId, payload) => request(`/api/cart/${itemId}`, { method: "PATCH", body: payload }),
  removeCartItem: (itemId) => request(`/api/cart/${itemId}`, { method: "DELETE" }),
  getWishlist: () => request("/api/cart/wishlist/all"),
  addWishlist: (productId) => request("/api/cart/wishlist/all", { method: "POST", body: { productId } }),
  removeWishlist: (productId) => request(`/api/cart/wishlist/${productId}`, { method: "DELETE" }),

  checkout: (payload) => request("/api/orders/checkout", { method: "POST", body: payload }),
  orders: () => request("/api/orders"),
  order: (id) => request(`/api/orders/${id}`),

  createPaymentIntent: (paymentId) => request("/api/payments/create-intent", { method: "POST", body: { paymentId } }),

  sellerMe: () => request("/api/seller/me"),
  sellerProducts: () => request("/api/seller/products"),
  createSellerProduct: (payload) => request("/api/seller/products", { method: "POST", body: payload }),
  updateSellerProduct: (id, payload) => request(`/api/seller/products/${id}`, { method: "PATCH", body: payload }),
  updateVariantStock: (productId, variantId, stock) =>
    request(`/api/seller/products/${productId}/variants/${variantId}`, { method: "PATCH", body: { stock } }),
  sellerOrders: () => request("/api/seller/orders"),
  updateSellerOrderStatus: (orderId, status) =>
    request(`/api/seller/orders/${orderId}/status`, { method: "PATCH", body: { status } }),

  adminStats: () => request("/api/admin/stats"),
  adminSellers: (status) => request(`/api/admin/sellers${status ? `?status=${status}` : ""}`),
  updateSellerStatus: (id, status) => request(`/api/admin/sellers/${id}`, { method: "PATCH", body: { status } }),
  adminUsers: () => request("/api/admin/users"),
  adminProducts: (status) => request(`/api/admin/products${status ? `?status=${status}` : ""}`),
  updateAdminProductStatus: (id, status) => request(`/api/admin/products/${id}`, { method: "PATCH", body: { status } }),
  adminTransactions: () => request("/api/admin/transactions"),
};
