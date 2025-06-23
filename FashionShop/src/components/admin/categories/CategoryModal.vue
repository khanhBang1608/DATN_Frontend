<template>
   <div class="modal fade" id="addCategoryModal" tabindex="-1">
    <div class="modal-dialog">
      <form class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">➕ Thêm Danh mục</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-md-12">
            <label class="form-label">Tên danh mục</label>
            <input type="text" class="form-control" name="category_name">
          </div>
          <div class="col-md-12">
            <label class="form-label">Danh mục cha</label>
            <select class="form-select" name="parent_id">
              <option value="">-- Không có --</option>
              <option value="1">Giày</option>
            </select>
          </div>
          <div class="col-md-12">
            <label class="form-label">Trạng thái</label>
            <select class="form-select" name="status">
              <option value="1">Hiển thị</option>
              <option value="0">Ẩn</option>
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
