<template>
   <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">📢 Quản lý Khuyến mãi</h2>
        <button class="btn btn-success btn-icon" data-bs-toggle="modal" data-bs-target="#promotionModal">
          <i class="bi bi-plus-circle"></i> Thêm khuyến mãi
        </button>
      </div>
      <table class="table table-hover align-middle custom-table">
        <thead>
          <tr>
            <th>Tên chương trình</th>
            <th>Giảm (%)</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Khuyến mãi Hè 2025</td>
            <td>15%</td>
            <td>2025-06-01</td>
            <td>2025-06-30</td>
            <td><span class="badge bg-success">Đang hoạt động</span></td>
            <td class="text-center">
                             <button class="btn btn-sm btn-warning  m-1">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger  m-1">🗑️ Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
