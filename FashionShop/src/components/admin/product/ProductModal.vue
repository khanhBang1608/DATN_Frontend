<template>
    <div class="modal fade" id="addProductModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <form class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">➕ Thêm Sản phẩm</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-md-6">
            <label class="form-label">Tên sản phẩm</label>
            <input type="text" class="form-control" name="product_name">
          </div>
          <div class="col-md-6">
            <label class="form-label">Danh mục phụ</label>
            <select class="form-select" name="sub_category_id">
              <option>-- Chọn --</option>
              <option value="1">Giày / Thể thao</option>
            </select>
          </div>
          <div class="col-md-12">
            <label class="form-label">Mô tả</label>
            <textarea class="form-control" rows="3" name="description"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Ảnh đại diện</label>
            <input type="file" class="form-control" name="image">
          </div>
          <div class="col-md-6">
            <label class="form-label">Trạng thái</label>
            <select class="form-select" name="status">
              <option value="1">Đang bán</option>
              <option value="0">Ngừng bán</option>
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
