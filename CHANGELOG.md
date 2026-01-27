# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-27

### Added
- ESLint + Prettier configuration for code quality
- Custom hooks for business logic separation
- Component-based architecture
- Unit tests for hooks and components
- Husky pre-commit hooks
- GitHub Actions CI/CD pipeline
- TypeScript strict mode improvements

### Changed
- Refactored monolithic App.tsx (1383 lines) into modular components
- Separated type definitions into dedicated files
- Improved modal positioning (appears at top of viewport)
- Enhanced code organization and maintainability

### Fixed
- Modal positioning issue where player details appeared off-screen
- TypeScript type safety improvements

### Technical Debt
- Reduced App.tsx from 1383 lines to ~200 lines
- Implemented SOLID principles
- Added comprehensive test coverage
- Established CI/CD pipeline

## [0.1.0] - 2026-01-26

### Added
- Initial FM26 Analyzer implementation
- CSV file import functionality
- Player analysis and categorization
- Tactical methodologies evaluation
- Dashboard with statistics
- Squad listing with filters
- Player detail modal
- Responsive design with TailwindCSS

### Features
- Football Manager 2026 player data analysis
- 7 tactical methodologies evaluation
- Player categorization (Elite, Titular, Rotação, etc.)
- Team type filtering (Main, Youth, Reserve, Loan)
- Search and filter capabilities
- Visual charts and statistics
