<template>
    <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">🛍️ Quản lý đơn hàng</h2>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle text-light custom-table">
          <thead class="table-dark">
            <tr>
              <th>Mã đơn hàng</th>
              <th>Tên người đặt</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Tổng tiền</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Trí</td>
              <td>Cần Thơ</td>
              <td>0909090909</td>
              <td>1,000,000 VND</td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning">✏️</button>
                <button class="btn btn-sm btn-danger">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>
