<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const token = localStorage.getItem("token");

const rawCategories = ref([]);
const expandedNodes = ref(new Set());

const newCategory = ref({ categoryName: "", parentId: null, status: "1" });
const editCategory = ref({
  categoryId: null,
  categoryName: "",
  parentId: null,
  status: "1",
});

const formErrors = ref({ name: "", status: "" });

const searchQuery = ref("");
const selectedStatus = ref("all");

const currentPage = ref(1);
const itemsPerPage = 8;

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const showSystemError = (message) => {
  iziToast.error({
    title: "Lỗi",
    message: message,
    position: "topRight",
  });
};

const fetchCategories = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/admin/category", {
      headers: { Authorization: `Bearer ${token}` },
    });
    rawCategories.value = res.data;
  } catch (err) {
    showSystemError("Lỗi khi tải danh mục: " + (err.response?.data || err.message));
  }
};

const toggleExpand = (id) => {
  if (expandedNodes.value.has(id)) expandedNodes.value.delete(id);
  else expandedNodes.value.add(id);
};

const processTree = (nodes, parentIndex = "", level = 0) => {
  let result = [];
  nodes.forEach((node, i) => {
    const index = parentIndex ? `${parentIndex}.${i + 1}` : `${i + 1}`;
    result.push({ ...node, level, index });
    if (expandedNodes.value.has(node.categoryId) && node.children?.length) {
      result = result.concat(processTree(node.children, index, level + 1));
    }
  });
  return result;
};

const filteredTree = computed(() => {
  const filterFn = (node) => {
    const matchName = node.categoryName
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchStatus =
      selectedStatus.value === "all" ||
      (selectedStatus.value === "active" && node.status) ||
      (selectedStatus.value === "inactive" && !node.status);
    return matchName && matchStatus;
  };

  const filterTree = (nodes) => {
    return nodes
      .map((node) => {
        const children = filterTree(node.children || []);
        const matched = filterFn(node) || children.length > 0;
        return matched ? { ...node, children } : null;
      })
      .filter(Boolean);
  };

  return filterTree(rawCategories.value);
});

const paginatedRoots = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTree.value.slice(start, start + itemsPerPage);
});

const displayedCategories = computed(() => {
  return processTree(paginatedRoots.value);
});

const totalPages = computed(() => Math.ceil(filteredTree.value.length / itemsPerPage));

const parentCategories = computed(() =>
  rawCategories.value
    .filter((cat) => !cat.parentId)
    .map((cat) => ({ categoryId: cat.categoryId, categoryName: cat.categoryName }))
);

const validateForm = (form) => {
  formErrors.value = { name: "", status: "" };
  let valid = true;

  if (!form.categoryName || form.categoryName.trim() === "") {
    formErrors.value.name = "Tên danh mục không được để trống";
    valid = false;
  }

  if (form.status !== "1" && form.status !== "0") {
    formErrors.value.status = "Trạng thái không hợp lệ";
    valid = false;
  }

  return valid;
};

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

    iziToast.success({
      title: "Thành công",
      message: "Tạo danh mục thành công",
      position: "topRight",
    });

    await fetchCategories();
    document.getElementById("addCategoryModalClose").click();
    newCategory.value = { categoryName: "", parentId: null, status: "1" };
  } catch (err) {
    if (Array.isArray(err.response?.data)) {
      const errors = err.response.data;
      formErrors.value = { name: "", status: "" };
      errors.forEach((msg) => {
        if (msg.includes("Tên danh mục")) formErrors.value.name = msg;
        else if (msg.includes("Trạng thái")) formErrors.value.status = msg;
      });
    } else {
      showSystemError(err.response?.data || "Lỗi khi tạo danh mục");
    }
  }
};

