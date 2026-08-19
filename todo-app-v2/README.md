# TODO App v2 - Component-Based Architecture

A modern TODO application built with vanilla JavaScript using ES modules and a component-based architecture with centralized state management.

## Features

- **Add tasks** with priority levels (low, medium, high) and categories (general, work, personal, shopping)
- **Edit tasks** inline by double-clicking or using the edit button
- **Mark tasks** as complete/incomplete
- **Delete tasks** with smooth animation
- **Filter** tasks by status (All, Active, Completed)
- **Sort** tasks by newest, oldest, priority, or alphabetically
- **Search** tasks by text or category
- **Drag and drop** to reorder tasks
- **Dark/Light theme** toggle with preference persistence
- **Local storage** persistence
- **Responsive design** for mobile and desktop

## Architecture

This app uses a distinctly different architecture from the v1 app:

- **ES Modules** - Modern import/export syntax for clean code organization
- **Store pattern** - Centralized state management inspired by Redux/Flux
- **Component classes** - TodoList and TodoItem as reusable components
- **Action dispatching** - All state changes go through a reducer
- **Subscriber pattern** - Components subscribe to store changes for automatic re-rendering

### File Structure

```
todo-app-v2/
├── index.html          # Main HTML entry point
├── README.md           # This file
├── styles/
│   └── main.css        # CSS with custom properties for theming
└── js/
    ├── app.js          # Application entry point and initialization
    ├── store.js        # Centralized state management
    ├── todoList.js     # List component (filtering, sorting, rendering)
    └── todoItem.js     # Individual item component (toggle, edit, drag)
```

## How to Run

Open `index.html` in a modern web browser. Since this app uses ES modules, you may need to serve it from a local server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8080
```

Then navigate to `http://localhost:8080` in your browser.

## Key Differences from v1

| Feature | v1 (Root App) | v2 (This App) |
|---------|---------------|----------------|
| Architecture | IIFE, single file | ES Modules, component-based |
| State Management | Simple variables | Store pattern with reducer |
| Styling | Light theme only | Dark/Light theme toggle |
| Features | Basic CRUD + filter | CRUD + filter + sort + search + drag-drop + priority + categories |
| Code Organization | Single JS file | Multiple modules |
| Editing | Not supported | Inline editing |
| Animations | None | Slide-in/fade-out transitions |
