<template>
  <div class="h-screen flex flex-col text-black">
    <header class="w-full bg-blue-600 p-4 flex justify-between items-center">
      <img :src="vueLogo" alt="Vue Logo" class="w-12 h-12" />
      <h2 class="text-white text-2xl font-bold">TO-DO LIST!</h2>
      <nav>
        <ul class="flex space-x-4">
          <li v-if="isAuthenticated" class="flex space-x-4">
            <router-link to="/" class="nav-link">To-Do</router-link>
            <router-link to="/done" class="nav-link">Done List</router-link>
          </li>
          <li>
            <button v-if="isAuthenticated" @click="logout" class="nav-link">
              LogOut
            </button>
            <div v-else class="flex space-x-2">
              <router-link to="/login" class="nav-link">LogIn</router-link>
              <router-link to="/register" class="nav-link"
                >Register</router-link
              >
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
                <div
                  class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
                >
                  <div class="loader"></div>
                </div>
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
import { vueLogo } from "@/assets";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";

const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const logout = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "LOGOUT?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log me out!",
  });

  if (result.isConfirmed) {
    try {
      await authStore.logout();
      Swal.fire({
        title: "SEE YA LATER 8==D",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(https://www.nyan.cat/cats/original.gif)",
        backdrop: `
    rgba(0,0,123,0.4)
    url(https://www.nyan.cat/cats/original.gif)
    left top
    no-repeat
  `,
      });
    } catch (error) {
      console.error("Logout failed", error);
      Swal.fire({
        title: "Error!",
        text: "There was a problem logging out.",
        icon: "error",
      });
    }
  }
};
</script>

<style scoped>
.nav-link {
  @apply text-white bg-blue-500 px-4 py-2 rounded-lg;
  text-align: center;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
