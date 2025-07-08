<template>
      <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">👤 Quản lý Tài khoản</h2>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle text-light custom-table">
          <thead class="table-dark">
            <tr>
              <th>Ảnh</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><img src="https://via.placeholder.com/50" alt="User"></td>
              <td>Nguyễn Văn A</td>
              <td>nva@example.com</td>
              <td>Admin</td>
              <td><span class="badge bg-success badge-status">Hoạt động</span></td>
              <td>2025-06-01</td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning  m-1">✏️ Sửa</button>
              </td>
            </tr>
            <!-- Thêm dòng khác nếu cần -->
          </tbody>
        </table>
      </div>
    </div>
</template>
