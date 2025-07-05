# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BonnardUI is a Next.js 15 application built with React 19, TypeScript, and Tailwind CSS. It integrates with Subframe Core for UI components and includes a comprehensive design system with pre-built components.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Development Server
The development server runs on `http://localhost:3000` by default with Turbopack enabled for faster builds.

## Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with font configuration
│   ├── page.tsx           # Home page
│   ├── signals/           # Signal-related pages
│   └── slack-signal-config/ # Slack integration pages
└── ui/                    # UI components and layouts
    ├── components/        # Reusable UI components
    ├── layouts/          # Page layout components
    └── index.ts          # Component exports
```

### Key Dependencies
- **@subframe/core**: Core UI framework providing icons and utilities
- **@fontsource/dm-sans**: Typography system
- **Tailwind CSS v4**: Styling framework
- **React 19**: Latest React with concurrent features
- **Next.js 15**: App Router with Turbopack

### TypeScript Configuration
- Uses path aliases: `@/*` for `src/*` and `@/ui/*` for `src/ui/*`
- Strict mode enabled
- Target ES2017 with modern module resolution

## Component System

### UI Components
All components are exported from `src/ui/index.ts` and follow Subframe conventions:
- Components use `"use client"` directive when needed
- Built with TypeScript and proper prop interfaces
- Styled with Tailwind CSS classes
- Support variants, sizes, and standard HTML attributes

### Layout Components
- `DefaultPageLayout`: Standard page wrapper
- `DialogLayout`: Modal/dialog wrapper
- `DrawerLayout`: Sidebar/drawer wrapper

### Design System
Components follow a consistent design system with:
- Variant-based styling (brand, neutral, destructive)
- Size options (small, medium, large)
- Proper hover, active, and disabled states
- Icon support with Feather icons from Subframe

## Development Patterns

### Page Components
- Pages are React Server Components by default
- Use `"use client"` for components requiring interactivity
- Import UI components from `@/ui/components/*`
- Follow Next.js App Router conventions

### State Management
- Use React hooks for local state
- Components support controlled/uncontrolled patterns
- Event handlers follow React conventions

### Styling
- Primary styling via Tailwind CSS
- Component-specific styles use utility classes
- Responsive design with mobile-first approach
- Dark mode support where applicable

## Design Guidelines

### Typography Principles
**Line Heights:**
- Titles: 1.1-1.3x line height for tight, impactful headings
- Body text: 1.3-1.5x line height for optimal readability
- Vertical spacing between text blocks should reflect their relationship

**Text Layout:**
- Baseline-align text elements on the same line
- Use more horizontal padding than vertical padding in text containers
- Limit line length to ~20 words for optimal readability
- Left-align text by default, especially for longer content
- Avoid center-aligning multi-line text

**Font Weight Strategy:**
- Use font weights strategically for contrast - "when everything is bold, nothing is bold"
- Regular (400) weight works best for main content
- Reserve bold weights for emphasis and hierarchy

### Component Design Patterns
**Layout Principles:**
- Flexible row-based layouts with clear content separation
- Minimal, consistent padding (0.5rem) for clean, breathable design
- Section titles should have more top padding than bottom padding
- Use spacing to create visual relationships between elements

**Interactive Elements:**
- Focus on micro-interactions and smooth animations
- Subtle color transitions on hover states
- Every UI detail contributes to overall product quality
- Create polished, intentional interactions that enhance user experience

**Visual Hierarchy:**
- Experiment with larger text sizes for marketing/focus areas
- Use CSS variables for consistent color management
- Implement secondary colors for supplementary information
- Consistent icon sizing (1.125rem) with proper vertical alignment

### Subframe Integration Best Practices
**Component Usage:**
- Leverage Subframe's component library for consistency
- Follow Subframe conventions for variants, sizes, and states
- Use Feather icons from Subframe for scalability
- Maintain component-driven development approach

**Responsive Design:**
- Mobile-first breakpoint at 450px
- Flexible display methods (flex/block) for different screen sizes
- Adjust margins and spacing appropriately for smaller screens
- Use media queries for responsive layout adjustments

**Development Approach:**
- Create reusable component libraries for faster development
- Prioritize "delightful user experiences" over basic functionality
- Emphasize clarity and functional elegance in all UI decisions
- Use design to enhance content readability and usability

## Testing and Quality

### Code Quality
- ESLint configuration extends Next.js recommended rules
- TypeScript strict mode for type safety
- Consistent code formatting expected

### Development Workflow
1. Run `npm run dev` for local development
2. Make changes to components or pages
3. Run `npm run lint` to check code quality
4. Build with `npm run build` before deployment