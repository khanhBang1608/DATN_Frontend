<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// --- Token ---
const token = localStorage.getItem("token");

// --- Danh sách và form danh mục ---
const categories = ref([]);
const newCategory = ref({ categoryName: "", parentId: null, status: "1" });
const editCategory = ref({
  categoryId: null,
  categoryName: "",
  parentId: null,
  status: "1",
});
const errorMessage = ref("");

// --- Bộ lọc ---
const filterName = ref("");
const filterStatus = ref("");
const filterParent = ref("");

// --- Danh mục cha ---
const parentCategories = computed(() =>
  categories.value.filter((cat) => cat.parentId === null)
);

// --- Danh sách sau khi lọc ---
const filteredCategories = computed(() => {
  return categories.value.filter((item) => {
    const matchesName = item.categoryName
      .toLowerCase()
      .includes(filterName.value.toLowerCase());

    const matchesStatus =
      filterStatus.value === ""
        ? true
        : item.status === (filterStatus.value === "1");

    const matchesParent =
      filterParent.value === ""
        ? true
        : filterParent.value === "parent"
        ? item.parentId === null
        : filterParent.value === "child"
        ? item.parentId !== null
        : true;

    return matchesName && matchesStatus && matchesParent;
  });
});

// --- Lấy danh sách danh mục từ API ---
const fetchCategories = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/admin/category", {
      headers: { Authorization: `Bearer ${token}` },
    });
    categories.value = res.data;
    errorMessage.value = "";
  } catch (err) {
    errorMessage.value =
      "Lỗi khi tải danh mục: " + (err.response?.data || err.message);
  }
};

// --- Validate Form ---
const validateForm = (form) => {
  if (!form.categoryName || form.categoryName.trim() === "") {
    errorMessage.value = "Tên danh mục không được để trống";
    return false;
  }
  return true;
};

// --- Tạo danh mục ---
const createCategory = async () => {
  if (!validateForm(newCategory.value)) return;

  try {
    await axios.post(
      "http://localhost:8080/api/admin/category/create",
      {
        name: newCategory.value.categoryName,
        parentId: newCategory.value.parentId,
        status: newCategory.value.status === "1",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchCategories();
    alert("Tạo danh mục thành công");
    document.getElementById("addCategoryModal").click();
    newCategory.value = { categoryName: "", parentId: null, status: "1" };
  } catch (err) {
    errorMessage.value =
      err.response?.data || "Lỗi khi tạo danh mục";
  }
};

// --- Cập nhật danh mục ---
const updateCategory = async () => {
  if (!validateForm(editCategory.value)) return;

  try {
    await axios.put(
      `http://localhost:8080/api/admin/category/update/${editCategory.value.categoryId}`,
      {
        name: editCategory.value.categoryName,
        parentId: editCategory.value.parentId,
        status: editCategory.value.status === "1",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchCategories();
    alert("Cập nhật danh mục thành công");
    document.getElementById("editCategoryModal").click();
  } catch (err) {
    errorMessage.value =
      err.response?.data || "Lỗi khi cập nhật danh mục";
  }
};

// --- Chuẩn bị dữ liệu sửa ---
const editCategoryData = (category) => {
  editCategory.value = {
    ...category,
    status: category.status ? "1" : "0",
  };
  errorMessage.value = "";
};

// --- Khi mounted ---
onMounted(fetchCategories);
</script>

<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>📁 Quản lý Danh mục</h2>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addCategoryModal"
      >
        + Thêm danh mục
      </button>
    </div>

    <!-- Bộ lọc -->
    <div class="row mb-4">
      <div class="col-md-4">
        <input
          v-model="filterName"
          class="form-control"
          placeholder="🔍 Tìm theo tên danh mục"
        />
      </div>
      <div class="col-md-4">
        <select v-model="filterStatus" class="form-select">
          <option value="">-- Tất cả trạng thái --</option>
          <option value="1">Đang bán</option>
          <option value="0">Ngừng bán</option>
        </select>
      </div>
      <div class="col-md-4">
        <select v-model="filterParent" class="form-select">
          <option value="">-- Tất cả loại danh mục --</option>
          <option value="parent">Danh mục cha</option>
          <option value="child">Danh mục con</option>
        </select>
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <!-- Bảng danh mục -->
    <div class="table-responsive">
      <table class="table table-hover text-light custom-table">
        <thead class="table-dark">
          <tr>
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Loại danh mục</th>
            <th>Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in filteredCategories"
            :key="item.categoryId"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.categoryName }}</td>
            <td>
              <span v-if="item.parentId === null">Danh mục cha</span>
              <span v-else>
                {{
                  categories.find((cat) => cat.categoryId === item.parentId)
                    ?.categoryName || "Không rõ"
                }}
              </span>
            </td>
            <td>
              <span :class="['badge', item.status ? 'bg-success' : 'bg-danger']">
                {{ item.status ? "Đang bán" : "Ngừng bán" }}
              </span>
            </td>
            <td class="text-center">
              <button
                @click="editCategoryData(item)"
                class="btn btn-sm btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#editCategoryModal"
              >
                ✏️ Sửa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal Thêm Danh mục -->
  <div
    class="modal fade"
    id="addCategoryModal"
    tabindex="-1"
    aria-labelledby="addCategoryModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <form @submit.prevent="createCategory" class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">➕ Thêm Danh mục</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-12">
            <label class="form-label">Tên danh mục</label>
            <input
              v-model.trim="newCategory.categoryName"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-12">
            <label class="form-label">Danh mục cha</label>
            <select v-model="newCategory.parentId" class="form-select">
              <option value="">-- Không có --</option>
              <option
                v-for="cat in parentCategories"
                :key="cat.categoryId"
                :value="cat.categoryId"
              >
                {{ cat.categoryName }}
              </option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label">Trạng thái</label>
            <select v-model="newCategory.status" class="form-select">
              <option value="1">Đang bán</option>
              <option value="0">Ngừng bán</option>
            </select>
          </div>
          <div v-if="errorMessage" class="alert alert-danger mt-2">
            {{ errorMessage }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Lưu</button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Sửa Danh mục -->
  <div
    class="modal fade"
    id="editCategoryModal"
    tabindex="-1"
    aria-labelledby="editCategoryModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <form @submit.prevent="updateCategory" class="modal-content">
        <div class="modal-header bg-warning text-white">
          <h5 class="modal-title">✏️ Sửa Danh mục</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body row g-3">
          <div class="col-12">
            <label class="form-label">Tên danh mục</label>
            <input
              v-model.trim="editCategory.categoryName"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-12">
            <label class="form-label">Danh mục cha</label>
            <select v-model="editCategory.parentId" class="form-select">
              <option value="">-- Không có --</option>
              <option
                v-for="cat in parentCategories"
                :key="cat.categoryId"
                :value="cat.categoryId"
              >
                {{ cat.categoryName }}
              </option>
            </select>
          </div>
          <div class="col-12">
            <label class="form-label">Trạng thái</label>
            <select v-model="editCategory.status" class="form-select">
              <option value="1">Đang bán</option>
              <option value="0">Ngừng bán</option>
            </select>
          </div>
          <div v-if="errorMessage" class="alert alert-danger mt-2">
            {{ errorMessage }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-warning text-white">
            Cập nhật
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
