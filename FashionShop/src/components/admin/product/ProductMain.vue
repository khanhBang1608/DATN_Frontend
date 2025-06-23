<template>
      <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">🛍️ Quản lý Sản phẩm</h2>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">
          + Thêm sản phẩm
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle text-light custom-table">
          <thead class="table-dark">
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Biến thể</th>
              <th>Giá từ</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><img src="https://via.placeholder.com/60" alt="SP1"></td>
              <td>Giày Sneaker Adidas</td>
              <td>Giày / Thể thao</td>
              <td>4</td>
              <td>950,000đ</td>
              <td><span class="badge bg-success badge-status">Đang bán</span></td>
              <td>2025-06-22</td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger">🗑️ Xóa</button>
              </td>
            </tr>
            <!-- Dòng khác nếu cần -->
          </tbody>
        </table>
      </div>
    </div>
</template>
