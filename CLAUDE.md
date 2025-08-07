# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a chess visualization project (`chess-vis`) that is in early development stages. The project is set up as a private npm package with minimal initial structure.

## Development Commands

Currently, the project has minimal npm scripts configured:
- No build command defined yet
- No test framework configured (test script returns error)
- No linting or formatting tools set up

When implementing features, consider setting up:
1. A build process if bundling is needed
2. Testing framework (Jest, Vitest, or similar)
3. Linting (ESLint) and formatting (Prettier)
4. Development server for running the visualization

## Project Structure

The codebase currently consists of:
- `index.js`: Entry point file (currently contains placeholder code)
- `package.json`: Project configuration

## Architecture Considerations

When developing this chess visualization project:

1. **Chess Logic**: Consider whether to implement chess rules from scratch or use a library like chess.js for move validation and game state management.

2. **Visualization Layer**: Determine the rendering approach - Canvas API, SVG, or a framework like React/Vue with component-based board rendering.

3. **Data Structure**: Plan how to represent the chess board state, piece positions, and move history.

4. **User Interaction**: Design how users will interact with the board (click-and-drag, click-to-select, keyboard shortcuts).

## Development Guidelines

- Since this is a visualization project, consider accessibility features like keyboard navigation and screen reader support
- Keep the chess logic separate from the visualization layer for better maintainability
- Consider implementing FEN (Forsyth-Edwards Notation) support for importing/exporting board positions