<template>
    <div class="modal fade" id="productModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <form class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">➕ Chi tiết đơn hàng</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-md-6">
            <label class="form-label">Mã đơn hàng</label>
            <input type="text" class="form-control" name="product_name">
          </div>
                  <div class="col-md-6">
            <label class="form-label">Tên người đặt</label>
            <input type="number" class="form-control" name="order_name">
          </div>
          <div class="col-md-6">
            <label class="form-label">Địa chỉ</label>
            <input type="number" class="form-control" name="order_address">
          </div>
          <div class="col-md-6">
            <label class="form-label">Số điện thoại</label>
            <input type="number" class="form-control" name="order_phone">
          </div>
          <div class="col-md-6">
            <label class="form-label">Tổng số tiền</label>
            <input type="number" class="form-control" name="order_total">
          </div>
          <div class="col-md-6">
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
