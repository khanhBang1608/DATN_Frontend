<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const token = localStorage.getItem("token");

const rawCategories = ref([]);
const expandedNodes = ref(new Set());
const errorMessage = ref("");

const newCategory = ref({ categoryName: "", parentId: null, status: "1" });
const editCategory = ref({
  categoryId: null,
  categoryName: "",
  parentId: null,
  status: "1",
});

const searchQuery = ref("");
const selectedStatus = ref("all");

const currentPage = ref(1);
const itemsPerPage = 10;

const fetchCategories = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/admin/category", {
      headers: { Authorization: `Bearer ${token}` },
    });
    rawCategories.value = res.data;
    errorMessage.value = "";
  } catch (err) {
    errorMessage.value = "Lỗi khi tải danh mục: " + (err.response?.data || err.message);
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

// ✅ Lấy toàn bộ danh mục cha, không chỉ trang hiện tại
const parentCategories = computed(() =>
  rawCategories.value
    .filter((cat) => !cat.parentId)
    .map((cat) => ({ categoryId: cat.categoryId, categoryName: cat.categoryName }))
);

const validateForm = (form) => {
  if (!form.categoryName || form.categoryName.trim() === "") {
    errorMessage.value = "Tên danh mục không được để trống";
    return false;
  }
  return true;
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
    await fetchCategories();
    document.getElementById("addCategoryModalClose").click();
    newCategory.value = { categoryName: "", parentId: null, status: "1" };
  } catch (err) {
    errorMessage.value = err.response?.data || "Lỗi khi tạo danh mục";
  }
};

const editCategoryData = (item) => {
  editCategory.value = {
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    parentId: item.parentId,
    status: item.status ? "1" : "0",
  };
  errorMessage.value = "";
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
    await fetchCategories();
    document.getElementById("editCategoryModalClose").click();
  } catch (err) {
    errorMessage.value = err.response?.data || "Lỗi khi cập nhật danh mục";
  }
};

onMounted(fetchCategories);
</script>

<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>📁 Danh mục sản phẩm</h2>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addCategoryModal"
      >
        ➕ Thêm danh mục
      </button>
    </div>

    <div class="row mb-3">
      <div class="col-md-4">
        <input
          v-model="searchQuery"
          class="form-control"
          placeholder="🔍 Tìm theo tên danh mục..."
        />
      </div>
      <div class="col-md-4">
        <select v-model="selectedStatus" class="form-select">
          <option value="all">-- Tất cả trạng thái --</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
      </div>
    </div>

    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <div class="table-responsive">
      <table class="table table-hover text-light custom-table w-100">
        <thead class="table-dark">
          <tr>
            <th style="width: 50px">STT</th>
            <th style="width: 40px" class="text-center">#</th>
            <!-- Icon expand -->
            <th style="width: auto">Tên danh mục</th>
            <th style="width: 160px" class="text-end">Loại</th>
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
                ✏️ Sửa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="totalPages > 1">
      <ul class="pagination justify-content-center mt-3">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="currentPage > 1 && currentPage--"
        >
          <a class="page-link">Trước</a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
        >
          <a class="page-link">{{ page }}</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="currentPage < totalPages && currentPage++"
        >
          <a class="page-link">Sau</a>
        </li>
      </ul>
    </nav>
  </div>

  <!-- Modal Thêm -->
  <div class="modal fade" id="addCategoryModal" tabindex="-1">
    <div class="modal-dialog">
      <form @submit.prevent="createCategory" class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">➕ Thêm Danh mục</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            id="addCategoryModalClose"
          ></button>
        </div>
        <div class="modal-body">
          <input
            v-model="newCategory.categoryName"
            placeholder="Tên danh mục"
            class="form-control mb-3"
          />
          <select v-model="newCategory.parentId" class="form-select mb-3">
            <option :value="null">-- Không có --</option>
            <option
              v-for="cat in parentCategories"
              :key="cat.categoryId"
              :value="cat.categoryId"
            >
              {{ cat.categoryName }}
            </option>
          </select>
          <select v-model="newCategory.status" class="form-select mb-3">
            <option value="1">Đang bán</option>
            <option value="0">Ngừng bán</option>
          </select>
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success">Lưu</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Sửa -->
  <div class="modal fade" id="editCategoryModal" tabindex="-1">
    <div class="modal-dialog">
      <form @submit.prevent="updateCategory" class="modal-content">
        <div class="modal-header bg-warning text-white">
          <h5 class="modal-title">✏️ Sửa Danh mục</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            id="editCategoryModalClose"
          ></button>
        </div>
        <div class="modal-body">
          <input v-model="editCategory.categoryName" class="form-control mb-3" />
          <select v-model="editCategory.parentId" class="form-select mb-3">
            <option :value="null">-- Không có --</option>
            <option
              v-for="cat in parentCategories"
              :key="cat.categoryId"
              :value="cat.categoryId"
            >
              {{ cat.categoryName }}
            </option>
          </select>
          <select v-model="editCategory.status" class="form-select mb-3">
            <option value="1">Đang bán</option>
            <option value="0">Ngừng bán</option>
          </select>
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-warning text-white">Cập nhật</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
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
  width: 5%;
}
.custom-table th:nth-child(2) {
  width: 45%;
}
.custom-table th:nth-child(3) {
  width: 15%;
}
.custom-table th:nth-child(4) {
  width: 15%;
}
.custom-table th:nth-child(5) {
  width: 20%;
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
