<template>
  <div class="container">
    <h2 class="my-4 text-secondary">{{ action.header }}</h2>
    <div class="row gx-2">
      <div class="col-12 col-md-6 card border-light p-3 me-md-3 mb-3 d-flex flex-column justify-content-between">
        <div class="row mb-3 pt-3 pb-5">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="first_name">First Name</label>
              <input
                type="text"
                v-model="first_name"
                id="first_name"
                placeholder="Enter first name"
                required
                class="form-control"
              />
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="last_name">Last Name</label>
              <input
                type="text"
                v-model="last_name"
                id="last_name"
                placeholder="Enter last name"
                required
                class="form-control"
              />
            </div>
          </div>
        </div>
        <button @click="isEditMode ? updateUser() : addUser()" class="btn btn-success" style="align-self: flex-start;">
          {{ action.saveButton }}
        </button>
      </div>
      <div class="col-12 col-md-4 card border-light p-3 pt-4 d-flex flex-column justify-content-between avatar-section"> <!-- Avatar Section -->
        <img :src="avatar" alt="Avatar" class="avatar mb-5 mx-auto" />
        <button @click="uploadAvatar" class="btn change-picture-btn mx-auto">
          <i class="bi bi-camera"></i> {{ action.avatarButton }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, defineProps, onMounted } from 'vue';
import { addUser as addUserApi, fetchUserById, updateUser as updateUserApi } from '../api/api'; // Import API function
import { useRouter } from 'vue-router';

const props = defineProps({ 
  action: {
    type: String,
    default: 'add'
  },
  id: {
    type: String
  }
})

const router = useRouter();

const first_name = ref('');
const last_name = ref('');
const avatarURL = ref('');

const isEditMode = computed(() => props.action === 'edit')
const action = reactive({
  header: isEditMode.value ? 'Edit User' : 'Add User',
  saveButton: isEditMode.value ? 'Update Details' : 'Save Details',
  avatarButton: isEditMode.value ? 'Change Picture' : 'Choose Picture'
})
const avatar = computed(() => {
  const userAvatar = isEditMode.value
    ? avatarURL.value 
    : require('@/assets/av.png')

  return userAvatar
})

const fetchUser = async () => {
  try {
    const user = await fetchUserById(props.id);
    first_name.value = user.first_name;
    last_name.value = user.last_name;
    avatarURL.value = user.avatar; // Use the user's avatar if available
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

const addUser = async () => {
  try {
    await addUserApi({ first_name: first_name.value, last_name: last_name.value, avatar: avatarURL.value });
    router.push('/'); // Redirect to user list after adding
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

const updateUser = async () => {
  try {
    await updateUserApi(props.id, {
      first_name: first_name.value,
      last_name: last_name.value,
      avatar: avatarURL.value
    });

    router.push('/'); // Redirect to user list after updating
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const uploadAvatar = () => {
  // Logic for uploading or changing the avatar
  // This could open a file input or similar
};

onMounted(() => {
  if (isEditMode.value) fetchUser() 
});
</script>

<style scoped>
.container {
  padding: 20px;
  border-radius: 10px;
}
.row.equal-height {
  display: flex;
  flex-wrap: wrap;
}
.card {
  border-radius: 10px;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 230px;
}
.avatar-section {
  padding-top: 20px;
}
.form-group {
  margin-bottom: 20px;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.mb-3 {
  margin-bottom: 15px;
}
.change-picture-btn {
  background-color: transparent;
  border: 1px solid #6c757d; /* Dark grey border */
  color: #6c757d; /* Dark grey text */
  padding: 5px 10px; /* Restore original size */
  /* font-size: 1rem; */
  width: 100%;
}
.change-picture-btn:hover {
  background-color: rgba(108, 117, 125, 0.1); /* Slight grey background on hover */
}
</style>
