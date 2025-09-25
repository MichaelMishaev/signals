# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (runs on port 5000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Linting and formatting
npm run lint          # Check linting issues
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

## Architecture Overview

This is a **NextSaaS template collection** built with Next.js 15 featuring 20+ homepage variations and complete inner pages for SaaS applications.

### Key Technologies
- **Next.js 15**: App Router with Turbopack support
- **React 19**: Latest React features
- **TypeScript 5**: Full type safety
- **Tailwind CSS 4**: Utility-first styling
- **GSAP + Lenis**: Premium animations and smooth scrolling
- **next-themes**: Dark/light mode switching

### Project Structure
```
src/
├── app/                    # Next.js 15 App Router
│   ├── homepage-*/         # Multiple homepage variations (01-30+)
│   ├── blog-*/            # Blog page variations
│   ├── login-*/           # Authentication pages
│   └── layout.tsx         # Root layout with theme provider
├── components/
│   ├── homepage-*/        # Homepage-specific components
│   ├── authentication/    # Login/signup components
│   ├── shared/           # Reusable components (header, footer, UI)
│   └── animation/        # GSAP animation components
├── context/              # React contexts for state management
├── data/                 # Static content and markdown files
├── utils/               # Utilities including font configuration
└── interface/           # TypeScript type definitions
```

### Key Architectural Patterns

1. **Component Organization**: Components are organized by page type (homepage-01, homepage-02, etc.) and shared components in `components/shared/`

2. **Animation System**: Uses GSAP with custom animation components like `RevealAnimation` for consistent animations across the site

3. **Theme System**: Integrated dark/light mode using `next-themes` with system preference detection

4. **Font Configuration**: Custom Inter Tight font configuration in `src/utils/font.ts` with variable fonts

5. **Smooth Scrolling**: Lenis smooth scrolling provider wraps the entire application

6. **Path Aliases**: Uses `@/` for src directory and `@public/` for public directory (configured in next.config.ts)

### Code Quality Setup
- **ESLint**: Next.js + TypeScript configuration
- **Prettier**: Code formatting with CSS order and Tailwind plugins
- **Husky**: Pre-commit hooks
- **lint-staged**: Runs linters only on staged files
- **Commitlint**: Enforces conventional commit format

### Development Notes
- Development server runs on port 5000 (modified from default 3000)
- Uses Turbopack for faster development builds
- Template includes 666+ TypeScript files with extensive component library
- Follows conventional commit message format
- All components use TypeScript with proper typing