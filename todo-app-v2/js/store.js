/**
 * Store - Central state management (inspired by Redux/Flux pattern)
 * Manages the application state and notifies subscribers of changes.
 */
export class Store {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.listeners = [];
        this.state = this.loadState();
    }

    getState() {
        return { ...this.state, todos: [...this.state.todos] };
    }

    getTodos() {
        return [...this.state.todos];
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    dispatch(action) {
        this.state = this.reduce(this.state, action);
        this.persist();
        this.notify();
    }

    reduce(state, action) {
        switch (action.type) {
            case 'ADD_TODO':
                return {
                    ...state,
                    todos: [
                        ...state.todos,
                        {
                            id: this.generateId(),
                            text: action.payload.text,
                            completed: false,
                            priority: action.payload.priority || 'medium',
                            category: action.payload.category || 'general',
                            createdAt: Date.now(),
                            order: state.todos.length
                        }
                    ]
                };

            case 'TOGGLE_TODO':
                return {
                    ...state,
                    todos: state.todos.map(todo =>
                        todo.id === action.payload.id
                            ? { ...todo, completed: !todo.completed }
                            : todo
                    )
                };

            case 'DELETE_TODO':
                return {
                    ...state,
                    todos: state.todos.filter(todo => todo.id !== action.payload.id)
                };

            case 'EDIT_TODO':
                return {
                    ...state,
                    todos: state.todos.map(todo =>
                        todo.id === action.payload.id
                            ? { ...todo, text: action.payload.text }
                            : todo
                    )
                };

            case 'REORDER_TODOS':
                return {
                    ...state,
                    todos: action.payload.todos
                };

            case 'CLEAR_COMPLETED':
                return {
                    ...state,
                    todos: state.todos.filter(todo => !todo.completed)
                };

            default:
                return state;
        }
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    persist() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (e) {
            // Storage not available
        }
    }

    loadState() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { todos: Array.isArray(parsed.todos) ? parsed.todos : [] };
            }
        } catch (e) {
            // Storage not available or corrupted
        }
        return { todos: [] };
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }
}
