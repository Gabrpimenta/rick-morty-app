# Rick and Morty App (Expo + Skia + Reanimated)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A mobile application built with React Native (Expo) to explore characters and episodes from the Rick and Morty universe, featuring interactive 3D cards, favorites, theme switching, search, and filtering capabilities. This project utilizes modern technologies including Skia for custom drawing and Reanimated/Gesture Handler for interactions.

## Features

* **Browse Characters & Episodes:** View paginated lists of characters and episodes fetched from the [Rick and Morty API](https://rickandmortyapi.com/).
* **Horizontal Pager View:** Navigate through characters and episodes one card at a time using swipe gestures or navigation arrows.
* **Interactive 3D Cards:** Character cards rendered with React Native Skia, featuring a full-image background and a 3D tilt effect controlled by touch gestures (using Reanimated & Gesture Handler). Episode cards are static (by design).
* **Search:** Filter characters and episodes by name using a debounced search input.
* **Advanced Filtering:**
    * Filter characters by Status, Gender, Species, and Type via a filter modal.
    * Filter episodes by episode code (e.g., "S01E01").
* **Favorites System:** Mark characters and episodes as favorites. Favorite status persists locally using SQLite.
* **Favorites Screen:** View all your saved favorite characters and episodes, grouped by type (`SectionList`).
* **Theme Switching:** Toggle between light and dark themes. The selected theme persists locally using SQLite and is managed globally with Redux Toolkit.
* **TypeScript:** Fully typed codebase for better maintainability and developer experience.
* **Clean Architecture:** Adheres to SOLID principles using a feature-driven structure and MVVM pattern (with hooks as ViewModels).

## Tech Stack

* **Framework/Platform:** React Native / Expo SDK (Managed Workflow with Dev Client likely required)
* **Language:** TypeScript
* **UI Rendering & Animation:**
    * React Native Skia (`@shopify/react-native-skia`): For high-performance 2D graphics (custom card rendering).
    * React Native Reanimated (v3): For performant UI thread animations (card 3D tilt).
    * React Native Gesture Handler (v2): For handling touch gestures (card manipulation).
* **State Management:**
    * React Query (`@tanstack/react-query`): Server state management, caching, pagination.
    * Redux Toolkit (`@reduxjs/toolkit`, `react-redux`): Global client state management (primarily for theme).
* **Data Fetching:** Axios
* **Local Persistence:** Expo SQLite (`expo-sqlite` v14+)
* **Navigation:** React Navigation (`@react-navigation/native`, `@react-navigation/bottom-tabs`)
* **Styling:** Styled Components (`styled-components/native`)
* **List View:** FlatList (configured for horizontal paging)
* **Linting/Formatting:** ESLint (with Flat Config - `eslint.config.mjs`), Prettier
* **Testing:** Jest, React Native Testing Library (RNTL)
* **Utilities:** `date-fns` (or `dayjs` - assumed for date formatting), `@react-native-community/netinfo` (for React Query online manager), `cross-env` (for scripts).

## Architecture & Design Patterns

* **MVVM (Model-View-ViewModel):** Implemented using React components/screens (View), custom hooks managing state and logic (ViewModel), and API/Repository services (Model).
* **Feature-Driven Structure:** Code organized by feature (`src/features/*`) to promote modularity and SRP.
* **SOLID Principles:** Emphasis on Single Responsibility (hooks, repositories, components), Dependency Inversion (hooks abstracting logic, components depending on hooks/context), Open/Closed (feature folders, generic hooks).
* **State Management:** Clear separation between server state (React Query) and global client state (Redux Toolkit).
* **Constants:** Centralized constants for layout, query keys, API paths, etc. (`src/constants/*`).
* **Abstraction:** Repositories abstract database logic, API services abstract HTTP calls, custom hooks abstract complex state/logic from UI.

## Getting Started

### Prerequisites

* Node.js (LTS recommended)
* Bun (or Yarn / npm)
* Expo CLI (`npm install -g expo-cli` or `bun install -g expo-cli`)
* Watchman (Recommended for macOS)
* Development Environment Setup for React Native (Android Studio / Xcode) for building the Dev Client.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    # OR yarn install
    # OR npm install
    ```

### Running the App (Development)

This project uses native modules (`expo-sqlite`, `react-native-skia`, `react-native-reanimated`, `react-native-gesture-handler`) and likely requires the **Expo Development Client**.

1.  **Build the Development Client (if first time or after adding/updating native dependencies):**
    ```bash
    # For Android
    npx expo run:android

    # For iOS
    npx expo run:ios
    ```
    Follow the prompts. This will install a custom "Development" version of your app onto your simulator or device.

2.  **Start the Metro Bundler:**
    ```bash
    npx expo start --dev-client
    ```

3.  **Open the App:** Launch the "Development" app previously installed on your device/simulator. It should connect to the Metro bundler.

## Testing

* **Run all tests:**
    ```bash
    bun test
    # OR yarn test
    # OR npm test
    ```
* **Run tests with coverage:**
    ```bash
    bun run test:coverage
    # OR yarn test:coverage
    # OR npm run test:coverage
    ```
    *(Check `package.json` for exact script names)*

Tests include:
* **Unit Tests (Jest):** Located in `tests/unit` or alongside source files (`*.test.ts`). Focus on repositories, Redux logic, hooks.
* **Functional Tests (Jest + RNTL):** Located in `tests/functional` (`*.test.tsx`). Focus on screen rendering, user interactions (filtering, favoriting), using the custom `render` function from `tests/test-utils.tsx`.

## Folder Structure

├── src/
│   ├── api/          # Axios instance, API endpoint functions
│   ├── assets/       # Static assets (fonts, images)
│   ├── components/   # Shared UI components (common, layout, Skia cards)
│   ├── config/       # App configuration (theme definitions)
│   ├── constants/    # Global constants (layout, queryKeys, api paths)
│   ├── database/     # SQLite setup and repositories
│   ├── features/     # Feature-specific modules (screens, components, hooks)
│   ├── hooks/        # Global custom hooks (useDebounce, usePager, useAppState, etc.)
│   ├── navigation/   # React Navigation setup (navigators, types)
│   ├── providers/    # Global context providers (Redux, QueryClient, Theme)
│   ├── store/        # Redux Toolkit setup (store, rootReducer, slices)
│   ├── types/        # Shared TypeScript types (api, common, styled)
│   └── utils/        # Utility functions
├── tests/            # Test files (functional, unit, test-utils)
├── .vscode/          # VS Code settings (optional)
├── app.json          # Expo configuration
├── babel.config.js   # Babel configuration
├── bun.lockb         # Bun lock file (or package-lock.json / yarn.lock)
├── eslint.config.mjs # ESLint Flat Config
├── jest.config.js    # Jest configuration
├── jest.setup.js     # Jest setup (mocks)
├── package.json      # Project dependencies and scripts
├── prettier.config.cjs # Prettier configuration (or .prettierrc)
└── tsconfig.json     # TypeScript configuration


## Potential Improvements / Future Work

* Implement the "Locations" feature from the API.
* Add more detailed Character/Episode detail views (potentially triggered from cards).
* Implement more sophisticated Skia effects (e.g., holo/shimmer effect on cards based on device tilt).
* Add pull-to-refresh on the Favorites screen.
* Enhance error handling with user-facing messages (e.g., Toasts).
* Improve performance testing and optimizations (bundle size, Skia rendering, list performance).
* Increase test coverage (more functional tests, unit tests for hooks/utils).
* Add end-to-end tests (e.g., using Detox or Maestro).
* Integrate analytics or error reporting (Sentry, etc.).
* Refine accessibility features.

## Contributing

(Optional: Add guidelines if open to contributions)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details (assuming MIT).