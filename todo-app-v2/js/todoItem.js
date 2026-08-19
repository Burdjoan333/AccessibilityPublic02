/**
 * TodoItem Component - Renders a single todo item
 * Handles individual item interactions: toggle, delete, edit, drag
 */
export class TodoItem {
    constructor(todo, handlers) {
        this.todo = todo;
        this.handlers = handlers;
        this.element = null;
        this.isEditing = false;
    }

    render() {
        const li = document.createElement('li');
        li.className = 'todo-item' + (this.todo.completed ? ' completed' : '');
        li.dataset.id = this.todo.id;
        li.dataset.priority = this.todo.priority;
        li.draggable = true;
        li.setAttribute('role', 'listitem');

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = this.todo.completed;
        checkbox.setAttribute('aria-label',
            'Mark "' + this.todo.text + '" as ' + (this.todo.completed ? 'incomplete' : 'complete')
        );
        checkbox.addEventListener('change', () => {
            this.handlers.onToggle(this.todo.id);
        });

        // Content wrapper
        const content = document.createElement('div');
        content.className = 'todo-content';

        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = this.todo.text;

        // Double-click to edit
        text.addEventListener('dblclick', () => {
            this.startEditing(li, text);
        });

        const meta = document.createElement('div');
        meta.className = 'todo-meta';

        if (this.todo.category && this.todo.category !== 'general') {
            const categoryBadge = document.createElement('span');
            categoryBadge.className = 'todo-badge badge-category';
            categoryBadge.textContent = this.todo.category;
            meta.appendChild(categoryBadge);
        }

        const dateBadge = document.createElement('span');
        dateBadge.className = 'todo-badge badge-date';
        dateBadge.textContent = this.formatDate(this.todo.createdAt);
        meta.appendChild(dateBadge);

        content.appendChild(text);
        content.appendChild(meta);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-action btn-edit';
        editBtn.innerHTML = '&#9998;';
        editBtn.setAttribute('aria-label', 'Edit "' + this.todo.text + '"');
        editBtn.addEventListener('click', () => {
            this.startEditing(li, text);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-action btn-delete';
        deleteBtn.innerHTML = '&#10005;';
        deleteBtn.setAttribute('aria-label', 'Delete "' + this.todo.text + '"');
        deleteBtn.addEventListener('click', () => {
            li.classList.add('removing');
            setTimeout(() => {
                this.handlers.onDelete(this.todo.id);
            }, 280);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(actions);

        // Drag events
        this.attachDragEvents(li);

        this.element = li;
        return li;
    }

    startEditing(li, textEl) {
        if (this.isEditing) return;
        this.isEditing = true;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'todo-input';
        input.value = this.todo.text;
        input.style.fontSize = '0.95rem';
        input.style.padding = '0.25rem 0.5rem';

        textEl.replaceWith(input);
        input.focus();
        input.select();

        const finishEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== this.todo.text) {
                this.handlers.onEdit(this.todo.id, newText);
            } else {
                input.replaceWith(textEl);
                this.isEditing = false;
            }
        };

        input.addEventListener('blur', finishEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                input.blur();
            } else if (e.key === 'Escape') {
                input.value = this.todo.text;
                input.blur();
            }
        });
    }

    attachDragEvents(li) {
        li.addEventListener('dragstart', (e) => {
            li.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.todo.id);
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            li.classList.add('drag-over');
        });

        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over');
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.classList.remove('drag-over');
            const draggedId = e.dataTransfer.getData('text/plain');
            if (draggedId !== this.todo.id) {
                this.handlers.onReorder(draggedId, this.todo.id);
            }
        });
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}
