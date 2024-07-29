import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import Swal from 'sweetalert2';
import axios from '@/utils/axios';

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

export const useTodoStore = defineStore('todo', () => {
  const state = reactive({
    todos: [] as Todo[],
    newTodo: ''
  });

  const getTodos = async () => {
    try {
      const response = await axios.get('/api/auth/todos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data.data;

      state.todos = data.map((item: any) => ({
        id: item.id,
        title: item.activity,
        done: item.done === 1
      }));

    } catch (error) {
      Swal.fire({
        title: "Error",
        text: (error as Error).message,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const addTodo = async () => {
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
        try {
          const response = await axios.post('/api/auth/todos', {
            activity: state.newTodo.trim()
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });

          state.todos.push({ id: response.data.data.id, title: state.newTodo.trim(), done: false });
          state.newTodo = '';
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: (error as Error).message,
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      } else {
        Swal.fire({
          title: "Duplicate Todo",
          text: "This todo already exists and is marked as done!",
          icon: "warning",
          confirmButtonText: "OK"
        });
      }
    } else {
      try {
        const response = await axios.post('/api/auth/todos', {
          activity: state.newTodo.trim()
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        state.todos.push({ id: response.data.data.id, title: state.newTodo.trim(), done: false });
        state.newTodo = '';
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: (error as Error).message,
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    }
  };

  const deleteAllUndoneTodos = async () => {
    const undoneTodos = state.todos.filter(todo => !todo.done);

    try {
      await Promise.all(undoneTodos.map(todo => 
        axios.delete(`/api/auth/todos/${todo.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ));

      state.todos = state.todos.filter(todo => todo.done);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: (error as Error).message,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const deleteAllDoneTodos = async () => {
    const doneTodos = state.todos.filter(todo => todo.done);
    try {
      await Promise.all(doneTodos.map(todo => 
        axios.delete(`/api/auth/todos/${todo.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ));

      state.todos = state.todos.filter(todo => !todo.done);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: (error as Error).message,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const markDone = async (index: number) => {
    const todo = state.todos[index];
    const updatedDoneStatus = !todo.done;
  
    try {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "DONE SIR",
        showConfirmButton: false,
        timer: 1200
      });
  
      await axios.put(`/api/auth/todos/${todo.id}`, {
        done: updatedDoneStatus ? 1 : 0
      });
  
      state.todos[index].done = updatedDoneStatus;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: (error as Error).message,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };
  

  const deleteTodo = async (index: number) => {
    const todo = state.todos[index];

    try {
      await axios.delete(`/api/auth/todos/${todo.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      state.todos.splice(index, 1);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: (error as Error).message,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return {
    ...toRefs(state),
    addTodo,
    deleteAllUndoneTodos,
    deleteAllDoneTodos,
    markDone,
    deleteTodo,
    getTodos
  };
}, {
  persist: true,
});
