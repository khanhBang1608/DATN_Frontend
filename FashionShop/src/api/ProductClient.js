import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/public';

// ✅ API công khai – KHÔNG cần token
export const getAllProducts = (page = 0, size = 8) =>
  axios.get(`${API_BASE}/products`, {
    params: { page, size },
  });

export const getProductDetail = (productId) => axios.get(`${API_BASE}/products/${productId}`);

export const getProductVariants = (productId) =>
  axios.get(`${API_BASE}/products/${productId}/variants`);

export const getVariantByColorAndSize = (productId, colorId, sizeId = null) => {
  const params = { colorId };
  if (sizeId !== null) params.sizeId = sizeId;
  return axios.get(`${API_BASE}/products/${productId}/variant`, { params });
};

export const getProductOptions = (productId) =>
  axios.get(`${API_BASE}/products/${productId}/options`);

export const getRelatedProducts = (categoryId, excludeProductId, page = 0, size = 4) =>
  axios.get(`${API_BASE}/products/related`, {
    params: {
      categoryId,
      excludeProductId,
      page,
      size
    }
  });

export const searchProductsByName = (keyword, page = 0, size = 8) =>
  axios.get(`${API_BASE}/products/search`, {
    params: { keyword, page, size }
  });

export const fetchAverageRating = (productId) =>
  axios.get(`${API_BASE}/products/${productId}/average-rating`);

export const getFavoriteCount = (productId) =>
  axios.get(`${API_BASE}/products/${productId}/favorite-count`);
