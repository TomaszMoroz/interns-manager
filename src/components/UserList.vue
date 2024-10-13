<template>
  <div class="container">
    <h2 class="my-4 text-secondary">User List</h2>
    <div class="table-wrapper">
      <!-- Search Input Group with light grey border-bottom -->
      <div class="search-section d-flex justify-content-between align-items-center mb-5">
        <!-- Search Input Group -->
        <div class="input-group" style="width: 35%;">
          <input
            type="text"
            class="form-control search-input"
            placeholder="Search for users..."
            v-model="searchTerm"
          />
          <!-- Search Icon on the right edge of the input -->
          <span class="input-group-text search-icon">
            <i class="bi bi-search"></i>
          </span>
        </div>

        <!-- Add User Button -->
        <button class="btn btn-success" @click="addUser">
          <i class="bi bi-plus me-1"></i> Add User
        </button>
      </div>

      <!-- User List Table -->
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td class="col-sm-10 border-0">
              <img :src="user.avatar || defaultAvatar" class="rounded-circle me-2" width="40" />
              {{ user.first_name }} {{ user.last_name }}
            </td>
            <td class="border-0">
              <router-link :to="{ name: 'EditUser', params: { id: user.id }}">
                <button class="btn btn-md me-1 border-0 text-secondary" @click="editUser(user.id)">
                  <i class="bi bi-pencil-square"></i>
                </button>
              </router-link>
              <button class="btn btn-md border-0 text-secondary" @click="handleDeleteUser(user.id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav>
      <ul class="pagination justify-content-start">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="previousPage" aria-label="Previous">
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>
        <li
          class="page-item"
          v-for="page in visiblePages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage" aria-label="Next">
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>

    <WarningDialog
      :visible="showDialog"
      @cancel="showDialog = false"
      @confirm="deleteUser(currentUserId)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchUsers, deleteUser as deleteUserApi } from '../api/api'; // Import API functions
import { useRouter } from 'vue-router';
import WarningDialog from './dialogs/WarningDialog';

const itemsPerPage = 10;
const defaultAvatar = 'https://via.placeholder.com/100';

const router = useRouter();
const searchTerm = ref('');
const users = ref([]);
const loading = ref(false)
const currentPage = ref(1);
const showDialog = ref(false);
const currentUserId = ref('');

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));

// Calculate visible pages (limit to 20 buttons)
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const start = Math.max(1, currentPage.value - 10);
  const end = Math.min(total, start + 19);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Mock function for testing purposes
// const mockUsers = () => {
//   const mockUserList = [];
//   for (let i = 1; i <= 200; i++) {
//     mockUserList.push({
//       id: i,
//       first_name: `UserFirst${i}`,
//       last_name: `UserLast${i}`,
//       avatar: `https://i.pravatar.cc/150?img=${i % 70}`, // Placeholder avatars
//     });
//   }
//   return mockUserList;
// };

// Load users
const fetchUserList = async () => {
  loading.value = true; // Start loading, TODO display spinner or progress bar on loading
  try {
    users.value = await fetchUsers(); // Fetch users from API
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false; // End loading
  }
};

const filteredUsers = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  return users.value.filter((user) =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(lowerSearchTerm)
  );
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const addUser = () => {
  router.push('add-user');
};

const editUser = (id) => {
  router.push(`/edit-user/${id}`);
};

const handleDeleteUser = (id) => {
  currentUserId.value = id;
  showDialog.value = true;
};

const deleteUser = async (id) => {
  try {
    await deleteUserApi(id); // Call the delete user API
    users.value = await fetchUsers(); // Refresh the user list after deletion
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    showDialog.value = false;
  }
};

onMounted(fetchUserList);
</script>

<style scoped>
.table-wrapper {
  padding: 20px 15px;
  background: #fff;
}

/* Striped table styles */
.table-striped tbody tr:nth-of-type(odd) {
  background-color: #F4F7F9;
}
.table-striped tbody tr:nth-of-type(even) {
  background-color: #fff;
}

/* Pagination styles */
.pagination {
  margin-top: 20px;
}

.page-item.active .page-link {
  background-color: #28a745;
  color: white;
}

.page-link {
  color: #28a745;
  padding: 4px 8px;
  font-size: 0.85rem;
  border-radius: 4px;
}

.page-item.disabled .page-link {
  color: gray;
  pointer-events: none;
}

.page-link:hover {
  background-color: #218838;
  color: white;
}

/* Custom styles for the search input and icon */
.search-input {
  background-color: #F4F7F9; /* Light grey background */
  border: none; /* Remove border */
}

.input-group-text.search-icon {
  background-color: #F4F7F9; /* Same background as input */
  border: none; /* Remove border */
  padding-left: 8px; /* Slight padding for the icon */
  padding-right: 8px; /* Slight padding for the icon */
}

/* Light grey border bottom for the search section */
.search-section {
  border-bottom: 1px solid #F4F7F9;
  padding-bottom: 20px;
}
</style>
