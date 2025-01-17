// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import { useAuthStore } from '@/stores/auth';
import { getActivePinia } from 'pinia';
import { defineAsyncComponent } from 'vue';

const routes = [
  { path: '/', name: 'home', component: ()=> defineAsyncComponent(()=>import('@/views/HomeView.vue')), meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
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
    if (to.meta.requiresAuth && !authStore.user) {
      try {
        await authStore.fetchUser();
        next();
      } catch {
        next({ name: 'login' });
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
