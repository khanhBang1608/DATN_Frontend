import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin';
const token = localStorage.getItem('token');

// Lấy tổng stock theo productId
export const getTotalStockByProductId = async (productId) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/total-stock/${productId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            }
        );
        return response.data; // { productId: 1, totalStock: 50 }
    } catch (error) {
        handleError(error);
    }
};

// Lấy tổng stock và tổng biến thể của toàn hệ thống
export const getSystemProductStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/product/system-stats`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
        return response.data;
        // Ví dụ: { totalVariants: 120, totalStock: 4520 }
    } catch (error) {
        handleError(error);
    }
};

// Hàm xử lý lỗi chung
function handleError(error) {
    if (error.response) {
        console.error(`❌ Lỗi ${error.response.status}:`, error.response.data);
    } else {
        console.error('❌ Lỗi kết nối:', error.message);
    }
    throw error;
}
