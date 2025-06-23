<template>
      <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">📁 Quản lý Danh mục</h2>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCategoryModal">
          + Thêm danh mục
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle text-light custom-table">
          <thead class="table-dark">
            <tr>
              <th>STT</th>
              <th>Tên danh mục</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Giày</td>
              <td>Danh mục cha</td>
              <td><span class="badge bg-success badge-status">Hiển thị</span></td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger">🗑️ Xóa</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Thể thao</td>
              <td>Danh mục con (Giày)</td>
              <td><span class="badge bg-success badge-status">Hiển thị</span></td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger">🗑️ Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>
