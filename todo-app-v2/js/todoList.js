/**
 * TodoList Component - Manages the rendering of the todo list
 * Handles filtering, sorting, searching, and list-level operations.
 */
import { TodoItem } from './todoItem.js';

export class TodoList {
    constructor(store, elements) {
        this.store = store;
        this.elements = elements;
        this.filter = 'all';
        this.sortBy = 'newest';
        this.searchQuery = '';

        this.setupEventListeners();
        this.store.subscribe(() => this.render());
    }

    setupEventListeners() {
        // Filter buttons
        this.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.render();
            });
        });

        // Sort select
        this.elements.sortSelect.addEventListener('change', () => {
            this.sortBy = this.elements.sortSelect.value;
            this.render();
        });

        // Search input
        this.elements.searchInput.addEventListener('input', () => {
            this.searchQuery = this.elements.searchInput.value.toLowerCase().trim();
            this.render();
        });

        // Clear completed
        this.elements.clearCompleted.addEventListener('click', () => {
            this.store.dispatch({ type: 'CLEAR_COMPLETED' });
        });
    }

    getProcessedTodos() {
        let todos = this.store.getTodos();

        // Filter
        switch (this.filter) {
            case 'active':
                todos = todos.filter(t => !t.completed);
                break;
            case 'completed':
                todos = todos.filter(t => t.completed);
                break;
        }

        // Search
        if (this.searchQuery) {
            todos = todos.filter(t =>
                t.text.toLowerCase().includes(this.searchQuery) ||
                t.category.toLowerCase().includes(this.searchQuery)
            );
        }

        // Sort
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        switch (this.sortBy) {
            case 'newest':
                todos.sort((a, b) => b.createdAt - a.createdAt);
                break;
            case 'oldest':
                todos.sort((a, b) => a.createdAt - b.createdAt);
                break;
            case 'priority':
                todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'alphabetical':
                todos.sort((a, b) => a.text.localeCompare(b.text));
                break;
        }

        return todos;
    }

    render() {
        const todos = this.getProcessedTodos();
        const list = this.elements.todoList;
        const emptyState = this.elements.emptyState;

        list.innerHTML = '';

        if (todos.length === 0) {
            emptyState.hidden = false;
            list.hidden = true;
        } else {
            emptyState.hidden = true;
            list.hidden = false;

            todos.forEach(todo => {
                const item = new TodoItem(todo, {
                    onToggle: (id) => this.store.dispatch({ type: 'TOGGLE_TODO', payload: { id } }),
                    onDelete: (id) => this.store.dispatch({ type: 'DELETE_TODO', payload: { id } }),
                    onEdit: (id, text) => this.store.dispatch({ type: 'EDIT_TODO', payload: { id, text } }),
                    onReorder: (draggedId, targetId) => this.handleReorder(draggedId, targetId)
                });
                list.appendChild(item.render());
            });
        }

        this.updateStats();
    }

    handleReorder(draggedId, targetId) {
        const todos = this.store.getTodos();
        const draggedIndex = todos.findIndex(t => t.id === draggedId);
        const targetIndex = todos.findIndex(t => t.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const [dragged] = todos.splice(draggedIndex, 1);
        todos.splice(targetIndex, 0, dragged);

        // Update order property
        const reordered = todos.map((todo, index) => ({ ...todo, order: index }));
        this.store.dispatch({ type: 'REORDER_TODOS', payload: { todos: reordered } });
    }

    updateStats() {
        const allTodos = this.store.getTodos();
        const total = allTodos.length;
        const completed = allTodos.filter(t => t.completed).length;
        const active = total - completed;

        if (total === 0) {
            this.elements.stats.textContent = 'No tasks yet';
            this.elements.clearCompleted.hidden = true;
        } else {
            this.elements.stats.textContent =
                active + ' active, ' + completed + ' completed (' + total + ' total)';
            this.elements.clearCompleted.hidden = completed === 0;
        }
    }
}
