const todoList = document.getElementById('todo-list');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const taskDetails = document.getElementById('task-details');
const detailTitle = document.getElementById('detail-title');
const detailStatus = document.getElementById('detail-status');
const detailId = document.getElementById('detail-id');
const detailUser = document.getElementById('detail-user');
const detailName = document.getElementById('detail-name');
const detailEmail = document.getElementById('detail-email');

async function loadUser(userId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const user = await response.json();
    return user;
}

async function loadTodos() {
    loading.style.display = 'block';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const todos = await response.json();
        loading.style.display = 'none';
        const todoItems = todos.slice(0, 15);
        todoList.replaceChildren();
        todoItems.forEach(todo => {

            const todoItem = document.createElement('li');
            todoItem.classList.add('tasks__item');

            const todoTitle = document.createElement('p');
            todoTitle.classList.add('task__title');
            todoTitle.textContent = todo.title;

            const status = document.createElement('p');
            status.classList.add('task__status');
            status.classList.add(todo.completed ? 'done' : 'not-done');
            status.textContent = todo.completed ? 'Выполнена' : 'Не выполнена';

            const user = document.createElement('p');
            user.classList.add('task__user');
            user.textContent = `Пользователь: ${todo.userId}`;

            todoItem.append(todoTitle, status, user);
            todoList.appendChild(todoItem);

            todoItem.addEventListener('click', async () => {
                detailTitle.textContent = `Задача: ${todo.title}`;
                detailStatus.textContent = `Статус: ${todo.completed ? 'Выполнена' : 'Не выполнена'}`;
                detailId.textContent = `ID задачи: ${todo.id}`;
                detailUser.textContent = `Пользователь: ${todo.userId}`;

                const userData = await loadUser(todo.userId);

                detailName.textContent = `Имя: ${userData.name}`;
                detailEmail.textContent = `Email: ${userData.email}`;

                taskDetails.style.display = 'block';
            });
        });

    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

loadTodos();







