<template>
  <!-- Modal Thêm Khuyến mãi -->
  <div class="modal fade" id="promotionModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <form class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">➕ Thêm Khuyến mãi</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-md-6">
            <label class="form-label">Tên chương trình</label>
            <input type="text" class="form-control" name="name"/>
          </div>
          <div class="col-md-6">
            <label class="form-label">Phần trăm giảm</label>
            <input type="number" class="form-control" name="discount_percent"/>
          </div>
          <div class="col-md-12">
            <label class="form-label">Mô tả</label>
            <textarea class="form-control" rows="3" name="description"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày bắt đầu</label>
            <input type="date" class="form-control" name="start_date"/>
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày kết thúc</label>
            <input type="date" class="form-control" name="end_date"/>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success btn-icon">
            <i class="bi bi-check-circle"></i> Lưu
          </button>
          <button type="button" class="btn btn-secondary btn-icon" data-bs-dismiss="modal">
            <i class="bi bi-x-circle"></i> Hủy
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Sửa -->
  <div class="modal fade" id="editPromotionModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <form class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">✏️ Sửa Khuyến mãi</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-md-6">
            <label class="form-label">Tên chương trình</label>
            <input type="text" class="form-control" name="edit_name" value="Khuyến mãi Hè 2025"/>
          </div>
          <div class="col-md-6">
            <label class="form-label">Phần trăm giảm</label>
            <input type="number" class="form-control" name="edit_discount_percent" value="15"/>
          </div>
          <div class="col-md-12">
            <label class="form-label">Mô tả</label>
            <textarea class="form-control" rows="3" name="edit_description">Giảm giá mùa hè toàn bộ sản phẩm.</textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày bắt đầu</label>
            <input type="date" class="form-control" name="edit_start_date" value="2025-06-01"/>
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày kết thúc</label>
            <input type="date" class="form-control" name="edit_end_date" value="2025-06-30"/>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary btn-icon">
            <i class="bi bi-pencil-square"></i> Cập nhật
          </button>
          <button type="button" class="btn btn-secondary btn-icon" data-bs-dismiss="modal">
            <i class="bi bi-x-circle"></i> Hủy
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Xóa -->
  <div class="modal fade" id="confirmDeletePromotionModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title"><i class="bi bi-exclamation-triangle"></i> Xác nhận xóa</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          Bạn có chắc chắn muốn xóa chương trình <strong>Khuyến mãi Hè 2025</strong> không?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger">
            <i class="bi bi-trash"></i> Xóa
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="bi bi-x-circle"></i> Hủy
          </button>
        </div>
      </div>
    </div>
  </div>

</template>
