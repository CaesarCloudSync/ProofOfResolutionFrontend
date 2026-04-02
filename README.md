# Proof of Resolution Frontend

This directory contains the React-based frontend for the Proof of Resolution application. It provides an interface for users to create and view immutable resolutions stored on the blockchain.

## Features

- **React 19 Integration:** Built with the latest React primitives for optimal performance.
- **Resolution Management:** Intuitive UI for adding new goals and viewing the existing chain.
- **Dynamic Updates:** Real-time feedback for mining and validation processes.
- **Modern Styling:** CSS3-based responsive design.

## Project Structure

- `src/App.js`: Main application entry point and routing.
- `src/App.css`: Core application styling.
- `src/index.js`: React DOM rendering.
- `public/`: Static assets and the base HTML template.

## Local Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
The application will be available at `http://localhost:3000`.

## Production Build
To create a production-ready bundle:
```bash
npm run build
```
The optimized assets will be generated in the `build/` directory.

## Available Scripts

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner.
- `npm run build`: Compiles the application for production.
- `npm run eject`: Removes the build dependency for custom configuration.
