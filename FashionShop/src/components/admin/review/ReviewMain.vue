<template>
    <div class="card">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 class="mb-3 mb-md-0">⭐ Quản lý Đánh giá sản phẩm</h2>
        <div class="d-flex flex-wrap gap-2">
          <select class="form-select">
            <option value="">Tất cả sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
          <select class="form-select">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đã duyệt</option>
            <option value="0">Chờ duyệt</option>
          </select>
          <button class="btn btn-primary">🔍 Tìm</button>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 mb-3">
        <button class="btn btn-success">📥 Export Excel</button>
        <button class="btn btn-danger">📄 Export PDF</button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle custom-table custom-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Khách hàng</th>
              <th>Số sao</th>
              <th>Nội dung</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Giày Nike Air</td>
              <td>Trần Minh</td>
              <td><span class="rating-stars">★★★★☆</span></td>
              <td>Giày đi êm, form chuẩn.</td>
              <td>2025-06-22</td>
              <td><span class="badge bg-warning text-dark">Chờ duyệt</span></td>
              <td class="text-center">
                <button class="btn btn-sm btn-info text-white m-1" data-bs-toggle="modal" data-bs-target="#reviewModal">👁️</button>
                <button class="btn btn-sm btn-success m-1" >✅ Duyệt</button>
                <button class="btn btn-sm btn-danger m-1">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Balo Local Brand</td>
              <td>Nguyễn Hân</td>
              <td><span class="rating-stars">★★★★★</span></td>
              <td>Đẹp, đựng đồ nhiều.</td>
              <td>2025-06-21</td>
              <td><span class="badge bg-success">Đã duyệt</span></td>
              <td class="text-center">
                <button class="btn btn-sm btn-info text-white  m-1" data-bs-toggle="modal" data-bs-target="#reviewModal">👁️</button>
                <button class="btn btn-sm btn-secondary  m-1">❌ Bỏ duyệt</button>
                <button class="btn btn-sm btn-danger  m-1">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <nav class="mt-4">
        <ul class="pagination">
          <li class="page-item disabled"><a class="page-link">«</a></li>
          <li class="page-item active"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item"><a class="page-link" href="#">»</a></li>
        </ul>
      </nav>
    </div>
</template>