const editCategoryData = (item) => {
  editCategory.value = {
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    parentId: item.parentId,
    status: item.status ? "1" : "0",
  };
  formErrors.value = { name: "", status: "" };
};

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

    iziToast.success({
      title: "Thành công",
      message: "Cập nhật danh mục thành công",
      position: "topRight",
    });

    await fetchCategories();
    document.getElementById("editCategoryModalClose").click();
  } catch (err) {
    if (Array.isArray(err.response?.data)) {
      const errors = err.response.data;
      formErrors.value = { name: "", status: "" };
      errors.forEach((msg) => {
        if (msg.includes("Tên danh mục")) formErrors.value.name = msg;
        else if (msg.includes("Trạng thái")) formErrors.value.status = msg;
      });
    } else {
      showSystemError(err.response?.data || "Lỗi khi cập nhật danh mục");
    }
  }
};

onMounted(fetchCategories);
</script>

<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>📁 Danh mục sản phẩm</h2>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addCategoryModal"
      >
        <i class="bi bi-plus-circle"></i> Thêm danh mục
      </button>
    </div>

    <div class="row mb-3">
      <div class="col-md-4">
        <div class="admin-search-box">
          <input
            type="text"
            v-model="searchQuery"
            class="admin-search-text"
            placeholder="Nhập tên danh mục..."
            @input="onSearchInput"
          />
          <i class="bi bi-search admin-search-icon"></i>
        </div>
      </div>
      <div class="col-md-4">
        <select v-model="selectedStatus" class="admin-select">
          <option value="all">-- Tất cả trạng thái --</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th style="width: 50px">STT</th>
            <th style="width: 40px" class="text-center">#</th> <!-- Icon expand -->
            <th style="width: auto">Tên danh mục</th>
            <th style="width: 160px" class="text-end">Loại</th>
            <th style="width: 130px" class="text-end">Số sản phẩm</th> <!-- Cột mới -->
            <th style="width: 130px" class="text-end">Trạng thái</th>
            <th style="width: 130px" class="text-end">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in displayedCategories" :key="item.categoryId">
            <td class="align-middle">{{ item.index }}</td>

            <!-- Icon Expand -->
            <td class="text-center align-middle">
              <span
                v-if="item.children?.length"
                @click="toggleExpand(item.categoryId)"
                style="cursor: pointer; display: inline-block; width: 16px"
              >
                {{ expandedNodes.has(item.categoryId) ? "▼" : "▶" }}
              </span>
            </td>

            <!-- Tên danh mục (thụt lề theo cấp) -->
            <td class="align-middle">
              <div :style="{ paddingLeft: `${item.level * 20}px` }">
                {{ item.categoryName }}
              </div>
            </td>

            <!-- Loại -->
            <td class="text-end align-middle">
              <span v-if="item.parentId === null">Danh mục cha</span>
              <span v-else>
                {{
                  displayedCategories.find((c) => c.categoryId === item.parentId)
                    ?.categoryName || "Không rõ"
                }}
              </span>
            </td>

            <!-- Số sản phẩm -->
            <td class="text-end align-middle">
              {{ item.productCount }}
            </td>

            <!-- Trạng thái -->
            <td class="text-end align-middle">
              <span :class="['badge', item.status ? 'bg-success' : 'bg-danger']">
                {{ item.status ? "Đang bán" : "Ngừng bán" }}
              </span>
            </td>

            <!-- Hành động -->
            <td class="text-end align-middle">
              <button
                class="btn btn-warning btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#editCategoryModal"
                @click="editCategoryData(item)"
              >
                <i class="bi bi-pencil-square"></i> Sửa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1" class="admin-pagination">
      <!-- Nút trước -->
      <div
        class="admin-button admin-prev"
        :class="{ disabled: currentPage === 1 }"
        @click="changePage(currentPage - 1)"
      >
        &lt; prev
      </div>

      <!-- Số trang -->
      <div
        v-for="page in totalPages"
        :key="page"
        class="admin-page"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </div>

      <!-- Nút sau -->
      <div
        class="admin-button admin-next"
        :class="{ disabled: currentPage === totalPages }"
        @click="changePage(currentPage + 1)"
      >
        next &gt;
      </div>
    </div>
  </div>

  <!-- Modal Thêm -->
  <div class="modal fade" id="addCategoryModal" tabindex="-1">
    <div class="modal-dialog">
      <form @submit.prevent="createCategory" class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">Thêm Danh Mục</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            id="addCategoryModalClose"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Label cho Tên danh mục -->
          <label for="categoryNameInput" class="form-label">Tên danh mục:</label>
          <input
            id="categoryNameInput"
            v-model="newCategory.categoryName"
            placeholder="Tên danh mục"
            class="form-control mb-2"
          />
          <div v-if="formErrors.name" class="text-danger small mb-2">
            {{ formErrors.name }}
          </div>

          <!-- Label cho Danh mục cha -->
          <label for="parentCategorySelect" class="form-label">Loại:</label>
          <select
            id="parentCategorySelect"
            v-model="newCategory.parentId"
            class="form-select mb-2"
          >
            <option :value="null">-- Không có --</option>
            <option
              v-for="cat in parentCategories"
              :key="cat.categoryId"
              :value="cat.categoryId"
            >
              {{ cat.categoryName }}
            </option>
          </select>

          <!-- Label cho Trạng thái -->
          <label for="statusSelect" class="form-label">Trạng thái:</label>
          <select id="statusSelect" v-model="newCategory.status" class="form-select mb-2">
            <option value="1">Đang bán</option>
            <option value="0">Ngừng bán</option>
          </select>
          <div v-if="formErrors.status" class="text-danger small mb-2">
            {{ formErrors.status }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Đóng
          </button>
          <button class="btn btn-success">Thêm mới</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Sửa -->
  <div class="modal fade" id="editCategoryModal" tabindex="-1">
    <div class="modal-dialog">
      <form @submit.prevent="updateCategory" class="modal-content">
        <div class="modal-header bg-warning text-white">
          <h5 class="modal-title">Sửa Danh mục</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            id="editCategoryModalClose"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Tên danh mục -->
          <label for="editCategoryName" class="form-label">Tên danh mục:</label>
          <input
            id="editCategoryName"
            v-model="editCategory.categoryName"
            class="form-control mb-1"
          />
          <div v-if="formErrors.name" class="text-danger small mb-2">
            {{ formErrors.name }}
          </div>

          <!-- Danh mục cha -->
          <label for="editParentCategory" class="form-label mt-2">Loại</label>
          <select
            id="editParentCategory"
            v-model="editCategory.parentId"
            class="form-select mb-3"
          >
            <option :value="null">-- Không có --</option>
            <option
              v-for="cat in parentCategories"
              :key="cat.categoryId"
              :value="cat.categoryId"
            >
              {{ cat.categoryName }}
            </option>
          </select>

          <!-- Trạng thái -->
          <label for="editStatus" class="form-label">Trạng thái:</label>
          <select id="editStatus" v-model="editCategory.status" class="form-select mb-1">
            <option value="1">Đang bán</option>
            <option value="0">Ngừng bán</option>
          </select>
          <div v-if="formErrors.status" class="text-danger small mb-2">
            {{ formErrors.status }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Đóng
          </button>
          <button class="btn btn-success">Cập nhật</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.custom-table td,
.custom-table th {
  vertical-align: middle;
}
.custom-table {
  table-layout: fixed;
  width: 100%;
}

.custom-table th,
.custom-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-table th:nth-child(1) {
  width: 5%; /* STT */
}
.custom-table th:nth-child(2) {
  width: 5%; /* Icon expand */
}
.custom-table th:nth-child(3) {
  width: 35%; /* Tên danh mục */
}
.custom-table th:nth-child(4) {
  width: 15%; /* Loại */
}
.custom-table th:nth-child(5) {
  width: 15%; /* Số sản phẩm */
}
.custom-table th:nth-child(6) {
  width: 10%; /* Trạng thái */
}
.custom-table th:nth-child(7) {
  width: 15%; /* Hành động */
}

.table-responsive {
  overflow-x: auto;
}
.custom-table td,
.custom-table th {
  vertical-align: middle;
  white-space: nowrap;
}
</style>
