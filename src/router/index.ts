// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getActivePinia } from 'pinia';
import { defineAsyncComponent } from 'vue';

const routes = [
  { path: '/', name: 'home', component: ()=> defineAsyncComponent(()=>import('@/views/HomeView.vue')), meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: ()=> import('@/components/Login.vue') },
  { path: '/register', name: 'register', component: ()=> import('@/components/Register.vue') },
  { path: '/done', name: 'done', component: ()=> defineAsyncComponent(()=>import('@/views/ListDoneView.vue')), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const pinia = getActivePinia();
  if (pinia) {
    const authStore = useAuthStore(pinia);

    // Refresh the token if it's present in cookies but not in the store
    if (authStore.token && !authStore.isAuthenticated) {
      try {
        await authStore.refreshToken();
        await authStore.fetchUser();
      } catch (error) {
        authStore.clearToken();
        next({ name: 'login' });
        return;
      }
    }

    // Check if the route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
