<template>

  <!-- Modal Thêm Mã Giảm Giá -->
  <div class="modal fade" id="discountModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <form class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">➕ Thêm Mã Giảm Giá</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-md-6">
            <label class="form-label">Mã</label>
            <input type="text" class="form-control" name="discount_code">
          </div>
          <div class="col-md-6">
            <label class="form-label">Phần trăm giảm</label>
            <input type="number" class="form-control" name="discount_percent">
          </div>
          <div class="col-md-6">
            <label class="form-label">Đơn hàng tối thiểu</label>
            <input type="number" class="form-control" name="min_order_amount">
          </div>
          <div class="col-md-6">
            <label class="form-label">Giảm tối đa</label>
            <input type="number" class="form-control" name="max_discount_amount">
          </div>
          <div class="col-md-6">
            <label class="form-label">Số lượng</label>
            <input type="number" class="form-control" name="quantity_limit">
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày bắt đầu</label>
            <input type="date" class="form-control" name="start_date">
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày kết thúc</label>
            <input type="date" class="form-control" name="end_date">
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

  <!-- Modal Sửa Mã Giảm Giá -->
  <div class="modal fade" id="editDiscountModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <form class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">✏️ Sửa Mã Giảm Giá</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-md-6">
            <label class="form-label">Mã</label>
            <input type="text" class="form-control" name="edit_discount_code" value="SALE20">
          </div>
          <div class="col-md-6">
            <label class="form-label">Phần trăm giảm</label>
            <input type="number" class="form-control" name="edit_discount_percent" value="20">
          </div>
          <div class="col-md-6">
            <label class="form-label">Đơn hàng tối thiểu</label>
            <input type="number" class="form-control" name="edit_min_order_amount" value="300000">
          </div>
          <div class="col-md-6">
            <label class="form-label">Giảm tối đa</label>
            <input type="number" class="form-control" name="edit_max_discount_amount" value="100000">
          </div>
          <div class="col-md-6">
            <label class="form-label">Số lượng</label>
            <input type="number" class="form-control" name="edit_quantity_limit" value="50">
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày bắt đầu</label>
            <input type="date" class="form-control" name="edit_start_date" value="2025-06-01">
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày kết thúc</label>
            <input type="date" class="form-control" name="edit_end_date" value="2025-06-30">
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

  <!-- Modal Xác nhận Xóa -->
  <div class="modal fade" id="confirmDeleteModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger"><i class="bi bi-exclamation-triangle"></i> Xác nhận xóa</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          Bạn có chắc chắn muốn xóa mã giảm giá <strong>SALE20</strong> không? Hành động này không thể hoàn tác.
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
