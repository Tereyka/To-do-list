const todoList = document.getElementById('todo-list');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

async function loadTodos() {
    loading.style.display = 'block';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const todos = await response.json();
        loading.style.display = 'none';
        const todoItems = todos.slice(0, 15);
        todoItems.forEach(todo => {
            const todoitem = document.createElement('li');
            todoitem.textContent = todo.title;
            todoList.appendChild(todoitem);
        });

    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

loadTodos();