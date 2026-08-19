/**
 * App Entry Point - Initializes the application
 * Wires together the Store and TodoList components.
 */
import { Store } from './store.js';
import { TodoList } from './todoList.js';

class App {
    constructor() {
        this.store = new Store('todo-app-v2');
        this.elements = this.getElements();
        this.todoList = new TodoList(this.store, this.elements);
        this.setupForm();
        this.setupThemeToggle();
        this.loadTheme();
        this.todoList.render();
    }

    getElements() {
        return {
            form: document.getElementById('todo-form'),
            input: document.getElementById('todo-input'),
            prioritySelect: document.getElementById('priority-select'),
            categorySelect: document.getElementById('category-select'),
            todoList: document.getElementById('todo-list'),
            emptyState: document.getElementById('empty-state'),
            filterButtons: document.querySelectorAll('.btn-filter'),
            sortSelect: document.getElementById('sort-select'),
            searchInput: document.getElementById('search-input'),
            clearCompleted: document.getElementById('clear-completed'),
            stats: document.getElementById('stats'),
            themeToggle: document.getElementById('theme-toggle'),
            themeIcon: document.querySelector('.theme-icon')
        };
    }

    setupForm() {
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = this.elements.input.value.trim();
            if (!text) return;

            this.store.dispatch({
                type: 'ADD_TODO',
                payload: {
                    text,
                    priority: this.elements.prioritySelect.value,
                    category: this.elements.categorySelect.value
                }
            });

            this.elements.input.value = '';
            this.elements.input.focus();
        });
    }

    setupThemeToggle() {
        this.elements.themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            this.elements.themeIcon.textContent = newTheme === 'dark' ? '\u263E' : '\u2600';

            try {
                localStorage.setItem('todo-v2-theme', newTheme);
            } catch (e) {
                // Storage not available
            }
        });
    }

    loadTheme() {
        try {
            const savedTheme = localStorage.getItem('todo-v2-theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
                this.elements.themeIcon.textContent = savedTheme === 'dark' ? '\u263E' : '\u2600';
            }
        } catch (e) {
            // Storage not available
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
