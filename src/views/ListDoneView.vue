<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import TodoCard from '../components/TodoCards.vue';
import Swal from 'sweetalert2';
import { plusIcon, deleteIcon } from '../assets';

const todoStore = useTodoStore();
const newTodo = ref('');


const addTodo = (event: Event) => {
  event.preventDefault();
  todoStore.addTodo();
};

const deleteAllDoneTodos = async () => {
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
    todoStore.deleteAllDoneTodos();
  }
};
</script>
<template>
  <main class="p-4">
    <!-- Greetings -->
    <div class="greetings mb-4">
      <h2 class="text-2xl font-bold text-bl">
        DONE LIST
      </h2>
    </div>

    <!-- Add ToDo Form -->
    <div class="mt-2">
      <form @submit="addTodo" class="w-full max-w-sm">
        
        <div class="md:flex md:items-center">
          <div class="md:w-2/3">
            <button
              type="button"
              @click="deleteAllDoneTodos"
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
      <template v-if="todoStore.todos.filter(todo => todo.done).length > 0">
        <TodoCard
          v-for="(todo, filteredIndex) in todoStore.todos.filter(todo => todo.done)"
          :key="filteredIndex"
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
