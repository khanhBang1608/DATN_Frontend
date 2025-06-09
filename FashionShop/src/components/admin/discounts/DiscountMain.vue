<template>
      <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">🎁 Quản lý Mã Giảm Giá</h2>
        <button class="btn btn-primary btn-icon" data-bs-toggle="modal" data-bs-target="#discountModal">
          <i class="bi bi-plus-lg"></i> Thêm mã giảm giá
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-primary">
            <tr>
              <th>Mã</th>
              <th>Giảm (%)</th>
              <th>Đơn tối thiểu</th>
              <th>Giảm tối đa</th>
              <th>Số lượng</th>
              <th>Hiệu lực</th>
              <th>Trạng thái</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>SALE20</strong></td>
              <td>20%</td>
              <td>300,000đ</td>
              <td>100,000đ</td>
              <td>50</td>
              <td>01/06 - 30/06</td>
              <td><span class="badge bg-success">Đang hoạt động</span></td>
              <td class="text-center">
                <button class="btn btn-outline-primary btn-sm me-1 btn-icon" data-bs-toggle="modal" data-bs-target="#editDiscountModal">
                  <i class="bi bi-pencil"></i> Sửa
                </button>
                <button class="btn btn-outline-danger btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">
                  <i class="bi bi-trash3"></i> Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>
