const todoList = document.getElementById('todo-list');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

const taskModal = document.getElementById('task-modal');
const modalClose = document.getElementById('modal-close');

const detailTitle = document.getElementById('detail-title');
const detailStatus = document.getElementById('detail-status');
const detailId = document.getElementById('detail-id');
const detailUser = document.getElementById('detail-user');
const detailName = document.getElementById('detail-name');
const detailEmail = document.getElementById('detail-email');

const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');

let allTodos = [];

async function loadUser(userId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

    if (!response.ok) {
        throw new Error('Не удалось загрузить пользователя');
    }

    return await response.json();
}

async function loadTodos() {
    loading.style.display = 'block';
    error.style.display = 'none';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');

        if (!response.ok) {
            throw new Error('Не удалось загрузить задачи');
        }

        const todos = await response.json();
        allTodos = todos;

        loading.style.display = 'none';
        filterTodos();
    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

function openModal() {
    taskModal.classList.add('modal--open');
}

function closeModal() {
    taskModal.classList.remove('modal--open');
}

function renderTodos(todos) {
    todoList.replaceChildren();

    todos.forEach(todo => {
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

        const detailsButton = document.createElement('button');
        detailsButton.classList.add('task__button');
        detailsButton.textContent = 'Подробнее';

        detailsButton.addEventListener('click', async (event) => {
            event.stopPropagation();

            detailTitle.textContent = `Задача: ${todo.title}`;
            detailStatus.textContent = `Статус: ${todo.completed ? 'Выполнена' : 'Не выполнена'}`;
            detailId.textContent = `ID задачи: ${todo.id}`;
            detailUser.textContent = `Пользователь: ${todo.userId}`;

            try {
                const userData = await loadUser(todo.userId);
                detailName.textContent = `Имя: ${userData.name}`;
                detailEmail.textContent = `Email: ${userData.email}`;
            } catch (err) {
                detailName.textContent = 'Имя: ошибка загрузки';
                detailEmail.textContent = 'Email: ошибка загрузки';
            }

            openModal();
        });

        todoItem.append(todoTitle, status, user, detailsButton);
        todoList.appendChild(todoItem);
    });
}

function filterTodos() {
    const query = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    let filteredTodos = allTodos.filter(todo =>
        todo.title.toLowerCase().includes(query)
    );

    if (status === 'done') {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
    } else if (status === 'not-done') {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
    }

    renderTodos(filteredTodos.slice(0, 15));
}

searchInput.addEventListener('input', filterTodos);
statusFilter.addEventListener('change', filterTodos);

modalClose.addEventListener('click', closeModal);

taskModal.addEventListener('click', (event) => {
    if (event.target === taskModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

loadTodos();