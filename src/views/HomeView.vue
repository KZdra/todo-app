<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import { useAuthStore } from '../stores/auth';
import TodoCard from '../components/TodoCards.vue';
import Swal from 'sweetalert2';
import { plusIcon, deleteIcon } from '../assets';

const todoStore = useTodoStore();
const authStore = useAuthStore();


interface User {
  name?: string;
}

const user = authStore.user as User;

const name = ref(user?.name || '');
const setName = ref(name.value === user?.name);

const addTodo = (event: Event) => {
  event.preventDefault();
  todoStore.addTodo();
};

const deleteAllTodos = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    Swal.fire('Deleted!', 'Your Todo has been cleared!', 'success');
    todoStore.deleteAllUndoneTodos();
  }
};

</script>

<template>
  <main class="p-4">
    <!-- Greetings -->
    <div class="greetings mb-4">
      <h2 class="text-2xl font-bold text-gray-500">
        Hello,
        <input
          type="text"
          v-model="name"
          placeholder="Name Here"
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        />
      </h2>
    </div>

    <!-- Add ToDo Form -->
    <div class="mt-2">
      <form @submit="addTodo" class="w-full max-w-sm">
        <h1 class="text-xl text-gray-300 mb-4">What's on your mind?</h1>
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-2/3">
            <input
              v-model="todoStore.newTodo"
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-full-name"
              type="text"
              placeholder="Enter new todo"
            />
          </div>
        </div>
        <div class="md:flex md:items-center">
          <div class="md:w-2/3">
            <button
              class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              <img :src="plusIcon" alt=""> Add
            </button>
            <button
              type="button"
              @click="deleteAllTodos"
              class="ml-2 shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            >
              <img class="ml-3" :src="deleteIcon" alt=""> Delete All
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- ToDo Cards -->
    <section class="row flex flex-wrap gap-4 p-4">
      <template v-if="todoStore.todos.filter(todo => !todo.done).length > 0">
        <TodoCard
          v-for="(todo, filteredIndex) in todoStore.todos.filter(todo => !todo.done)"
          :key="todo.id"
          :activity="todo.title"
          :done="todo.done"
          :index="todoStore.todos.indexOf(todo)"
          @done="todoStore.markDone(todoStore.todos.indexOf(todo))"
          @delete="todoStore.deleteTodo(todoStore.todos.indexOf(todo))"
        />
      </template>
      <template v-else>
        <h2 class="text-2xl font-bold mt-2 text-center text-red-500">List is empty</h2>
      </template>
    </section>
  </main>
</template>
