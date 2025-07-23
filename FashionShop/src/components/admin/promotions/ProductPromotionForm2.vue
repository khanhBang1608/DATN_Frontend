<script setup>
  
</script>
<template>
<form action="/your-servlet-or-endpoint" method="post" class="p-3 border rounded" style="max-width: 400px;">
  <div class="mb-3">
    <label for="id" class="form-label">ID</label>
    <input type="text" class="form-control" id="id" name="id" required>
  </div>

  <div class="mb-3">
    <label for="variantId" class="form-label">Variant ID</label>
    <input type="text" class="form-control" id="variantId" name="variantId" required>
  </div>

  <div class="mb-3">
    <label for="quantity" class="form-label">Số lượng</label>
    <input type="number" class="form-control" id="quantity" name="quantity" min="1" required>
  </div>

  <button type="submit" class="btn btn-primary">Gửi</button>
</form>
</template>
