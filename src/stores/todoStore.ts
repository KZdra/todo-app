import { defineStore } from 'pinia';
import { reactive, ref, toRefs } from 'vue';
import Swal from 'sweetalert2';

interface Todo {
  title: string;
  done: boolean;
}

export const useTodoStore = defineStore('todo', () => {
  const state = reactive({
    todos: [] as Todo[],
    newTodo: ''
  });



  const addTodo = () => {
    if (state.newTodo.trim() === '') {
      Swal.fire({
        title: "Empty Todo",
        text: "Todo cannot be empty!",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    let duplicate = state.todos.find(todo => todo.title === state.newTodo.trim());

    if (duplicate) {
      if (duplicate.done) {
        state.todos.push({ title: state.newTodo.trim(), done: false });
        state.newTodo = '';
      } else {
        Swal.fire({
          title: "Duplicate Todo",
          text: "This todo already exists and is marked as done!",
          icon: "warning",
          confirmButtonText: "OK"
        });
      }
    } else {
      state.todos.push({ title: state.newTodo.trim(), done: false });
      state.newTodo = '';
    }
  };

  const deleteAllUndoneTodos = () => {
    state.todos = state.todos.filter(todo => todo.done);
  };

  const deleteAllDoneTodos = () => {
    state.todos = state.todos.filter(todo => !todo.done);
  };

  const markDone = (index: number) => {
    state.todos[index].done = !state.todos[index].done;
  };

  const deleteTodo = (index: number) => {
    state.todos.splice(index, 1);
  };

  return {
    ...toRefs(state),
    addTodo,
    deleteAllUndoneTodos,
    deleteAllDoneTodos,
    markDone,
    deleteTodo
  };
}, {
  persist: true,
});
