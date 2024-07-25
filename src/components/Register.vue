<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>
        <form @submit.prevent="register" class="space-y-4">
          <input v-model="name" type="text" placeholder="Name" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="email" type="email" placeholder="Email" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input v-model="password" type="password" placeholder="Password" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Register
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const authStore = useAuthStore();
  
  const register = async () => {
    try {
      await authStore.register({ name: name.value, email: email.value, password: password.value });
    } catch (error) {
      console.error('Registration failed', error);
    }
  };
  </script>
  