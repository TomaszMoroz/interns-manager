<template>
  <div v-if="visible" class="dialog-overlay">
    <div class="dialog-box">
      <h3 class="dialog-title">Warning</h3>
      <p class="dialog-message">{{ message }}</p>
      <button class="dialog-base-button dialog-cancel-button me-2" @click="cancelDialog">Cancel</button>
      <button class="dialog-base-button dialog-confirm-button" @click="confirmDialog">Confirm</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Props to accept a warning message and visibility state
defineProps({
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  visible: {
    type: Boolean,
    default: false
  }
});

// Emits an event to notify parent component when the dialog is closed
const emit = defineEmits(['cancel', 'confirm']);

const cancelDialog = () => {
  emit('cancel'); // Emits the 'close' event to hide the dialog in parent
};

const confirmDialog = () => {
  emit('confirm')
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.dialog-title {
  color: red;
  margin-bottom: 15px;
}

.dialog-message {
  margin-bottom: 20px;
}

.dialog-base-button {
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.dialog-cancel-button {
  background-color: #6c757d;
}

.dialog-cancel-button:hover {
  background-color: darkred;
}

.dialog-confirm-button {
  background-color: green;
}

.dialog-confirm-button:hover {
  background-color: darkgreen;
}
</style>
