<template>
  <div class="h-screen flex flex-col text-black">
    <header class="w-full bg-blue-600 p-4 flex justify-between items-center">
      <img :src="vueLogo" alt="Vue Logo" class="w-12 h-12">
      <h2 class="text-white text-2xl font-bold">TO-DO LIST!</h2>
      <nav>
        <ul class="flex space-x-4">
          <li v-if="isAuthenticated" class="flex space-x-4">
            <router-link to="/" class="nav-link">To-Do</router-link>
            <router-link to="/done" class="nav-link">Done List</router-link>
          </li>
          <li>
            <button v-if="isAuthenticated" @click="logout" class="nav-link">LogOut</button>
            <div v-else class="flex space-x-2">
              <router-link to="/login" class="nav-link">LogIn</router-link>
              <router-link to="/register" class="nav-link">Register</router-link>
            </div>
          </li>
        </ul>
      </nav>
    </header>
    <main class="flex-grow p-5">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition mode="out-in">
            <Suspense timeout="0">
              <template #default>
                <!-- main content -->
                <component :is="Component"></component>
              </template>
              <template #fallback>
                <!-- loading state -->
                <h2>Loading ....</h2>
              </template>
            </Suspense>
          </Transition>
        </template>
      </RouterView>
    </main>
    <footer class="w-full bg-blue-600 p-4 text-center text-white">
      <p>&copy; 2024 Ndraw.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { vueLogo } from '@/assets';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const logout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.error('Logout failed', error);
  }
};
</script>

<style scoped>
.nav-link {
  @apply text-white bg-blue-500 px-4 py-2 rounded-lg;
  text-align: center;
}
</style>
