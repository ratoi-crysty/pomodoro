# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pomodoro is a desktop Pomodoro timer application built with Angular and Tauri. It provides a focused timer experience with system tray integration and desktop notifications when timers expire.

### Key Features

- **Pomodoro Timer** - Configurable work/break timer with start, pause, and reset controls
- **System Tray Icon** - Shows current timer status in the system tray
- **Desktop Notifications** - Alerts when a timer session completes

## Tech Stack

- **Frontend**: Angular 20 (standalone components), TypeScript 5.8, RxJS
- **Desktop Runtime**: Tauri 2 (Rust backend for native functionality)
- **Build**: Angular CLI, Yarn, Rspack bundler
- **Styling**: SCSS (configured in angular.json)

## Project Structure

```
pomodoro/
├── src/                       # Angular frontend source
│   ├── app/                   # Angular application code
│   │   ├── app.component.ts   # Root component
│   │   ├── app.config.ts      # Application configuration
│   │   └── app.routes.ts      # Routing configuration
│   ├── assets/                # Static assets
│   ├── index.html             # Main HTML entry
│   ├── main.ts                # Angular bootstrap
│   └── styles.css             # Global styles
├── src-tauri/                 # Tauri / Rust backend
│   ├── src/
│   │   ├── main.rs            # Tauri entry point
│   │   └── lib.rs             # Tauri commands and native logic
│   ├── Cargo.toml             # Rust dependencies
│   ├── tauri.conf.json        # Tauri configuration
│   ├── capabilities/          # Tauri security permissions
│   └── icons/                 # Application icons
├── angular.json               # Angular CLI configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # NPM/Yarn dependencies
└── CLAUDE.md
```

## Common Commands

```bash
yarn install              # Install dependencies
yarn start                # Angular dev server (port 1420)
yarn build                # Production build
yarn tauri dev            # Run Tauri desktop app in dev mode
yarn tauri build          # Build Tauri desktop app for distribution
```

## Architecture

### Frontend (Angular)

The Angular frontend uses standalone components with signal-based state management:

```typescript
// Signal state mutations
this.state.update((s) => ({ ...s, loading: false }));

// Component props using input()/output()
readonly duration = input.required<number>();
readonly timerComplete = output<void>();
```

### Desktop (Tauri / Rust)

The Rust backend handles native functionality:

- System tray icon and menu
- Desktop notifications on timer expiry
- Window management (minimize to tray, restore)

Communication between Angular and Rust uses Tauri's `invoke` API:

```typescript
import { invoke } from '@tauri-apps/api/core';
await invoke<string>('command_name', { param: value });
```

## Code Style

- TypeScript strict mode enabled
- Angular: Standalone components only (no NgModules)
- Angular: Use `inject()` for dependency injection
- Angular: Use Signal Forms, not Reactive Forms or HTML forms
- Naming convention: `.<file-type>` suffix (e.g., `timer.component.ts`, `pomodoro.service.ts`)
- Always use the frontend-design skill for creating/updating frontend UI
- Use seperated file for HTML and SCSS

## TypeScript Standards

### Strict Mode Enforcement

1. **Never use `any`** - Use `unknown` when the type is truly unknown:

   ```typescript
   // Bad
   function parseData(data: any): void {}

   // Good
   function parseData(data: unknown): void {
     if (typeof data === 'string') {
       // Type narrowing
     }
   }
   ```

2. **Explicit Function/Method Typing** - All parameters and return types must be declared:

   ```typescript
   // Bad
   function formatTime(seconds) {
     return `${Math.floor(seconds / 60)}:${seconds % 60}`;
   }

   // Good
   function formatTime(seconds: number): string {
     return `${Math.floor(seconds / 60)}:${seconds % 60}`;
   }
   ```

3. **Explicit Variable Declarations** - Variables receiving values from functions/props must have explicit types:

   ```typescript
   // Bad
   const time = formatTime(1500);

   // Good
   const time: string = formatTime(1500);
   ```

4. **Prefer Named Types** - Use explicit typings instead of inline object types:

   ```typescript
   // Bad
   function getTimerState(): { running: boolean; remaining: number } { ... }

   // Good
   interface TimerState {
     running: boolean;
     remaining: number;
   }
   function getTimerState(): TimerState { ... }
   ```

## Angular Component Architecture

### Component Size and Responsibility

- Keep components small and focused on a single responsibility
- Split large components into smaller, reusable pieces
- Aim for components under 200 lines of code

### Smart-Dumb Component Pattern

**Dumb Components (Presentational):**

- Handle UI rendering and UI-specific logic only
- Manage internal UI state via signals (e.g., button hover state)
- Handle UI events (click, change)
- **Not allowed**: Direct injection of data services, business logic, data fetching

**Smart Components (Container):**

- Inject services and manage data fetching
- Coordinate between multiple dumb components
- Handle business logic and state management

### Minimize Custom CSS

- Use component-scoped styles via `:host` and encapsulated SCSS
- Only create custom SCSS for:
  - Custom animations
  - Complex layouts not covered by Flexbox/Grid
  - Specific design requirements

### Design

- The design should mainly be focused on dark theme
- The theme should be a blueish tone
