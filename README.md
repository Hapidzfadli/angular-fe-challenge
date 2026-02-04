# Employee Management System

A mini backoffice application for managing employee data, built with Angular 17.

## Features

- **Login Page**: Authentication with hardcoded credentials
- **Employee List**: Table with 120 dummy employees
  - Pagination with configurable page size (10, 25, 50, 100)
  - Multi-column sorting
  - Search with 2 parameters using AND rule
  - Edit and Delete actions with color-coded notifications
- **Add Employee**: Form with full validation
- **Edit Employee**: Pre-filled form for updating employee data
- **Employee Detail**: Formatted display with Rupiah currency format
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- Angular 17
- Bootstrap 5
- SCSS
- TypeScript

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd employee-management
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm start
```

Open your browser and navigate to `http://localhost:4200`

## Login Credentials

| Username | Password |
|----------|----------|
| admin | admin123 |
| user | user123 |

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/employee-management` directory.

## Project Structure

```
src/app/
├── core/                   # Singleton services and guards
│   ├── guards/
│   │   └── auth.guard.ts
│   └── services/
│       ├── auth.service.ts
│       └── storage.service.ts
│
├── shared/                 # Reusable components, pipes, directives
│   ├── components/
│   │   ├── notification/
│   │   ├── confirm-dialog/
│   │   ├── pagination/
│   │   └── searchable-dropdown/
│   ├── pipes/
│   │   ├── rupiah.pipe.ts
│   │   └── date-format.pipe.ts
│   ├── directives/
│   │   └── numeric-only.directive.ts
│   ├── models/
│   └── services/
│       └── notification.service.ts
│
├── features/               # Feature modules
│   ├── auth/
│   │   └── login/
│   └── employee/
│       ├── employee-list/
│       ├── employee-add/
│       ├── employee-edit/
│       ├── employee-detail/
│       └── services/
│
├── layout/                 # Layout components
│   ├── header/
│   ├── sidebar/
│   └── main-layout/
│
└── data/                   # Dummy data
    ├── employees.data.ts   # 120 employee records
    ├── groups.data.ts      # 10 groups
    └── users.data.ts       # Login credentials
```

## Key Features Implementation

### Pagination
- Configurable items per page: 10, 25, 50, 100
- Navigation with first, previous, next, last buttons
- Display of current range and total items

### Sorting
- Click on column headers to sort
- Multi-column sorting supported
- Toggle between ascending, descending, and no sort

### Search
- Two search fields with AND rule
- Searchable fields: First Name, Last Name, Username, Email, Status, Group
- Real-time filtering

### Form Validation
- All fields are mandatory
- Email format validation
- Birth date cannot be in the future
- Salary must be numeric and greater than 0
- Group selection with searchable dropdown

### State Preservation
- Search parameters are preserved when navigating to detail page
- Uses sessionStorage for state persistence

### Notifications
- Success (green): Save operations
- Warning (yellow): Edit actions
- Error (red): Delete actions

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Desktop (≥992px) | Fixed sidebar, full table |
| Tablet (768-991px) | Collapsible sidebar, horizontal scroll table |
| Mobile (<768px) | Overlay sidebar, card-based list |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run watch` | Build and watch for changes |
