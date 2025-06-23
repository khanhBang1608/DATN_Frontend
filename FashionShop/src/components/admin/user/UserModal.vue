<template>
    <div class="modal fade" id="addUserModal" tabindex="-1">
    <div class="modal-dialog">
      <form class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">➕ Thêm tài khoản</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-md-12">
            <label class="form-label">Họ tên</label>
            <input type="text" class="form-control" name="full_name">
          </div>
          <div class="col-md-12">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" name="email">
          </div>
          <div class="col-md-6">
            <label class="form-label">Mật khẩu</label>
            <input type="password" class="form-control" name="password">
          </div>
          <div class="col-md-6">
            <label class="form-label">Vai trò</label>
            <select class="form-select" name="role">
              <option>Admin</option>
              <option>Khách hàng</option>
              <option>Nhân viên</option>
            </select>
          </div>
          <div class="col-md-12">
            <label class="form-label">Trạng thái</label>
            <select class="form-select" name="status">
              <option value="1">Hoạt động</option>
              <option value="0">Bị khóa</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Lưu</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>
