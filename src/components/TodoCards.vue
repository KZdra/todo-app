<script setup lang="ts">
import Swal from 'sweetalert2';

const props = defineProps<{
  activity: string,
  done: boolean,
  index: number // Menambah properti index
}>();

const emits = defineEmits(['done', 'delete']);

function handleDone() {
  emits('done', props.index); // Mengirim index saat menandai selesai
}

async function handleDelete() {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    emits('delete', props.index); // Mengirim index saat menghapus
    Swal.fire(
      'Deleted!',
      'Your activity has been deleted.',
      'success'
    );
  }
}
</script>

<template>
  <div class="w-full sm:w-1/2 lg:w-1/4 bg-white p-4 shadow-lg rounded-lg" :class="{ 'bg-gray-200': props.done }">
  <p class="text-lg font-semibold mb-4" :class="{ 'line-through': props.done }">{{ props.activity }} </p>
    <div class="flex justify-between">
      <button class="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600" @click="handleDone">
        {{ props.done ? 'Undo' : 'Done' }}
      </button>
      <button class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600" @click="handleDelete">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
.bg-gray-200 {
  background-color: #e2e8f0;
}
</style>
