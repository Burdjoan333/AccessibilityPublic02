(function () {
    'use strict';

    // DOM Elements
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const statsEl = document.getElementById('todo-stats');
    const filterButtons = document.querySelectorAll('.btn-filter');

    // State
    let todos = loadTodos();
    let currentFilter = 'all';

    // Initialize
    render();

    // Event Listeners
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            addTodo(text);
            input.value = '';
            input.focus();
        }
    });

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            currentFilter = btn.dataset.filter;
            filterButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            render();
        });
    });

    // Functions
    function addTodo(text) {
        todos.push({
            id: Date.now().toString(),
            text: text,
            completed: false
        });
        saveTodos();
        render();
    }

    function toggleTodo(id) {
        todos = todos.map(function (todo) {
            if (todo.id === id) {
                return { id: todo.id, text: todo.text, completed: !todo.completed };
            }
            return todo;
        });
        saveTodos();
        render();
    }

    function deleteTodo(id) {
        todos = todos.filter(function (todo) {
            return todo.id !== id;
        });
        saveTodos();
        render();
    }

    function getFilteredTodos() {
        switch (currentFilter) {
            case 'active':
                return todos.filter(function (t) { return !t.completed; });
            case 'completed':
                return todos.filter(function (t) { return t.completed; });
            default:
                return todos;
        }
    }

    function render() {
        var filtered = getFilteredTodos();
        todoList.innerHTML = '';

        if (filtered.length === 0) {
            var emptyMsg = document.createElement('li');
            emptyMsg.className = 'todo-item';
            emptyMsg.style.justifyContent = 'center';
            emptyMsg.style.color = '#95a5a6';
            emptyMsg.textContent = currentFilter === 'all'
                ? 'No tasks yet. Add one above!'
                : 'No ' + currentFilter + ' tasks.';
            todoList.appendChild(emptyMsg);
        } else {
            filtered.forEach(function (todo) {
                var li = document.createElement('li');
                li.className = 'todo-item' + (todo.completed ? ' completed' : '');

                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'todo-checkbox';
                checkbox.checked = todo.completed;
                checkbox.setAttribute('aria-label', 'Mark "' + todo.text + '" as ' + (todo.completed ? 'incomplete' : 'complete'));
                checkbox.addEventListener('change', function () { toggleTodo(todo.id); });

                var span = document.createElement('span');
                span.className = 'todo-text';
                span.textContent = todo.text;

                var deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-delete';
                deleteBtn.innerHTML = '&#10005;';
                deleteBtn.setAttribute('aria-label', 'Delete "' + todo.text + '"');
                deleteBtn.addEventListener('click', function () { deleteTodo(todo.id); });

                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);
                todoList.appendChild(li);
            });
        }

        updateStats();
    }

    function updateStats() {
        var total = todos.length;
        var completed = todos.filter(function (t) { return t.completed; }).length;
        var active = total - completed;

        if (total === 0) {
            statsEl.textContent = '';
        } else {
            statsEl.textContent = active + ' item' + (active !== 1 ? 's' : '') + ' remaining, ' +
                completed + ' completed';
        }
    }

    function saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(todos));
        } catch (e) {
            // localStorage not available, silently continue
        }
    }

    function loadTodos() {
        try {
            var stored = localStorage.getItem('todos');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }
})();
